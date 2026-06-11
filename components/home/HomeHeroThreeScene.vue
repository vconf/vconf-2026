<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'

// ── Types ─────────────────────────────────────────────────────────────────────
interface LayerMesh {
  position: { x: number, y: number, z: number }
  rotation: { x: number, y: number, z: number }
  scale: { set: (_x: number, _y: number, _z: number) => void }
  material: { opacity: number }
}

// ── Colour / opacity / scale tables ──────────────────────────────────────────
const rightLayerColors = [
  '#FFFFFF',
  '#FCDFEC',
  '#FABFD9',
  '#F79FC6',
  '#F57EB2',
  '#F25E9F',
  '#F03E8C',
  '#ED1E79',
  '#EF3C6C',
  '#F15960',
  '#F37753',
  '#F69547',
  '#F8B33A',
  '#FAD02E',
  '#FCEE21',
]
const rightLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 73, 66, 59, 51, 44, 37, 30].map(v => v / 100)
const rightLayerScales = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.79, 0.85, 0.92, 0.98, 1.04, 1.11, 1.17]

const leftLayerColors = [
  '#687A89',
  '#5F8196',
  '#5688A2',
  '#4D8FAF',
  '#4496BC',
  '#3B9DC9',
  '#32A4D5',
  '#29ABE2',
  '#2CADD4',
  '#30AFC7',
  '#33B1B9',
  '#37B2AC',
  '#3AB49E',
  '#3EB691',
  '#41B883',
]
const leftLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 73, 66, 59, 51, 44, 37, 30].map(v => v / 100)
const leftLayerScales = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.79, 0.85, 0.92, 0.98, 1.04, 1.11, 1.17]

const layerCount = rightLayerColors.length
const layers = Array.from({ length: layerCount }, (_, i) => i)
const DEG = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

// ── Desktop SVG tile geometry ─────────────────────────────────────────────────
// viewBox 0 0 2048 1506 (matches hero-full.svg)
// Tile centres from PCA colour-matching on the extracted PNG images
const TILE = 240 // SVG units per side
const TILE_RX = 14 // rounded corners
const leftDesktopScale = 1.18
const rightDesktopScale = 1.09
const leftDesktopOffset = { x: 37, y: 25 }
const rightDesktopOffset = { x: -22, y: -45 }

const leftPos = [
  { cx: 165, cy: 1215 },
  { cx: 190, cy: 1174 },
  { cx: 210, cy: 1111 },
  { cx: 240, cy: 1021 },
  { cx: 281, cy: 905 },
  { cx: 430, cy: 796 },
  { cx: 453, cy: 757 },
  { cx: 501, cy: 751 },
  { cx: 481, cy: 757 },
  { cx: 512, cy: 752 },
  { cx: 573, cy: 760 },
  { cx: 708, cy: 734 },
  { cx: 767, cy: 730 },
  { cx: 792, cy: 725 },
  { cx: 825, cy: 725 },
]
const rightPos = [
  { cx: 1120, cy: 580 },
  { cx: 1173, cy: 528 },
  { cx: 1200, cy: 503 },
  { cx: 1245, cy: 479 },
  { cx: 1299, cy: 453 },
  { cx: 1360, cy: 431 },
  { cx: 1421, cy: 423 },
  { cx: 1476, cy: 443 },
  { cx: 1564, cy: 472 },
  { cx: 1648, cy: 437 },
  { cx: 1715, cy: 385 },
  { cx: 1772, cy: 331 },
  { cx: 1817, cy: 277 },
  { cx: 1856, cy: 243 },
  { cx: 1911, cy: 279 },
]

// Final rotation angles (degrees) — same progression as TresJS leftZAngles/rightZAngles
const leftZDeg = [26, 30, 34, 39, 44, 49, 54, 58, 61, 64, 67, 70, 73, 75, 77]
const rightZDeg = [30, 33, 36, 40, 44, 48, 52, 56, 60, 64, 67, 70, 73, 75, 77]

