<script setup lang="ts">
import type { RecapPhoto } from '~/config/recap'
import { onKeyStroke } from '@vueuse/core'
import RecapPhotoModal from '~/components/recap/RecapPhotoModal.vue'
import {
  adjacentRecapPhoto,
  findRecapPhoto,
  RECAP_BASE_PATH,
  recapPhotos,
} from '~/config/recap'

const RECAP_DESCRIPTION
  = 'v-conf Taiwan 2026 活動現場花絮，記錄議程、講者與參與者在會場的每一刻'

const route = useRoute()
const lenis = useLenis()
const photoId = computed(() => {
  const value = route.params.photo

  return Array.isArray(value) ? value[0] : value
})
const activePhoto = computed(() => findRecapPhoto(photoId.value))
const { registerRecapModalImages, preloadRecapPhoto } = useRecapImages()

if (import.meta.server)
  registerRecapModalImages(recapPhotos)

function backToList() {
  return navigateTo(RECAP_BASE_PATH, { replace: true })
}

if (photoId.value && !activePhoto.value)
  await backToList()

// 花絮頁還沒公開，正式上線時移除並補上 sitemap
useSeoMeta({
  title: () => activePhoto.value?.alt ?? '活動花絮',
  description: () =>
    activePhoto.value
      ? `${activePhoto.value.alt}｜${RECAP_DESCRIPTION}`
      : RECAP_DESCRIPTION,
  robots: 'noindex, nofollow',
})

const visible = ref(false)
const closeRequested = ref(false)
let isScrollLockedByModal = false
let openRequest = 0

function lockBackgroundScroll() {
  lenis.stop()
  isScrollLockedByModal = true
}

function unlockBackgroundScroll() {
  if (!isScrollLockedByModal)
    return

  lenis.start()
  isScrollLockedByModal = false
}

/** 左右各先抓一張，按方向鍵或滑動時不會等圖 */
function warmNeighbours() {
  for (const step of [1, -1] as const) {
    const neighbour = adjacentRecapPhoto(activePhoto.value, step)

    if (neighbour)
      void preloadRecapPhoto(neighbour, 'low')
  }
}

async function open() {
  const request = ++openRequest
  const photo = activePhoto.value

  if (!photo)
    return

  closeRequested.value = false
  lockBackgroundScroll()

  await preloadRecapPhoto(photo, 'high')

  if (request !== openRequest || activePhoto.value !== photo)
    return

  visible.value = true
  warmNeighbours()
}

onMounted(() => {
  if (!photoId.value)
    return

  if (activePhoto.value)
    void open()
  else backToList()
})

watch(photoId, (value) => {
  if (value) {
    if (!activePhoto.value) {
      backToList()

      return
    }
    if (visible.value) {
      warmNeighbours()

      return
    }

    void open()

    return
  }

  openRequest++
  if (!visible.value)
    return unlockBackgroundScroll()

  // 瀏覽器返回時，網址會先改變，再由同一個頁面元件淡出燈箱。
  if (!closeRequested.value) {
    lockBackgroundScroll()
    visible.value = false
  }
})

/**
 * 換照片用 replace：燈箱裡連按十幾張不該在上一頁堆十幾筆紀錄，
 * 使用者按返回時預期回到的是列表。
 */
function selectPhoto(photo: RecapPhoto) {
  if (photo.id === photoId.value)
    return

  return navigateTo(`${RECAP_BASE_PATH}/${photo.id}`, { replace: true })
}

function stepPhoto(step: 1 | -1) {
  const target = adjacentRecapPhoto(activePhoto.value, step)

  if (target)
    void selectPhoto(target)
}

function close() {
  if (!visible.value || closeRequested.value)
    return

  closeRequested.value = true
  openRequest++
  visible.value = false
}

async function afterLeave() {
  if (closeRequested.value && photoId.value)
    await backToList()

  closeRequested.value = false
  unlockBackgroundScroll()

  // 用 Esc 關燈箱算鍵盤操作，focus-visible 會把焦點環留在剛剛那張照片上
  if (import.meta.client)
    (document.activeElement as HTMLElement | null)?.blur()
}

onKeyStroke('Escape', close)
onKeyStroke('ArrowLeft', () => visible.value && stepPhoto(-1))
onKeyStroke('ArrowRight', () => visible.value && stepPhoto(1))
onBeforeUnmount(unlockBackgroundScroll)
</script>

<template>
  <main>
    <ShareHero title="Event Photos" />
    <RecapPhotoGrid />
    <RecapPhotoModal
      :visible="visible"
      :photo="activePhoto"
      :photos="recapPhotos"
      @close="close"
      @after-leave="afterLeave"
      @select="selectPhoto"
      @prev="stepPhoto(-1)"
      @next="stepPhoto(1)"
    />
  </main>
</template>
