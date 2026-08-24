<script setup lang="ts">
import type { TeamMember } from '~/config/team'
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { teamGroups } from '~/config/team'

const listRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
const { gsap, ScrollTrigger } = useGsap()
const { preloadTeamModal } = useTeamImages()

function warmMember(member: TeamMember) {
  void preloadTeamModal(member, 'high')
}

// 頭像與「無照片遞補方塊」共用的外觀
const avatarClass
  = 'mb-[10px] aspect-square w-full rounded-[42%] border border-vconf-gray-light object-cover shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-300 ease-out [transform:translateZ(0)] group-hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)] motion-safe:group-hover:[transform:translateZ(18px)] md:rounded-[38%]'

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
    listRef.value.querySelectorAll<HTMLElement>('[data-team-group]'),
  )

  for (const section of sections) {
    if (section.getBoundingClientRect().top < window.innerHeight)
      continue

    const title = section.querySelector('[data-team-title]')
    const parens = section.querySelectorAll('[data-team-paren]')
    const cards = section.querySelectorAll('[data-team-card]')

    // 只做進場：捲入播一次，往回捲不反向退場（參照 Sponsors）
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom-=80',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      title,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    )
      // 括號由左右向內靠攏，做出「把組別框起來」的感覺
      .fromTo(
        parens,
        { x: (i: number) => (i === 0 ? -8 : 8) },
        { x: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.3',
      )
      // 成員卡片依序升起，帶一點 rotateX 呈現空間感
      .fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.92,
          rotateX: 6,
          transformOrigin: 'center bottom',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        },
        '-=0.2',
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

// 滑鼠追蹤的輕微 3D tilt（僅支援 hover 的裝置；reduced-motion 停用）
function onTilt(event: MouseEvent) {
  if (!canHover.value || reducedMotion.value === 'reduce' || !gsap)
    return

  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5 // -0.5 ~ 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5

  gsap.to(card, {
    rotateY: px * 10, // -5 ~ 5deg
    rotateX: -py * 8, // -4 ~ 4deg
    y: -6,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: true,
  })
}

function onLeave(event: MouseEvent) {
  if (!gsap)
    return

  // 平順回正（低彈性）
  gsap.to(event.currentTarget as HTMLElement, {
    rotateX: 0,
    rotateY: 0,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: true,
  })
}
</script>

<template>
  <div
    ref="listRef"
    class="mx-auto max-w-[1032px] px-6"
  >
    <section
      v-for="group in teamGroups"
      :key="group.title"
      data-team-group
      class="mb-[64px] flex flex-col items-center last:mb-0"
    >
      <!-- 群組標題 -->
      <h2
        data-team-title
        class="mb-6 flex items-center justify-center font-serif font-bold md:mb-8"
      >
        <span
          data-team-paren
          class="pr-2 text-[16px] font-bold leading-[1] tracking-[0em] text-vconf-gray-light md:pr-4 md:text-[32px]"
        >(</span>
        <span
          class="text-[32px] leading-[1] tracking-[0.01em] text-vconf-primary md:text-[48px] md:tracking-[0em]"
        >{{ group.title }}</span>
        <span
          data-team-paren
          class="pl-2 text-[16px] font-bold leading-[1] tracking-[0em] text-vconf-gray-light md:pl-4 md:text-[32px]"
        >)</span>
      </h2>
      <!-- 成員 -->
      <div
        class="flex w-full flex-wrap justify-center gap-x-[12px] gap-y-[24px] md:gap-x-[45px]"
      >
        <!-- 每位成員 -->
        <div
          v-for="member in group.members"
          :key="member.slug"
          class="w-[calc((100%-12px)/2)] max-w-[171px] [perspective:800px] md:w-[211px] md:max-w-[211px]"
        >
          <div
            data-team-card
            class="group [transform-style:preserve-3d]"
          >
            <NuxtLink
              :to="`/team/unpublish/${member.slug}`"
              class="flex flex-col items-center outline-none [transform-style:preserve-3d]"
              @mousemove="onTilt"
              @mouseleave="onLeave"
              @mouseenter="warmMember(member)"
              @focus="warmMember(member)"
              @touchstart.passive="warmMember(member)"
            >
              <!-- 頭像（hover 時往前浮 + 陰影加深） -->
              <NuxtImg
                v-if="member.avatar"
                :src="member.avatar"
                placeholder
                :alt="`${member.name}（${member.jobTitle}）頭像`"
                width="211"
                height="211"
                loading="lazy"
                format="avif,webp"
                densities="x1 x2"
                :class="avatarClass"
              />
              <!-- 尚未提供照片：以名稱首字遞補，維持卡片版型 -->
              <div
                v-else
                aria-hidden="true"
                class="flex items-center justify-center bg-vconf-gray-ultralight font-serif text-[48px] font-bold text-vconf-gray-light md:text-[64px]"
                :class="avatarClass"
              >
                {{ member.name.charAt(0) }}
              </div>
              <!-- 成員名稱 -->
              <p
                class="mb-4 flex items-center justify-center font-serif transition-transform duration-300 ease-out [transform:translateZ(0)] motion-safe:group-hover:[transform:translateZ(12px)]"
              >
                <span
                  class="pr-1 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
                >{</span>
                <span
                  class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-primary"
                >{{ member.name }}</span>
                <span
                  class="pl-1 font-sans text-[17px] font-bold leading-[1] tracking-[0.02em] text-vconf-gray-light"
                >}</span>
              </p>
              <!-- 職稱 -->
              <p
                class="font-serif font-bold leading-[1.6] tracking-[0.02em] text-vconf-text-read transition-transform duration-300 ease-out [transform:translateZ(0)] motion-safe:group-hover:[transform:translateZ(6px)]"
              >
                {{ member.role }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