// ── Mobile TresJS tilt parameters ────────────────────────────────────────────
const leftTiltXBase = -6 * DEG
const leftTiltXSpread = 3 * DEG
const leftTiltYBase = 8 * DEG
const leftTiltYSpread = 9 * DEG
const rightTiltXBase = -4 * DEG
const rightTiltXSpread = 2 * DEG
const rightTiltYBase = -9 * DEG
const rightTiltYSpread = 8 * DEG

// ── Wind sway params (shared desktop + mobile) ────────────────────────────────
const leftWindParams = layers.map((_, i) => ({
  amp: 0.018 + (i % 4) * 0.006,
  freq: 0.28 + (i % 5) * 0.09,
  phase: (i / layerCount) * Math.PI * 2.4,
}))
const rightWindParams = layers.map((_, i) => ({
  amp: 0.016 + (i % 4) * 0.006,
  freq: 0.30 + (i % 5) * 0.08,
  phase: (i / layerCount) * Math.PI * 2.1 + 1.2,
}))

const FALL_END = 0.3 + 14 * 0.09 + 0.09 + 14 * 0.09 + 0.48
const WIND_FADE_DURATION = 1.5

// ── Shared domino-played state ────────────────────────────────────────────────
const dominoPlayed = useState('hero-domino-played', () => false)

// ── Desktop animation state (degree-based, GSAP tweens these) ────────────────
const leftAnimDeg = leftZDeg.map(a => ({ deg: dominoPlayed.value ? a : 90 }))
const rightAnimDeg = rightZDeg.map(a => ({ deg: dominoPlayed.value ? a : 90 }))

// Mobile animation state (radian-based, same as before)
const leftZAngles = leftZDeg.map(a => a * DEG)
const rightZAngles = rightZDeg.map(a => a * DEG)
const leftAnimZ = leftZAngles.map(angle => ({ z: dominoPlayed.value ? angle : Math.PI / 2 }))
const rightAnimZ = rightZAngles.map(angle => ({ z: dominoPlayed.value ? angle : Math.PI / 2 }))

// Pre-computed initial SVG transforms (prevents 1-frame position flash)
const leftInitialTransforms = layers.map(i =>
  `translate(${leftPos[i].cx + leftDesktopOffset.x},${leftPos[i].cy + leftDesktopOffset.y}) rotate(${leftAnimDeg[i].deg}) scale(${leftDesktopScale})`,
)
const rightInitialTransforms = layers.map(i =>
  `translate(${rightPos[i].cx + rightDesktopOffset.x},${rightPos[i].cy + rightDesktopOffset.y}) rotate(${rightAnimDeg[i].deg}) scale(${rightDesktopScale})`,
)

// ── Desktop SVG refs ──────────────────────────────────────────────────────────
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgRef = ref<SVGImageElement | null>(null)
const leftTileRefs = shallowRef<Array<SVGGElement | null>>([])
const rightTileRefs = shallowRef<Array<SVGGElement | null>>([])

function setLeftTileRef(el: unknown, i: number) {
  leftTileRefs.value[i] = el as SVGGElement | null
}
function setRightTileRef(el: unknown, i: number) {
  rightTileRefs.value[i] = el as SVGGElement | null
}

// ── Mobile TresJS refs ────────────────────────────────────────────────────────
const leftLayerRefs = shallowRef<Array<LayerMesh | null>>([])
const rightLayerRefs = shallowRef<Array<LayerMesh | null>>([])
const bgRef = ref<HTMLImageElement | null>(null)
const heroCenter = { boardSrc: '/home/hero-middle-bg.svg', centerSrc: '/home/hero-middle.svg' } as const

function setLeftLayerRef(mesh: LayerMesh | null, i: number) {
  leftLayerRefs.value[i] = mesh ?? null
}
function setRightLayerRef(mesh: LayerMesh | null, i: number) {
  rightLayerRefs.value[i] = mesh ?? null
}

