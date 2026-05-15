<script setup>
import { ref, shallowRef } from 'vue'

useHead({
  title: 'Home - Nuxt App',
  meta: [{ name: 'description', content: 'Welcome to our modern Nuxt 3 application' }],
})

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

const leftLayerRefs = shallowRef([])
const rightLayerRefs = shallowRef([])
const hasMainImage = ref(true)
const mainImageSize = {
  width: '615.67px',
  height: '646.43px',
}

function setLeftLayerRef(mesh, index) {
  leftLayerRefs.value[index] = mesh ?? null
}

function setRightLayerRef(mesh, index) {
  rightLayerRefs.value[index] = mesh ?? null
}

function onMainImageError() {
  hasMainImage.value = false
}

function onLoop(_loopContext) {
  leftLayerRefs.value.forEach((mesh, index) => {
    if (!mesh)
      return

    const depth = index / Math.max(layerCount - 1, 1)
    const t = depth
    const oneMinusT = 1 - t
    const p0x = -9.1
    const p0y = -4.8
    const p1x = -6.1
    const p1y = 2.8
    const p2x = -0.6
    const p2y = -0.15

    mesh.position.x = oneMinusT * oneMinusT * p0x + 2 * oneMinusT * t * p1x + t * t * p2x
    mesh.position.y = oneMinusT * oneMinusT * p0y + 2 * oneMinusT * t * p1y + t * t * p2y
    mesh.position.z = -index * 0.08 - 0.2

    mesh.rotation.x = 0
    mesh.rotation.y = 0
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
    const p0x = -0.2
    const p0y = -0.1
    const p1x = 3.8
    const p1y = 2.9
    const p2x = 9.6
    const p2y = 3.35

    mesh.position.x = oneMinusT * oneMinusT * p0x + 2 * oneMinusT * t * p1x + t * t * p2x
    mesh.position.y = oneMinusT * oneMinusT * p0y + 2 * oneMinusT * t * p1y + t * t * p2y
    mesh.position.z = -index * 0.08

    mesh.rotation.x = 0
    mesh.rotation.y = 0
    mesh.rotation.z = rightZAngles[index]

    const scale = rightLayerScales[index]
    mesh.scale.set(scale, scale, 1)

    mesh.material.opacity = rightLayerOpacities[index]
  })
}
</script>

<template>
  <div>
    <div class="h-[200px] w-screen overflow-hidden">
      <!-- <TresCanvas
        window-size
        clear-color="#ffffff"
        @loop="onLoop"
      >
        <TresPerspectiveCamera
          :position="[0, 0, 24]"
          :fov="18"
        />

        <TresMesh
          v-for="index in layers"
          :key="`left-${index}`"
          :ref="(mesh) => setLeftLayerRef(mesh, index)"
        >
          <TresPlaneGeometry :args="[3.2, 3.2]" />
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
          :ref="(mesh) => setRightLayerRef(mesh, index)"
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
      </div> -->
    </div>
  </div>
</template>
