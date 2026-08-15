<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { speakerPhoto } from '~/utils/agenda'

const { data: speakers } = await useSpeakers()

const gridRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'
const { gsap, ScrollTrigger } = useGsap()

// ScrollTrigger.batch 建立的 trigger，卸載時要逐一 kill
let batchTriggers: Array<{ kill: () => void }> = []

onMounted(() => {
  if (!gridRef.value || !gsap || !ScrollTrigger)
    return

  // 減少動態效果：略過進場動畫，卡片直接顯示最終狀態
  if (reducedMotion.value === 'reduce')
    return

  const cards = Array.from(gridRef.value.children)

  // 初始隱藏狀態用 JS 設定（不寫在 CSS），SSR / 無 JS 環境下內容仍完整可見
  gsap.set(cards, { scale: 0.8, opacity: 0, filter: 'blur(10px)' })

  batchTriggers = ScrollTrigger.batch(cards, {
    start: 'top bottom-=300',
    // 卡片只進場一次：不做往回捲的退場，trigger 觸發後自行銷毀、不再監聽捲動
    once: true,
    onEnter: (batch: Element[]) => {
      gsap.killTweensOf(batch)
      gsap.to(batch, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
      })
    },
  })
})

onBeforeUnmount(() => {
  for (const trigger of batchTriggers) trigger.kill()
  batchTriggers = []

  if (gridRef.value)
    gsap?.killTweensOf(Array.from(gridRef.value.children))
})
</script>

<template>
  <div class="mx-auto max-w-[1032px] px-6">
    <div
      ref="gridRef"
      class="grid grid-cols-2 gap-4 md:gap-[33px] lg:grid-cols-3"
    >
      <NuxtLink
        v-for="speaker in speakers"
        :key="speaker.id"
        :to="`/speakers/unpublish/${speaker.talkSlug}`"
        class="group block rounded-lg outline-none"
      >
        <!-- 講者照：手機與桌機各自載入對應尺寸的圖檔 -->
        <NuxtImg
          :src="speakerPhoto(speaker, 'introMobile')"
          :alt="speaker.avatarAlt"
          width="169"
          height="239"
          loading="lazy"
          format="avif,webp"
          densities="x1 x2"
          class="mb-4 block aspect-speaker-photo-sm w-full object-cover md:hidden"
        />
        <NuxtImg
          :src="speaker.avatar"
          :alt="speaker.avatarAlt"
          width="306"
          height="433"
          loading="lazy"
          format="avif,webp"
          densities="x1 x2"
          class="mb-4 hidden aspect-speaker-photo w-full object-cover md:block"
        />
        <div>
          <!-- 講者名稱 -->
          <p class="mb-[14px] flex items-center justify-center">
            <span
              class="pr-1 text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
            >{</span>
            <span
              class="font-serif text-[20px] font-bold leading-[1.2] tracking-[0em] text-vconf-primary md:text-[24px]"
            >{{ speaker.name }}</span>
            <span
              class="pl-1 text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
            >}</span>
          </p>
          <!-- 講者抬頭 -->
          <p
            class="mx-auto mb-4 w-fit font-serif font-semibold leading-[1.6] tracking-[0em] text-vconf-text-read"
          >
            {{ speaker.jobTitle }}
          </p>
          <!-- 講者時刻 -->
          <p
            class="mb-6 flex flex-col items-center justify-center gap-2 font-serif font-bold leading-[1.6] tracking-[0.02em] md:flex-row"
          >
            <span
              class="flex gap-[5px] rounded-[12px] bg-vconf-purple px-2 py-1 font-bold text-white"
            >
              <span class="text-[14px] md:text-[16px]">Talk</span>
              <span class="text-[14px] md:text-[16px]">{{
                speaker.talkNumber
              }}</span>
            </span>
            <time
              :datetime="`2026-10-17T${speaker.startTime}:00+08:00`"
              class="text-vconf-purple"
            >
              {{ speaker.startTime }}~{{ speaker.endTime }}
            </time>
          </p>
          <!-- More 按鈕外觀；整張卡片皆可點擊 -->
          <span
            class="mx-auto block w-fit rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary transition-colors group-hover:bg-vconf-primary group-hover:text-white md:text-[16px] md:leading-[1.6]"
          >
            More
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
