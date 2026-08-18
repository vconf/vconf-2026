<script setup lang="ts">
import type { AdCreative, AdDraw } from '~/types/ad'
import {
  useDocumentVisibility,
  useIntersectionObserver,
  useMediaQuery,
} from '@vueuse/core'
import { trackAdClick, trackAdImpression } from '~/utils/adTracking'

const props = withDefaults(
  defineProps<{
    /** 版位名稱，會跟著 Umami 事件送出 */
    placement: string
    /** 圖片本身的樣式；外框尺寸交給呼叫端的 class 決定 */
    imageClass?: string
  }>(),
  { imageClass: 'block size-full object-cover' },
)

/** 曝光認定：至少 50% 進入畫面且持續 1 秒，才算一次 impression */
const IMPRESSION_RATIO = 0.5
const IMPRESSION_DWELL = 1000
/** 與 <picture> 的 media 條件、Tailwind 的 md 斷點保持一致 */
const DESKTOP_MEDIA = '(min-width: 768px)'

const adSlot = ref<HTMLElement | null>(null)
const draw = ref<AdDraw | null>(null)
const failed = ref(false)

const isDesktop = useMediaQuery(DESKTOP_MEDIA)
const documentVisibility = useDocumentVisibility()
const creative = computed<AdCreative>(() =>
  isDesktop.value ? 'desktop' : 'mobile',
)

// 抽廣告會推進 Shuffle Bag，只在瀏覽器端打一次；失敗就整個版位不顯示，不影響其他內容
onMounted(async () => {
  try {
    draw.value = await $fetch<AdDraw>('/api/ads/next', { method: 'POST' })
  }
  catch {
    failed.value = true
  }
})

const isVisibleEnough = ref(false)
let dwellTimer: ReturnType<typeof setTimeout> | undefined
let tracked = false

function clearDwell() {
  if (!dwellTimer)
    return

  clearTimeout(dwellTimer)
  dwellTimer = undefined
}

const { stop } = useIntersectionObserver(
  adSlot,
  ([entry]) => {
    isVisibleEnough.value
      = !!entry?.isIntersecting && entry.intersectionRatio >= IMPRESSION_RATIO
  },
  { threshold: IMPRESSION_RATIO },
)

// 背景分頁不算曝光；廣告可能比元素進場更晚回來，所以用 watch 而非在 observer 裡直接計時
const canCountImpression = computed(
  () =>
    !!draw.value
    && isVisibleEnough.value
    && documentVisibility.value === 'visible',
)

watch(canCountImpression, (value) => {
  if (tracked)
    return

  if (!value) {
    clearDwell()

    return
  }

  dwellTimer = setTimeout(() => {
    if (!draw.value)
      return

    tracked = true
    trackAdImpression(draw.value.ad.id, props.placement, creative.value)
    clearDwell()
    stop()
  }, IMPRESSION_DWELL)
})

onBeforeUnmount(clearDwell)

function handleClick() {
  if (!draw.value)
    return

  trackAdClick(draw.value.ad.id, props.placement, creative.value)
}
</script>

<template>
  <aside
    v-if="!failed"
    ref="adSlot"
    aria-label="贊助廣告"
  >
    <!-- 還沒抽到廣告時留白，維持呼叫端保留好的版位尺寸 -->
    <a
      v-if="draw"
      :href="draw.ad.targetUrl"
      target="_blank"
      rel="sponsored noopener noreferrer"
      class="block size-full"
      @click="handleClick"
    >
      <picture class="block size-full">
        <source
          :media="DESKTOP_MEDIA"
          :srcset="draw.ad.images.desktop.url"
          :width="draw.ad.images.desktop.width"
          :height="draw.ad.images.desktop.height"
        />
        <img
          :src="draw.ad.images.mobile.url"
          :alt="draw.ad.title"
          :width="draw.ad.images.mobile.width"
          :height="draw.ad.images.mobile.height"
          loading="lazy"
          :class="imageClass"
        />
      </picture>
    </a>
  </aside>
</template>