// ── Shared domino trigger ─────────────────────────────────────────────────────
function startDominoAnimation(mode: 'desktop' | 'mobile') {
  if (dominoPlayed.value)
    return
  dominoPlayed.value = true
  const { gsap } = useGsap()
  if (!gsap)
    return
  const stagger = 0.09
  const dur = 0.48
  const leftEnd = 0.3 + (layerCount - 1) * stagger

  if (mode === 'desktop') {
    leftAnimDeg.forEach((s, i) =>
      gsap.to(s, { deg: leftZDeg[i], duration: dur, delay: 0.3 + i * stagger, ease: 'power4.out' }))
    rightAnimDeg.forEach((s, i) =>
      gsap.to(s, { deg: rightZDeg[i], duration: dur, delay: leftEnd + stagger + i * stagger, ease: 'power4.out' }))
  }
  else {
    leftAnimZ.forEach((s, i) =>
      gsap.to(s, { z: leftZAngles[i], duration: dur, delay: 0.3 + i * stagger, ease: 'power4.out' }))
    rightAnimZ.forEach((s, i) =>
      gsap.to(s, { z: rightZAngles[i], duration: dur, delay: leftEnd + stagger + i * stagger, ease: 'power4.out' }))
  }
}

// ── Desktop RAF loop ──────────────────────────────────────────────────────────
let rafId: number | null = null
let desktopElapsed = 0
let desktopReady = false
let desktopFrameCount = 0
let prevTs: number | null = null

function svgTick(ts: number) {
  const dt = prevTs ? (ts - prevTs) / 1000 : 0.016
  prevTs = ts
  desktopElapsed += dt
  const windStrength = Math.max(0, Math.min(1, (desktopElapsed - FALL_END) / WIND_FADE_DURATION))

  leftTileRefs.value.forEach((el, i) => {
    if (!el)
      return
    const w = leftWindParams[i]
    const wind = windStrength * Math.sin(desktopElapsed * w.freq * Math.PI * 2 + w.phase) * w.amp * RAD_TO_DEG
    el.setAttribute(
      'transform',
      `translate(${leftPos[i].cx + leftDesktopOffset.x},${leftPos[i].cy + leftDesktopOffset.y}) rotate(${leftAnimDeg[i].deg + wind}) scale(${leftDesktopScale})`,
    )
  })

  rightTileRefs.value.forEach((el, i) => {
    if (!el)
      return
    const w = rightWindParams[i]
    const wind = windStrength * Math.sin(desktopElapsed * w.freq * Math.PI * 2 + w.phase) * w.amp * RAD_TO_DEG
    el.setAttribute(
      'transform',
      `translate(${rightPos[i].cx + rightDesktopOffset.x},${rightPos[i].cy + rightDesktopOffset.y}) rotate(${rightAnimDeg[i].deg + wind}) scale(${rightDesktopScale})`,
    )
  })

  if (!desktopReady) {
    desktopFrameCount++
    if (desktopFrameCount > 3) {
      const ready = leftTileRefs.value.filter(Boolean).length === layerCount
        && rightTileRefs.value.filter(Boolean).length === layerCount
      if (ready) {
        desktopReady = true
        startDominoAnimation('desktop')
      }
    }
  }
  rafId = requestAnimationFrame(svgTick)
}

// ── Mobile TresJS per-frame ───────────────────────────────────────────────────
let mobileElapsed = 0
let mobileReady = false
let mobileFrameCount = 0

const leftP0x = -10.2
const leftP0y = -5.9
const leftP1x = -6.4
const leftP1y = 0.8
const rightP1x = 4.8
const rightP1y = 1.9
const rightP2x = 10.6
const rightP2y = 3.1

