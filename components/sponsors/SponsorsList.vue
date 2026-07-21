<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { visibleSponsorGroups } from '~/config/sponsors'

const gapClasses = {
  10: 'gap-[23px]',
  5: 'gap-3 md:gap-[23px]',
  3: 'gap-2 md:gap-[23px]',
  1: 'gap-2 md:gap-[23px]',
} as const

const cardWidthClasses = {
  10: 'w-full md:w-[calc((100%-23px)/2)]',
  5: 'w-[calc((100%-12px)/2)] md:w-[calc((100%-46px)/3)]',
  3: 'w-[calc((100%-8px)/2)] md:w-[calc((100%-46px)/3)]',
  1: 'w-[calc((100%-16px)/3)] md:w-[calc((100%-92px)/5)]',
} as const

const listRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'
const { gsap, ScrollTrigger } = useGsap()

let timelines: Array<ReturnType<typeof gsap.timeline>> = []

onMounted(() => {
  if (
    !listRef.value
    || !gsap
    || !ScrollTrigger
    || reducedMotion.value === 'reduce'
  ) {
    return
  }

  const sections = Array.from(
    listRef.value.querySelectorAll<HTMLElement>('[data-sponsor-tier]'),
  )

  for (const section of sections) {
    const title = section.querySelector('[data-sponsor-title]')
    const cards = section.querySelectorAll('[data-sponsor-card]')
    const logos = section.querySelectorAll('[data-sponsor-logo]')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        // top 65%：觸發線往畫面上方一點，區塊要稍微捲進來才播（10x 不會一載入就觸發）
        start: 'top 65%',
        // 捲入 → 播放；往回捲離開 → 反向退場（參照 Speakers 的進退場，不用 once）
        toggleActions: 'play none none reverse',
      },
    })

    tl.fromTo(
      title,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    )
      .fromTo(
        cards,
        {
          y: 36,
          opacity: 0,
          scale: 0.97,
          rotateX: 6,
          transformOrigin: 'center bottom',
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: { amount: 0.3 },
        },
        '-=0.25',
      )
      // logo 只淡入（不動 transform），才不會留下 inline 樣式擋住 hover 放大，也讓時間軸能乾淨反向
      .fromTo(
        logos,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: { amount: 0.2 },
        },
        '-=0.35',
      )

    timelines.push(tl)
  }
})

onBeforeUnmount(() => {
  for (const tl of timelines) {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
  timelines = []
})
</script>

<template>
  <div
    ref="listRef"
    class="mx-auto max-w-[1032px] px-6"
  >
    <section
      v-for="group in visibleSponsorGroups"
      :key="group.level"
      data-sponsor-tier
      class="mb-[48px] last:mb-0 md:mb-[88px]"
    >
      <!-- 標題 -->
      <h2
        data-sponsor-title
        class="mb-4 flex items-center justify-center font-serif font-bold md:mb-6"
      >
        <span
          class="hidden pr-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:block"
        >(</span>
        <span
          class="text-[32px] font-bold leading-[auto] tracking-[0.01em] text-vconf-primary md:text-[48px] md:tracking-[0em]"
        >{{ group.label }}</span>
        <span
          class="hidden pl-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:block"
        >)</span>
      </h2>
      <!-- 贊助商區塊 -->
      <div
        class="flex flex-wrap justify-center [perspective:1000px]"
        :class="gapClasses[group.level]"
      >
        <div
          v-for="sponsor in group.sponsors"
          :key="sponsor.name"
          data-sponsor-card
          class="group"
          :class="cardWidthClasses[group.level]"
        >
          <!-- 只讓 Logo 圖框與 Logo 變化，卡片本身不位移，避免命中範圍抖動 -->
          <div
            class="mb-4 flex aspect-square transform-gpu items-center justify-center border border-vconf-gray-exlight transition-[transform,box-shadow] duration-300 ease-out motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
          >
            <NuxtImg
              data-sponsor-logo
              :src="sponsor.logo"
              :alt="`${sponsor.name} logo`"
              :width="sponsor.width"
              :height="sponsor.height"
              loading="eager"
              class="h-auto w-4/5 transition-[scale] duration-300 ease-out motion-safe:group-hover:[scale:1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
