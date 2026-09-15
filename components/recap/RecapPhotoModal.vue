<script setup lang="ts">
import type { RecapPhoto } from '~/config/recap'
import {
  useDevicePixelRatio,
  useElementBounding,
  useElementSize,
  useMediaQuery,
  useSwipe,
  useWindowSize,
} from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import {
  recapModalRequest,
  recapThumbSize,
} from '~/composables/useRecapImages'

const props = defineProps<{
  visible: boolean
  photo: RecapPhoto | null
  photos: RecapPhoto[]
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
  /** 換一張照片；實際導頁由頁面負責，燈箱只說「要看這張」 */
  select: [photo: RecapPhoto]
  prev: []
  next: []
}>()

const isDesktop = useMediaQuery('(min-width: 768px)')
const stageRef = ref<HTMLElement | null>(null)
const thumbsRef = ref<HTMLElement | null>(null)

const viewport = computed(() => (isDesktop.value ? 'desktop' : 'mobile'))
const { height: windowHeight } = useWindowSize()
const { pixelRatio } = useDevicePixelRatio()
const density = computed(() => (pixelRatio.value > 1 ? 2 : 1))

/** 轉檔尺寸跟著視窗與裝置密度走；與 preloadRecapPhoto 共用同一個算式才不會下載兩份 */
const modalSize = computed(() =>
  props.photo
    ? recapModalRequest(
        props.photo,
        viewport.value,
        windowHeight.value,
        density.value,
      )
    : null,
)
const thumbSize = computed(() => recapThumbSize(viewport.value))

/**
 * 照片寬是「舞台高 × 原圖比例」的流動值；寫死一個數字只有一種視窗齊邊，實測其餘差 47～191px。
 * 基準取稿的 H 變體 3:2，直幅照片置中在同一條寬度裡，換照片時寬度也不跳。
 */
const STRIP_RATIO = 3 / 2
const STRIP_MAX_WIDTH = 1600

const { height: stageHeight } = useElementSize(stageRef)
const { top: stageTop } = useElementBounding(stageRef)

/** 手機縮圖列本來就滿版，維持 CSS 的 w-full */
const contentWidth = computed(() => {
  if (!isDesktop.value || !stageHeight.value)
    return undefined

  return `${Math.min(STRIP_MAX_WIDTH, Math.round(stageHeight.value * STRIP_RATIO))}px`
})

/**
 * 稿上叉叉在內容塊上方 35px（y 42 對內容頂端 77.47），不是釘在視窗上緣。
 * 內容塊垂直置中，視窗一高頂端就往下跑，寫死 42 會被留在上面（50% 縮放時差 300px）。
 */
const closeTop = computed(() =>
  isDesktop.value && stageTop.value > 0
    ? `${Math.round(stageTop.value - 35)}px`
    : undefined,
)

/**
 * 稿上箭頭與叉叉都貼著照片外側 46px：1512 寬配 1200 照片時剛好是邊界 70px，那是推導值不是規則。
 * 86px = 按鈕 40 + 間距 46。寫死 70 在 2560 寬會離照片 594px。
 */
const arrowInset = computed(() =>
  contentWidth.value
    ? `calc(50% - ${contentWidth.value} / 2 - 86px)`
    : undefined,
)

// 手機沒有左右鍵，改用滑動換照片
const { direction, isSwiping } = useSwipe(stageRef, { threshold: 40 })

watch(isSwiping, (swiping) => {
  if (swiping || isDesktop.value)
    return

  if (direction.value === 'left')
    emit('next')
  else if (direction.value === 'right')
    emit('prev')
})

/** 換照片時把縮圖列捲到目前這張，長清單才不會不知道自己在哪 */
async function scrollActiveThumbIntoView() {
  await nextTick()

  const active = thumbsRef.value?.querySelector<HTMLElement>(
    '[data-recap-thumb-active="true"]',
  )

  active?.scrollIntoView({ block: 'nearest', inline: 'center' })
}