function onLoop(ctx: unknown) {
  const delta = (ctx as { delta?: number })?.delta ?? 0.016
  mobileElapsed += delta
  const windStrength = Math.max(0, Math.min(1, (mobileElapsed - FALL_END) / WIND_FADE_DURATION))
  const ax = -0.2
  const ay = -1.2

  leftLayerRefs.value.forEach((mesh, i) => {
    if (!mesh)
      return
    const t = i / (layerCount - 1)
    const mt = 1 - t
    mesh.position.x = mt * mt * leftP0x + 2 * mt * t * leftP1x + t * t * ax
    mesh.position.y = mt * mt * leftP0y + 2 * mt * t * leftP1y + t * t * ay
    mesh.position.z = -i * 0.085 - 0.18
    mesh.rotation.x = leftTiltXBase + (i / (layerCount - 1)) * leftTiltXSpread
    mesh.rotation.y = leftTiltYBase + (i / (layerCount - 1)) * leftTiltYSpread
    const w = leftWindParams[i]
    mesh.rotation.z = leftAnimZ[i].z + windStrength * Math.sin(mobileElapsed * w.freq * Math.PI * 2 + w.phase) * w.amp
    mesh.scale.set(leftLayerScales[i], leftLayerScales[i], 1)
    mesh.material.opacity = leftLayerOpacities[i]
  })

  rightLayerRefs.value.forEach((mesh, i) => {
    if (!mesh)
      return
    const t = i / (layerCount - 1)
    const mt = 1 - t
    mesh.position.x = mt * mt * ax + 2 * mt * t * rightP1x + t * t * rightP2x
    mesh.position.y = mt * mt * ay + 2 * mt * t * rightP1y + t * t * rightP2y
    mesh.position.z = -i * 0.085
    mesh.rotation.x = rightTiltXBase + (i / (layerCount - 1)) * rightTiltXSpread
    mesh.rotation.y = rightTiltYBase - (i / (layerCount - 1)) * rightTiltYSpread
    const w = rightWindParams[i]
    mesh.rotation.z = rightAnimZ[i].z + windStrength * Math.sin(mobileElapsed * w.freq * Math.PI * 2 + w.phase) * w.amp
    mesh.scale.set(rightLayerScales[i], rightLayerScales[i], 1)
    mesh.material.opacity = rightLayerOpacities[i]
  })

  if (!mobileReady) {
    mobileFrameCount++
    if (mobileFrameCount > 3) {
      const ready = leftLayerRefs.value.filter(Boolean).length === layerCount
        && rightLayerRefs.value.filter(Boolean).length === layerCount
      if (ready) {
        mobileReady = true
        startDominoAnimation('mobile')
      }
    }
  }
}

