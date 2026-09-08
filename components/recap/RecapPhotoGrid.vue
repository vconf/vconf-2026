<script setup lang="ts">
import type { RecapPhoto } from '~/config/recap'
import { usePreferredReducedMotion } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  adjacentRecapPhoto,
  distributeRecapPhotos,
  RECAP_BASE_PATH,
  recapPhotos,
} from '~/config/recap'

const listRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion()
const { gsap, ScrollTrigger } = useGsap()
const { preloadRecapPhoto, warmRecapPhotos } = useRecapImages()

// 手機不換欄數：版面整個等比縮小，一律三欄
const columns = distributeRecapPhotos(recapPhotos, 3)

/** 滑到某張：那張優先，前後各一張跟著提前，燈箱按左右鍵就不用等 */
function warmPhoto(photo: RecapPhoto) {
  void preloadRecapPhoto(photo, 'high')

  for (const step of [1, -1] as const) {
    const neighbour = adjacentRecapPhoto(photo, step)

    if (neighbour)
      void preloadRecapPhoto(neighbour, 'low')
  }
}

let stopWarm: (() => void) | undefined

// 預熱順序＝資料順序：distributeRecapPhotos 每張都丟進當下最矮的欄，
// 所以照片的 y 本來就是遞增的，資料順序就是畫面由上而下的順序。
onMounted(() => {
  stopWarm = warmRecapPhotos(recapPhotos)
})

let triggers: ScrollTrigger[] = []

function killReveal() {
  for (const trigger of triggers) trigger.kill()

  triggers = []
}

/**
 * 與 Sponsors／Speakers／Team 一致：首屏照片整個跳過，其餘用距視窗底部 80px 當起點
 * （不能寫成視窗百分比，ShareHero 是固定像素高，短視窗時那條線會落在列表上方）。
 */
function setupReveal() {
  if (
    !listRef.value
    || !gsap
    || !ScrollTrigger
    || reducedMotion.value === 'reduce'
  ) {
    return
  }

  const items = Array.from(
    listRef.value.querySelectorAll<HTMLElement>('[data-recap-item]'),
  ).filter(item => item.getBoundingClientRect().top >= window.innerHeight)

  if (!items.length)
    return

  gsap.set(items, { opacity: 0, y: 28, scale: 0.96 })

  triggers = ScrollTrigger.batch(items, {
    start: 'top bottom-=80',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.06,
        overwrite: true,
      })
    },
  })

  // lenis 的 refresh 在 page:finish，早於這裡建立 trigger；
  // 少了這次，新 trigger 會拿舊捲動位置判斷，照片就一直停在 opacity: 0
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

onPageScrollReady(setupReveal)
onBeforeUnmount(() => {
  killReveal()
  stopWarm?.()
})
</script>

<template>
  <div
    ref="listRef"
    class="mx-auto max-w-[1032px] px-6"
  >
    <!-- 照片還沒進來時仍要有話可說，不留一片空白 -->
    <p
      v-if="!recapPhotos.length"
      class="py-10 text-center font-serif text-[18px] leading-[1.6] tracking-[0.02em] text-vconf-text-read"
    >
      花絮照片整理中，敬請期待
    </p>

    <template v-else>
      <!-- 不寫 items-start：靠 stretch 把三欄拉到同高，差額由每欄最後一張的 grow 吃掉才會齊底 -->
      <div class="grid grid-cols-3 gap-[3.47px] md:gap-[10px]">
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="flex flex-col gap-[3.47px] md:gap-[10px]"
        >
          <!-- 格子高度由 aspect-ratio 定（比例量自設計稿），圖片一律 cover 進去 -->
          <!-- 最後一張用 grow 吃掉整欄的高度差；不能用 flex-1，basis 0 會讓它不算進欄高 -->
          <NuxtLink
            v-for="(photo, photoIndex) in column"
            :key="photo.id"
            :to="`${RECAP_BASE_PATH}/${photo.id}`"
            data-recap-item
            class="group block overflow-hidden bg-vconf-gray-ultralight outline-none focus-visible:ring-2 focus-visible:ring-vconf-primary"
            :class="{ grow: photoIndex === column.length - 1 }"
            :style="{ aspectRatio: photo.ratio }"
            :aria-label="`放大檢視：${photo.alt}`"
            @mouseenter="warmPhoto(photo)"
            @focus="warmPhoto(photo)"
            @touchstart.passive="warmPhoto(photo)"
          >
            <NuxtImg
              :src="photo.src"
              :alt="photo.alt"
              :width="photo.width"
              :height="photo.height"
              loading="lazy"
              format="avif,webp"
              class="block size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- TODO(花絮)：Load more 的行為還沒接，先只放版面上的按鈕，目前照片一次全出 -->
      <div class="flex justify-center pt-6 md:pt-[31px]">
        <button
          type="button"
          class="rounded-full border border-vconf-primary bg-vconf-white px-[31px] py-[5px] font-sans text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary transition-colors hover:bg-vconf-primary hover:text-vconf-white md:px-12 md:py-3 md:text-[21px]"
        >
          Load more
        </button>
      </div>
    </template>
  </div>
</template>
