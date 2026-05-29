<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'

interface LayerMesh {
  position: { x: number, y: number, z: number }
  rotation: { x: number, y: number, z: number }
  scale: { set: (_x: number, _y: number, _z: number) => void }
  material: { opacity: number }
}

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
const rightLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 73, 66, 59, 51, 44, 37, 30]
  .map(value => value / 100)
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
const leftLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 73, 66, 59, 51, 44, 37, 30]
  .map(value => value / 100)
const leftLayerScales = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.79, 0.85, 0.92, 0.98, 1.04, 1.11, 1.17]

const layerCount = rightLayerColors.length
const layers = Array.from({ length: layerCount }, (_, i) => i)
const degToRad = Math.PI / 180

const leftZAngles = [26, 30, 34, 39, 44, 49, 54, 58, 61, 64, 67, 70, 73, 75, 77]
  .map(a => a * degToRad)
const rightZAngles = [30, 33, 36, 40, 44, 48, 52, 56, 60, 64, 67, 70, 73, 75, 77]
  .map(a => a * degToRad)

const leftTiltXBase = -6 * degToRad
const leftTiltXSpread = 3 * degToRad
const leftTiltYBase = 8 * degToRad
const leftTiltYSpread = 9 * degToRad

const rightTiltXBase = -4 * degToRad
const rightTiltXSpread = 2 * degToRad
const rightTiltYBase = -9 * degToRad
const rightTiltYSpread = 8 * degToRad

const leftLayerRefs = shallowRef<Array<LayerMesh | null>>([])
const rightLayerRefs = shallowRef<Array<LayerMesh | null>>([])
const bgRef = ref<HTMLImageElement | null>(null)
// 高度跟隨 Three.js 垂直 FOV 縮放（fov=24 → 59vh ≈ 531px at 900px viewport）
// 寬度由 aspect-ratio 自動推算，保持原始 615.668 × 646.435 比例
const mainImageSize = {
  height: 'clamp(160px, 59vh, 576px)',
  width: 'auto',
  aspectRatio: '615.668 / 646.435',
}

// 跨頁面導航保持狀態，確保骨牌動畫整個 session 只播一次
const dominoPlayed = useState('hero-domino-played', () => false)

// 已播過則直接從最終角度初始化，否則從直立（π/2）開始等待動畫
const leftAnimZ = leftZAngles.map(angle => ({ z: dominoPlayed.value ? angle : Math.PI / 2 }))
const rightAnimZ = rightZAngles.map(angle => ({ z: dominoPlayed.value ? angle : Math.PI / 2 }))

// 風吹參數，預先計算避免每幀重複運算
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

let animationStarted = false
let frameCount = 0
let elapsed = 0

// 倒下動畫總時長：左鏈 0.3+(14×0.09) + 右鏈 0.09+(14×0.09) + 每張持續 0.48 ≈ 3.42s
const FALL_END = 0.3 + 14 * 0.09 + 0.09 + 14 * 0.09 + 0.48
const WIND_FADE_DURATION = 1.5

function setLeftLayerRef(mesh: LayerMesh | null, index: number) {
  leftLayerRefs.value[index] = mesh ?? null
}

function setRightLayerRef(mesh: LayerMesh | null, index: number) {
  rightLayerRefs.value[index] = mesh ?? null
}

function startDominoAnimation() {
  // 已播過則跳過，tiles 已在最終角度
  if (dominoPlayed.value)
    return

  dominoPlayed.value = true

  const { gsap } = useGsap()
  if (!gsap)
    return

  const stagger = 0.09
  const baseDuration = 0.48

  // 左側：由外（0）向中心（14）依序倒下
  leftAnimZ.forEach((state, i) => {
    gsap.to(state, {
      z: leftZAngles[i],
      duration: baseDuration,
      delay: 0.3 + i * stagger,
      ease: 'power4.out',
    })
  })

  // 右側：接續左側，由中心（0）向外（14）延伸，形成一波連鎖
  const leftChainEnd = 0.3 + (layerCount - 1) * stagger
  rightAnimZ.forEach((state, i) => {
    gsap.to(state, {
      z: rightZAngles[i],
      duration: baseDuration,
      delay: leftChainEnd + stagger + i * stagger,
      ease: 'power4.out',
    })
  })
}