// ── onMounted ─────────────────────────────────────────────────────────────────
onMounted(() => {
  const { gsap } = useGsap()
  if (!gsap)
    return

  const breathe = (el: Element) => {
    gsap.to(el, {
      opacity: 0.85,
      duration: 1.8,
      ease: 'power2.out',
      onComplete() {
        const tl = gsap.timeline({ repeat: -1 })
        tl.to(el, { opacity: 0.45, duration: 1.4, ease: 'sine.inOut' })
          .to(el, { opacity: 0.85, duration: 1.2, ease: 'sine.inOut' })
          .to(el, { opacity: 0.05, duration: 0.06, ease: 'none' })
          .to(el, { opacity: 0.7, duration: 0.05, ease: 'none' })
          .to(el, { opacity: 0.08, duration: 0.08, ease: 'none' })
          .to(el, { opacity: 0.8, duration: 0.4, ease: 'power2.out' })
          .to(el, { opacity: 0.4, duration: 1.5, ease: 'sine.inOut' })
          .to(el, { opacity: 0.82, duration: 1.3, ease: 'sine.inOut' })
      },
    })
  }

  if (window.innerWidth >= 768) {
    if (heroSvgRef.value)
      gsap.fromTo(heroSvgRef.value, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    if (svgBgRef.value)
      breathe(svgBgRef.value as unknown as Element)
    rafId = requestAnimationFrame(svgTick)
  }
  else {
    if (bgRef.value)
      breathe(bgRef.value)
  }
})

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<template>
  <div>
    <!-- 桌機：inline SVG，每張牌獨立動畫，尺寸對齊 hero-full-reconstructed.svg -->
    <svg
      ref="heroSvgRef"
      class="hidden w-full md:block"
      style="opacity: 0; overflow: visible;"
      viewBox="0 0 2048 1506"
      preserveAspectRatio="xMidYMin meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 左扇 (藍/青色系, 15 張) -->
      <g
        v-for="i in layers"
        :key="`tl-${i}`"
        :ref="(el: unknown) => setLeftTileRef(el, i)"
        :transform="leftInitialTransforms[i]"
      >
        <rect
          :x="-TILE / 2"
          :y="-TILE / 2"
          :width="TILE"
          :height="TILE"
          :rx="TILE_RX"
          :fill="leftLayerColors[i]"
          :fill-opacity="leftLayerOpacities[i]"
          transform="skewX(15)"
        />
      </g>

      <!-- 右扇 (粉/黃色系, 15 張) -->
      <g
        v-for="i in layers"
        :key="`tr-${i}`"
        :ref="(el: unknown) => setRightTileRef(el, i)"
        :transform="rightInitialTransforms[i]"
      >
        <rect
          :x="-TILE / 2"
          :y="-TILE / 2"
          :width="TILE"
          :height="TILE"
          :rx="TILE_RX"
          :fill="rightLayerColors[i]"
          :fill-opacity="rightLayerOpacities[i]"
          transform="skewX(15)"
        />
      </g>

      <!-- 電路板底圖 (GSAP 霓虹閃爍) -->
      <image
        ref="svgBgRef"
        href="/home/hero-middle-bg.svg"
        x="656.47"
        y="286.628"
        width="615.668"
        height="646.435"
        opacity="0"
      />

      <!-- 中心骨牌圖 -->
      <image
        href="/home/hero-middle.svg"
        x="656.47"
        y="286.628"
        width="615.668"
        height="646.435"
      />
    </svg>

    <!-- 手機：TresJS 骨牌動畫 (unchanged) -->
    <div class="grid w-full place-items-center md:hidden">
      <TresCanvas
        class="col-start-1 row-start-1 size-full"
        :alpha="true"
        :clear-alpha="0"
        clear-color="#ffffff"
        @loop="onLoop"
      >
        <TresPerspectiveCamera
          :position="[0, 0, 24]"
          :fov="24"
        />

        <TresMesh
          v-for="index in layers"
          :key="`left-${index}`"
          :ref="(mesh: unknown) => setLeftLayerRef(mesh as LayerMesh | null, index)"
        >
          <TresBoxGeometry :args="[3.2, 3.2, 0.16]" />
          <TresMeshBasicMaterial
            :color="leftLayerColors[index]"
            transparent
            :opacity="leftLayerOpacities[index]"
            :side="2"
            :depth-write="false"
          />
        </TresMesh>

        <TresMesh
          v-for="index in layers"
          :key="`right-${index}`"
          :ref="(mesh: unknown) => setRightLayerRef(mesh as LayerMesh | null, index)"
        >
          <TresBoxGeometry :args="[3.2, 3.2, 0.16]" />
          <TresMeshBasicMaterial
            :color="rightLayerColors[index]"
            transparent
            :opacity="rightLayerOpacities[index]"
            :side="2"
            :depth-write="false"
          />
        </TresMesh>
      </TresCanvas>

      <!-- 中心元素：電路板底圖 + 骨牌本體 -->
      <div
        class="pointer-events-none relative col-start-1 row-start-1 grid place-items-center"
        :style="{ height: 'clamp(160px, 59vh, 576px)', width: 'auto', aspectRatio: '615.668 / 646.435' }"
      >
        <img
          ref="bgRef"
          :src="heroCenter.boardSrc"
          aria-hidden="true"
          class="pointer-events-none col-start-1 row-start-1 size-full scale-[1.18] object-contain opacity-0"
        />
        <img
          :src="heroCenter.centerSrc"
          alt=""
          class="relative z-10 col-start-1 row-start-1 size-full object-contain"
        />
      </div>
    </div>
  </div>
</template>
