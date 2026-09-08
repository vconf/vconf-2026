<script setup lang="ts">
import type { RecapPhoto } from '~/config/recap'
import { useMediaQuery, useSwipe } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { recapModalSize, recapThumbSize } from '~/composables/useRecapImages'

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
const modalSize = computed(() =>
  props.photo ? recapModalSize(props.photo, viewport.value) : null,
)
const thumbSize = computed(() => recapThumbSize(viewport.value))

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
          class="flex size-full flex-col items-center justify-center gap-8 py-[128px] md:gap-6 md:px-32 md:py-[77px]"
          data-lenis-prevent
          @click.self="emit('close')"
        >
          <!-- 大圖 -->
          <!-- items-end：照片貼齊舞台底，跟縮圖列的距離才會恆等於 gap（手機 32、桌機 24） -->
          <div
            ref="stageRef"
            class="flex max-h-[536px] min-h-0 w-full max-w-[1200px] flex-1 items-end justify-center md:max-h-[650px]"
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
              densities="x1 x2"
              class="max-h-full w-auto max-w-full select-none object-contain"
            />
          </div>

          <!-- 縮圖列；負 margin 抵銷捲軸佔的高度，稿上捲軸是疊在縮圖裡不另外吃空間的 -->
          <div
            v-if="photos.length > 1"
            ref="thumbsRef"
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
                    class="block object-cover"
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
