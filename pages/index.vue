<script setup lang="ts">
import { ref, shallowRef } from 'vue'

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
const hasMainImage = ref(true)
const mainImageSize = {
  width: '615.67px',
  height: '646.43px',
}

function setLeftLayerRef(mesh: LayerMesh | null, index: number) {
  leftLayerRefs.value[index] = mesh ?? null
}

function setRightLayerRef(mesh: LayerMesh | null, index: number) {
  rightLayerRefs.value[index] = mesh ?? null
}

function onMainImageError() {
  hasMainImage.value = false
}

function onLoop(_loopContext: unknown) {
  const anchorX = -0.2
  const anchorY = -1.2

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
    mesh.rotation.z = leftZAngles[index]

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
    // 貝茲曲線
    const p0x = anchorX // 起點（與左側共用下方錨點）
    const p0y = anchorY
    const p1x = 4.8 // 控制點（決定彎曲方向）
    const p1y = 1.9
    const p2x = 10.6 // 終點
    const p2y = 3.1

    mesh.position.x = oneMinusT * oneMinusT * p0x + 2 * oneMinusT * t * p1x + t * t * p2x
    mesh.position.y = oneMinusT * oneMinusT * p0y + 2 * oneMinusT * t * p1y + t * t * p2y
    mesh.position.z = -index * 0.085

    mesh.rotation.x = rightTiltXBase + depth * rightTiltXSpread
    mesh.rotation.y = rightTiltYBase - depth * rightTiltYSpread
    mesh.rotation.z = rightZAngles[index]

    const scale = rightLayerScales[index]
    mesh.scale.set(scale, scale, 1)

    mesh.material.opacity = rightLayerOpacities[index]
  })
}

// ---

const colorMode = useColorMode()

function toggleTheme(theme: 'dark' | 'light') {
  colorMode.preference = theme
}
</script>

<template>
  <div>
    <!-- 首頁主要 logo -->
    <NuxtImg
      class="m-auto hidden pt-[50px] md:block"
      width="455"
      height="230"
      src="/home/hero-logo-md.svg"
      loading="eager"
      placeholder
    />
    <NuxtImg
      class="m-auto block pt-[50px] md:hidden"
      width="264"
      height="133"
      src="/home/hero-logo-sm.svg"
      loading="eager"
      placeholder
    />

    <!-- 切換按鈕 -->
    <div
      class="ml-[17px] mt-[79px] hidden w-fit flex-col gap-2 rounded-full bg-vconf-theme-toggle-bg px-2 py-3 md:flex"
    >
      <button
        type="button"
        class="grid size-[39px] place-content-center rounded-full border border-vconf-sun bg-vconf-sun-background text-vconf-sun"
        aria-label="Switch to light mode"
        @click="toggleTheme('light')"
      >
        <svg
          width="24"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7107 18.895C15.0299 18.895 17.7207 16.2042 17.7207 12.885C17.7207 9.56577 15.0299 6.875 11.7107 6.875C8.39145 6.875 5.70068 9.56577 5.70068 12.885C5.70068 16.2042 8.39145 18.895 11.7107 18.895Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M12.8157 1.105C12.8157 0.494725 12.321 0 11.7107 0C11.1004 0 10.6057 0.494725 10.6057 1.105V4.23C10.6057 4.84027 11.1004 5.335 11.7107 5.335C12.321 5.335 12.8157 4.84027 12.8157 4.23V1.105Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M12.8157 21.54C12.8157 20.9297 12.321 20.435 11.7107 20.435C11.1004 20.435 10.6057 20.9297 10.6057 21.54V24.665C10.6057 25.2753 11.1004 25.77 11.7107 25.77C12.321 25.77 12.8157 25.2753 12.8157 24.665V21.54Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M2.0655 6.03513C1.53698 5.72999 0.861177 5.91107 0.55604 6.43959C0.250903 6.9681 0.431985 7.64391 0.960498 7.94905L3.66683 9.51155C4.19534 9.81668 4.87115 9.6356 5.17629 9.10709C5.48142 8.57857 5.30034 7.90277 4.77183 7.59763L2.0655 6.03513Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M19.7595 16.2533C19.231 15.9482 18.5551 16.1293 18.25 16.6578C17.9449 17.1863 18.126 17.8621 18.6545 18.1672L21.3608 19.7297C21.8893 20.0349 22.5651 19.8538 22.8703 19.3253C23.1754 18.7968 22.9943 18.121 22.4658 17.8158L19.7595 16.2533Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M0.956939 17.8176C0.428426 18.1228 0.247343 18.7986 0.55248 19.3271C0.857618 19.8556 1.53343 20.0367 2.06194 19.7316L4.76827 18.1691C5.29678 17.8639 5.47786 17.1881 5.17273 16.6596C4.86759 16.1311 4.19178 15.95 3.66327 16.2551L0.956939 17.8176Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
          <path
            d="M18.658 7.60078C18.1295 7.90592 17.9484 8.58173 18.2535 9.11024C18.5587 9.63875 19.2345 9.81984 19.763 9.5147L22.4693 7.9522C22.9978 7.64706 23.1789 6.97125 22.8738 6.44274C22.5686 5.91423 21.8928 5.73315 21.3643 6.03828L18.658 7.60078Z"
            fill="currentColor"
            fill-opacity="0.5"
          />
        </svg>
      </button>
      <button
        type="button"
        class="grid size-[39px] place-content-center rounded-full border-[0.5px] border-vconf-moon-border bg-vconf-moon-background text-vconf-moon"
        aria-label="Switch to dark mode"
        @click="toggleTheme('dark')"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.015 18.095C8.925 18.095 3.99 13.16 3.99 7.07C3.99 4.38 4.955 1.915 6.555 0C2.685 1.815 0 5.74 0 10.3C0 16.58 5.09 21.67 11.37 21.67C15.435 21.67 19 19.535 21.01 16.33C19.285 17.45 17.23 18.1 15.02 18.1L15.015 18.095Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <!-- 卡牌效果 -->
    <div>
      <!-- 畫布設定 -->
      <TresCanvas
        class="-z-10"
        window-size
        :alpha="true"
        :clear-alpha="0"
        clear-color="#ffffff"
        @loop="onLoop"
      >
        <!-- 透視位置 -->
        <TresPerspectiveCamera
          :position="[0, 0, 24]"
          :fov="20"
        />

        <TresMesh
          v-for="index in layers"
          :key="`left-${index}`"
          :ref="(mesh: unknown) => setLeftLayerRef(mesh as LayerMesh | null, index)"
        >
          <!-- 平面幾何體 -->
          <TresPlaneGeometry :args="[3.2, 3.2]" />
          <!-- 卡牌材質 -->
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
          <TresPlaneGeometry :args="[3.2, 3.2]" />
          <TresMeshBasicMaterial
            :color="rightLayerColors[index]"
            transparent
            :opacity="rightLayerOpacities[index]"
            :side="2"
            :depth-write="false"
          />
        </TresMesh>
      </TresCanvas>

      <div
        class="pointer-events-none absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
        :style="mainImageSize"
      >
        <img
          v-if="hasMainImage"
          src="/main-vue.png"
          alt="main-vue"
          class="size-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.3)]"
          @error="onMainImageError"
        />
        <div
          v-else
          class="grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#f8fbff,#c6d5e8)] text-2xl font-bold text-[#24364b]"
        >
          main-vue
        </div>
      </div>
    </div>
  </div>
</template>
