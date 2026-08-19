<script setup lang="ts">
import type { AdCreative, AdDraw } from '~/types/ad'
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

const { head, status, reserve, commit } = useAdSlot()

const isDesktop = useMediaQuery(AD_DESKTOP_MEDIA)
const documentVisibility = useDocumentVisibility()
const creative = computed<AdCreative>(() =>
  isDesktop.value ? 'desktop' : 'mobile',
)

/**
 * 這次掛載要顯示的那一格。
 *
 * 釘住不隨 head 變動：曝光成立後 head 會前進到下一則，但畫面上這一則得保持不變，
 * 免得使用者看到一半被換掉。彈窗關閉時整個版位卸載，下次開啟再釘新的。
 */
const shown = ref<AdDraw | null>(null)

watch(
  head,
  (value) => {
    if (!shown.value && value)
      shown.value = value
  },
  { immediate: true },
)

// reserve 只讀不消耗，所以每次掛載都問一次是安全的；手上已經有就直接沿用
onMounted(() => {
  void reserve()
})

/** 釘住的那一則廣告；還沒拿到就是 null，版位改用底圖或灰底 */
const ad = computed(() => shown.value?.ad ?? null)

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
      const item = shown.value

      if (!item)
        return

      tracked = true
      trackAdImpression(item.ad.id, props.placement, creative.value, {
        cycle: item.cycle,
        position: item.position,
      })
      clearDwell()
      // 曝光成立才確認消耗：袋子這時才前進，並順手保留下一格
      void commit(item)
    }, AD_IMPRESSION_DWELL)
  },
  { immediate: true },
)

onBeforeUnmount(clearDwell)

function handleClick() {
  const item = shown.value

  if (!item)
    return

  trackAdClick(item.ad.id, props.placement, creative.value, {
    cycle: item.cycle,
    position: item.position,
  })
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