function onLoop(loopContext: unknown) {
  const delta = (loopContext as { delta?: number })?.delta ?? 0.016
  elapsed += delta

  // Wind strength fades in smoothly after the fall animation finishes
  const windStrength = Math.max(0, Math.min(1, (elapsed - FALL_END) / WIND_FADE_DURATION))

  const anchorX = -0.2
  const anchorY = -1.2 // 貝茲曲線錨點（左右兩側的收束中心）

  leftLayerRefs.value.forEach((mesh, index) => {
    if (!mesh)
      return

    const depth = index / Math.max(layerCount - 1, 1)
    const t = depth
    const oneMinusT = 1 - t
    const p0x = -10.2
    const p0y = -5.9
    const p1x = -6.4
    const p1y = 0.8
    const p2x = anchorX
    const p2y = anchorY

    mesh.position.x = oneMinusT * oneMinusT * p0x + 2 * oneMinusT * t * p1x + t * t * p2x
    mesh.position.y = oneMinusT * oneMinusT * p0y + 2 * oneMinusT * t * p1y + t * t * p2y
    mesh.position.z = -index * 0.085 - 0.18

    mesh.rotation.x = leftTiltXBase + depth * leftTiltXSpread
    mesh.rotation.y = leftTiltYBase + depth * leftTiltYSpread

    const { amp, freq, phase } = leftWindParams[index]
    const wind = windStrength * Math.sin(elapsed * freq * Math.PI * 2 + phase) * amp
    mesh.rotation.z = leftAnimZ[index].z + wind

    const scale = leftLayerScales[index]
    mesh.scale.set(scale, scale, 1)
    mesh.material.opacity = leftLayerOpacities[index]
  })

  rightLayerRefs.value.forEach((mesh, index) => {
    if (!mesh)
      return

    const depth = index / Math.max(layerCount - 1, 1)
    const t = depth
    const oneMinusT = 1 - t
    const p0x = anchorX
    const p0y = anchorY
    const p1x = 4.8
    const p1y = 1.9
    const p2x = 10.6
    const p2y = 3.1

    mesh.position.x = oneMinusT * oneMinusT * p0x + 2 * oneMinusT * t * p1x + t * t * p2x
    mesh.position.y = oneMinusT * oneMinusT * p0y + 2 * oneMinusT * t * p1y + t * t * p2y
    mesh.position.z = -index * 0.085

    mesh.rotation.x = rightTiltXBase + depth * rightTiltXSpread
    mesh.rotation.y = rightTiltYBase - depth * rightTiltYSpread

    const { amp, freq, phase } = rightWindParams[index]
    const wind = windStrength * Math.sin(elapsed * freq * Math.PI * 2 + phase) * amp
    mesh.rotation.z = rightAnimZ[index].z + wind

    const scale = rightLayerScales[index]
    mesh.scale.set(scale, scale, 1)
    mesh.material.opacity = rightLayerOpacities[index]
  })

  // mesh refs 就緒後才觸發骨牌動畫（等幾幀確保全部掛載）
  if (!animationStarted) {
    frameCount++
    if (frameCount > 3) {
      const leftReady = leftLayerRefs.value.filter(r => r !== null).length === layerCount
      const rightReady = rightLayerRefs.value.filter(r => r !== null).length === layerCount
      if (leftReady && rightReady) {
        animationStarted = true
        startDominoAnimation()
      }
    }
  }
}

onMounted(() => {
  const { gsap } = useGsap()
  const el = bgRef.value
  if (!gsap || !el)
    return

  // 進場淡入，結束後進入「慢呼吸 + 偶爾霓虹閃爍」循環
  gsap.to(el, {
    opacity: 0.85,
    duration: 1.8,
    ease: 'power2.out',
    onComplete() {
      const tl = gsap.timeline({ repeat: -1 })

      // 呼吸
      tl.to(el, { opacity: 0.45, duration: 1.4, ease: 'sine.inOut' })
        .to(el, { opacity: 0.85, duration: 1.2, ease: 'sine.inOut' })

      // 霓虹閃爍（快速斷訊再恢復）
        .to(el, { opacity: 0.05, duration: 0.06, ease: 'none' })
        .to(el, { opacity: 0.7, duration: 0.05, ease: 'none' })
        .to(el, { opacity: 0.08, duration: 0.08, ease: 'none' })
        .to(el, { opacity: 0.8, duration: 0.4, ease: 'power2.out' })

      // 閃爍後繼續呼吸
        .to(el, { opacity: 0.4, duration: 1.5, ease: 'sine.inOut' })
        .to(el, { opacity: 0.82, duration: 1.3, ease: 'sine.inOut' })
    },
  })
})
</script>

<template>
  <div class="grid size-full place-items-center overflow-hidden">
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

    <!-- 中心元素：hero-middle-bg（電路板底圖）+ hero-middle（3D 骨牌本體） -->
    <div
      class="pointer-events-none relative col-start-1 row-start-1 grid place-items-center"
      :style="mainImageSize"
    >
      <!-- 電路板背景：霓虹閃爍動畫，完整顯示 SVG -->
      <img
        ref="bgRef"
        src="/home/hero-middle-bg.svg"
        aria-hidden="true"
        class="pointer-events-none absolute object-contain opacity-0"
        style="width: 118%; height: 118%; top: -9%; left: -9%;"
      />

      <!-- 中心骨牌立體圖，壓在兩側扇形上方形成一體感 -->
      <img
        src="/home/hero-middle.svg"
        alt=""
        class="relative z-10 size-full object-contain"
      />
    </div>
  </div>
</template>