watch(
  () => [props.visible, props.photo?.id],
  ([visible]) => {
    if (visible)
      void scrollActiveThumbIntoView()
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      name="recap-photo-modal"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] overflow-hidden bg-vconf-black/85"
        role="dialog"
        aria-modal="true"
        :aria-label="photo ? photo.alt : '花絮照片'"
        @click.self="emit('close')"
      >
        <!-- 關閉按鈕 -->
        <button
          type="button"
          class="absolute right-4 top-4 z-20 grid size-[30px] place-items-center rounded-full bg-vconf-white text-vconf-purple md:right-[70px] md:top-[42px] md:size-10"
          :style="{ right: arrowInset, top: closeTop }"
          aria-label="關閉花絮照片"
          @click="emit('close')"
        >
          <svg
            viewBox="0 0 28 28"
            aria-hidden="true"
            class="size-3.5 md:size-5"
          >
            <path
              d="M1 1L27 27M27 1L1 27"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- 上一張／下一張：手機改用滑動，不佔畫面 -->
        <template v-if="photos.length > 1">
          <button
            type="button"
            class="absolute left-[70px] top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-vconf-white text-vconf-purple transition-transform hover:scale-105 md:grid"
            :style="{ left: arrowInset }"
            aria-label="上一張照片"
            @click="emit('prev')"
          >
            <!-- 往上 3.5px 是稿上的位置：∠ 的墨水集中在底部橫線，幾何置中看起來會下沉 -->
            <svg
              viewBox="0 0 28 12"
              aria-hidden="true"
              class="w-7 translate-y-[-3.5px]"
            >
              <path
                d="M11 1L1 11H27"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            class="absolute right-[70px] top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-vconf-white text-vconf-purple transition-transform hover:scale-105 md:grid"
            :style="{ right: arrowInset }"
            aria-label="下一張照片"
            @click="emit('next')"
          >
            <!-- 往上 3.5px 是稿上的位置：∠ 的墨水集中在底部橫線，幾何置中看起來會下沉 -->
            <svg
              viewBox="0 0 28 12"
              aria-hidden="true"
              class="w-7 translate-y-[-3.5px]"
            >
              <path
                d="M17 1L27 11H1"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </template>

        <div
          class="flex size-full flex-col items-center justify-center gap-8 py-[128px] md:gap-6 md:px-[10.3vw] md:py-[8.3svh]"
          data-lenis-prevent
          @click.self="emit('close')"
        >
          <!-- 大圖 -->
          <!-- 桌機 flex-1 讓舞台吃滿高度、items-end 貼齊底部，跟縮圖列的距離恆等於 gap 24 -->
          <!-- 手機不長高：3:2 照片只有 402x268，撐滿 536 會在上方堆 221px 空白（338 = py 256 + gap 32 + 縮圖列 50） -->
          <div
            ref="stageRef"
            class="flex max-h-[536px] min-h-0 w-full max-w-[1200px] items-end justify-center md:max-h-[1066px] md:flex-1"
            :style="{ maxWidth: contentWidth }"
            @click.self="emit('close')"
          >
            <NuxtImg
              v-if="photo && modalSize"
              :src="photo.src"
              :alt="photo.alt"
              :width="modalSize.width"
              :height="modalSize.height"
              loading="eager"
              format="avif,webp"
              class="max-h-[min(536px,calc(100svh-338px))] w-auto max-w-full select-none object-contain md:max-h-full"
            />
          </div>

          <!-- 縮圖列；負 margin 抵銷捲軸佔的高度，稿上捲軸是疊在縮圖裡不另外吃空間的 -->
          <div
            v-if="photos.length > 1"
            ref="thumbsRef"
            :style="{ maxWidth: contentWidth }"
            class="-mb-1.5 w-full max-w-[1200px] shrink-0 overflow-x-auto overscroll-x-contain scrollbar scrollbar-track-white/20 scrollbar-thumb-white/60 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-h-1.5 md:-mb-2.5 md:scrollbar-h-2.5"
            data-lenis-prevent
          >
            <ul class="flex w-max gap-2">
              <li
                v-for="item in photos"
                :key="item.id"
              >
                <button
                  type="button"
                  :data-recap-thumb-active="item.id === photo?.id"
                  class="block overflow-hidden rounded-[2px] outline-none transition-opacity duration-200"
                  :class="
                    item.id === photo?.id
                      ? 'opacity-100 outline outline-2 -outline-offset-2 outline-vconf-white'
                      : 'opacity-50 hover:opacity-90 focus-visible:opacity-90'
                  "
                  :aria-label="item.alt"
                  :aria-current="item.id === photo?.id ? 'true' : undefined"
                  @click="emit('select', item)"
                >
                  <NuxtImg
                    :src="item.src"
                    alt=""
                    aria-hidden="true"
                    :width="thumbSize.width"
                    :height="thumbSize.height"
                    loading="lazy"
                    format="avif,webp"
                    densities="x1 x2"
                    class="block size-[50px] object-cover md:size-[100px]"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.recap-photo-modal-enter-active,
.recap-photo-modal-leave-active {
  transition: opacity 0.3s ease;
}

.recap-photo-modal-enter-from,
.recap-photo-modal-leave-to {
  opacity: 0;
}
</style>
