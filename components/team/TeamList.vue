<script setup lang="ts">
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface TeamMember {
  name: string
  role: string
  avatar: string
  avatarAlt: string
}

interface TeamGroup {
  title: string
  members: TeamMember[]
}

const placeholderAvatar
  = 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

function createMembers(count: number, role: string): TeamMember[] {
  return Array.from({ length: count }, () => ({
    name: 'Alex',
    role,
    avatar: placeholderAvatar,
    avatarAlt: `Alex（${role}）頭像`,
  }))
}

const teamGroups: TeamGroup[] = [
  { title: '總召組', members: createMembers(1, '總召') },
  { title: '議程組', members: createMembers(6, '組員') },
  { title: '行銷組', members: createMembers(4, '組員') },
  { title: '開發組', members: createMembers(3, '組員') },
  { title: '設計組', members: createMembers(2, '組員') },
]

// ── 動畫 ──────────────────────────────────────────────────────────────
const listRef = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)') // 手機/觸控關閉 tilt
const { gsap, ScrollTrigger } = useGsap()

let timelines: Array<ReturnType<typeof gsap.timeline>> = []

onMounted(() => {
  // 減少動態效果：略過進場，直接呈現靜態內容
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
    const title = section.querySelector('[data-team-title]')
    const parens = section.querySelectorAll('[data-team-paren]')
    const cards = section.querySelectorAll('[data-team-card]')

    // 捲入 → 播放；往回捲離開 → 反向退場（來回進退場，參照 Speakers/Sponsors）
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
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
        class="mb-8 flex items-center justify-center font-serif font-bold"
      >
        <span
          data-team-paren
          class="pr-1 text-[16px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:pr-4 md:text-[32px]"
        >(</span>
        <span
          class="text-[32px] leading-[auto] tracking-[0.01em] text-vconf-primary md:text-[48px] md:tracking-[0em]"
        >{{ group.title }}</span>
        <span
          data-team-paren
          class="pl-1 text-[16px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:pl-4 md:text-[32px]"
        >)</span>
      </h2>
      <!-- 成員 -->
      <div
        class="flex flex-wrap justify-center gap-x-[12px] gap-y-[24px] md:gap-x-[45px]"
      >
        <!-- 每位成員：外層負責透視，內層卡片做進場與 hover tilt -->
        <div
          v-for="(member, index) in group.members"
          :key="index"
          class="[perspective:800px]"
        >
          <div
            data-team-card
            class="group flex flex-col items-center [transform-style:preserve-3d]"
            @mousemove="onTilt"
            @mouseleave="onLeave"
          >
            <!-- 頭像（hover 時往前浮 + 陰影加深） -->
            <NuxtImg
              :src="member.avatar"
              :alt="member.avatarAlt"
              width="211"
              height="211"
              loading="lazy"
              format="avif,webp"
              densities="x1 x2"
              class="mb-[10px] aspect-square max-w-[171px] rounded-[72px] border border-vconf-gray-light object-cover shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-300 ease-out [transform:translateZ(0)] group-hover:shadow-[0_18px_35px_rgba(0,0,0,0.12)] motion-safe:group-hover:[transform:translateZ(18px)] md:max-w-[211px] md:rounded-[80px]"
            />
            <!-- 成員名稱 -->
            <p
              class="mb-4 flex items-center justify-center font-serif transition-transform duration-300 ease-out [transform:translateZ(0)] motion-safe:group-hover:[transform:translateZ(12px)]"
            >
              <span
                class="pr-1 text-[17px] font-medium leading-[1] tracking-[0em] text-vconf-gray-light"
              >(</span>
              <span
                class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-primary"
              >{{ member.name }}</span>
              <span
                class="pl-1 text-[17px] font-bold leading-[1] tracking-[0em] text-vconf-gray-light"
              >)</span>
            </p>
            <!-- 職稱 -->
            <p
              class="font-serif font-bold leading-[1.6] tracking-[0.02em] text-vconf-text-read transition-transform duration-300 ease-out [transform:translateZ(0)] motion-safe:group-hover:[transform:translateZ(6px)]"
            >
              {{ member.role }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
