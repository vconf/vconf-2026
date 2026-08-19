<script setup lang="ts">
import type { AdCreative } from '~/types/ad'
import { useDocumentVisibility, useMediaQuery } from '@vueuse/core'
import {
  AD_DESKTOP_MEDIA,
  AD_IMPRESSION_DWELL,
  adFallback,
} from '~/config/ad.config'
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

const { draw, status, prefetch, promote, rotate } = useAdSlot()

const isDesktop = useMediaQuery(AD_DESKTOP_MEDIA)
const documentVisibility = useDocumentVisibility()
const creative = computed<AdCreative>(() =>
  isDesktop.value ? 'desktop' : 'mobile',
)

// 彈窗每次開啟都會重新掛載：有預抽好的就換下一則，手上什麼都沒有才現抽
onMounted(() => {
  promote()
  prefetch()
})

/** 抽到的廣告；還沒抽到就是 null，版位改用底圖或灰底 */
const ad = computed(() => draw.value?.ad ?? null)

let dwellTimer: ReturnType<typeof setTimeout> | undefined
let tracked = false

function clearDwell() {
  if (!dwellTimer)
    return

  clearTimeout(dwellTimer)
  dwellTimer = undefined
}

// 版位隨彈窗開啟就在畫面上，所以不看進場比例，只確認分頁在前景；底圖不計曝光
const canCountImpression = computed(
  () => !!ad.value && documentVisibility.value === 'visible',
)

watch(
  canCountImpression,
  (value) => {
    if (!import.meta.client || tracked)
      return

    if (!value) {
      clearDwell()

      return
    }

    dwellTimer = setTimeout(() => {
      const item = ad.value

      if (!item)
        return

      tracked = true
      trackAdImpression(item.id, props.placement, creative.value)
      clearDwell()
      // 曝光成立才推進輪播，沒人看到的預抽不會吃掉輪播位置
      rotate()
    }, AD_IMPRESSION_DWELL)
  },
  { immediate: true },
)

onBeforeUnmount(clearDwell)

function handleClick() {
  if (!ad.value)
    return

  trackAdClick(ad.value.id, props.placement, creative.value)
}
</script>

<template>
  <aside
    v-if="ad || adFallback || status !== 'failed'"
    aria-label="贊助廣告"
  >
    <a
      v-if="ad"
      :href="ad.targetUrl"
      target="_blank"
      rel="sponsored noopener noreferrer"
      class="relative block size-full overflow-hidden"
      @click="handleClick"
    >
      <ShareAdCreative
        :images="ad.images"
        :alt="ad.title"
        :image-class="imageClass"
      />
    </a>
    <!-- 還在抽廣告：先擺底圖，不可點、不計曝光 -->
    <div
      v-else-if="adFallback"
      class="relative block size-full overflow-hidden"
      :aria-hidden="adFallback.alt ? undefined : 'true'"
    >
      <ShareAdCreative
        :images="adFallback.images"
        :alt="adFallback.alt"
        :image-class="imageClass"
      />
    </div>
    <!-- 沒有底圖可用：先用灰底把版位佔住，避免內容跳動 -->
    <div
      v-else
      aria-hidden="true"
      class="size-full bg-vconf-gray-ultralight"
    ></div>
  </aside>
</template>
