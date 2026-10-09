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
/**
 * 燈箱正在看哪一張，由這個本地狀態決定，不是網址。
 *
 * 讀網址的話，「現在第幾張」要等 router 導頁完成才更新 —— 導頁還沒結束時再按一次，
 * 算出來的相鄰照片還是同一張，導到同一個網址，那次按鍵就被吞掉。
 * 實測連按 12 次 ArrowRight：間隔 200ms 與 80ms 都還跟得上，但 30ms 只走到 10 張。
 *
 * 網址仍然會跟上（見 selectPhoto），所以分享、重新整理、上一頁都不受影響。
 */
const activeId = ref<string | undefined>()
watch(
  photoId,
  (value) => {
    activeId.value = value
  },
  { immediate: true },
)

const activePhoto = computed(() => findRecapPhoto(activeId.value))
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

/** 燈箱開著時左右兩張就是下一個動作，給 high（目前這張已經 await 完才輪到這裡） */
const transition = useViewTransition()

/**
 * 把 `view-transition-name` 掛到照片牆上的某一格（或拿掉）。
 *
 * 直接操作 DOM 而不是傳狀態進 RecapPhotoGrid：格子上本來就有 `data-recap-item`，
 * 而這個名字的生命週期完全跟著轉場走 —— 掛上、拍舊快照、讓出、拍新快照，
 * 前後不到一個 frame，做成響應式狀態反而要多處理「什麼時候該還原」。
 */
function setMorphThumb(id: string, on: boolean) {
  if (!import.meta.client)
    return

  const el = document.querySelector<HTMLElement>(`[data-recap-item="${id}"]`)

  if (el)
    el.style.viewTransitionName = on ? 'recap-photo' : ''
}

function warmNeighbours() {
  for (const step of [1, -1] as const) {
    const neighbour = adjacentRecapPhoto(activePhoto.value, step)

    if (neighbour)
      void preloadRecapPhoto(neighbour, 'high')
  }
}

async function open() {
  const request = ++openRequest
  const photo = activePhoto.value

  if (!photo)
    return

  closeRequested.value = false
  lockBackgroundScroll()

  // 先卸掉焦點：燈箱裡按 Esc／左右鍵會讓 Chrome 把 focus-visible 補到剛剛點的那張照片上
  if (import.meta.client)
    (document.activeElement as HTMLElement | null)?.blur()

  /*
   * 大圖一定要在轉場**之前**載好。轉場期間整頁是凍結的靜態快照，
   * 把圖片下載放進去，畫面就會在那段時間完全不動 —— 那正是「卡頓感」的來源。
   */
  await preloadRecapPhoto(photo, 'high')

  if (request !== openRequest || activePhoto.value !== photo)
    return

  // 舊快照要抓得到被點的那一格，名字得在轉場開始前就掛上去
  setMorphThumb(photo.id, true)

  await transition(() => {
    // 燈箱接手這個名字，縮圖必須先讓出來 —— 同名重複瀏覽器會放棄整個轉場
    setMorphThumb(photo.id, false)
    visible.value = true
  })

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
  if (photo.id === activeId.value)
    return

  // 先換畫面：本地狀態是同步的，連按多快都不會掉
  activeId.value = photo.id

  /*
   * 網址用 replaceState 跟上，不走 router。
   *
   * 換一張不需要任何伺服器資料 —— 照片清單本來就在 recapPhotos 裡。走 router 只是讓
   * 每次切換多等一次導頁，而那正是快速連按會掉張的原因。
   *
   * history.state 要原封傳回去：router 的捲動位置與返回資訊都存在同一個物件裡。
   * 用 replace 而不是 push，維持原本「連按十幾張不在上一頁堆十幾筆」的行為。
   */
  history.replaceState(history.state, '', `${RECAP_BASE_PATH}/${photo.id}`)

  // 原本靠 watch(photoId) 觸發，現在不導頁了，要自己來
  warmNeighbours()
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
