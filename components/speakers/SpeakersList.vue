<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'

interface SpeakerCard {
  name: string
  title: string
  avatar: string
  avatarAlt: string
  talkNumber: number
  startTime: string
  endTime: string
}

const placeholderAvatar
  = 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const speakers: SpeakerCard[] = [
  {
    name: '尤雨溪',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: '尤雨溪頭像',
    talkNumber: 1,
    startTime: '09:30',
    endTime: '10:15',
  },
  {
    name: 'Hunter',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: 'Hunter 頭像',
    talkNumber: 2,
    startTime: '10:25',
    endTime: '11:10',
  },
  {
    name: 'SerKo',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: 'SerKo 頭像',
    talkNumber: 3,
    startTime: '11:20',
    endTime: '12:05',
  },
  {
    name: 'KuKu',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: 'KuKu 頭像',
    talkNumber: 4,
    startTime: '13:05',
    endTime: '13:50',
  },
  {
    name: 'KuKu',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: 'KuKu 頭像',
    talkNumber: 5,
    startTime: '14:00',
    endTime: '14:45',
  },
  {
    name: 'Alex 宅幹嘛',
    title: 'Creator of Vue.js',
    avatar: placeholderAvatar,
    avatarAlt: 'Alex 宅幹嘛頭像',
    talkNumber: 6,
    startTime: '15:15',
    endTime: '16:00',
  },
]

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
    onLeaveBack: (batch: Element[]) => {
      gsap.killTweensOf(batch)
      gsap.to(batch, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.6,
        stagger: 0.1,
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
      <div
        v-for="speaker in speakers"
        :key="speaker.talkNumber"
      >
        <NuxtImg
          :src="speaker.avatar"
          :alt="speaker.avatarAlt"
          width="785"
          height="413"
          loading="lazy"
          format="avif,webp"
          densities="x1 x2"
          class="mb-4 aspect-speaker-photo-sm object-cover md:aspect-speaker-photo"
        />
        <div>
          <!-- 講者名稱 -->
          <p class="mb-[14px] flex items-center justify-center">
            <span
              class="pr-1 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
            >{</span>
            <span
              class="text-[20px] font-bold leading-[1.2] tracking-[0em] text-vconf-primary md:text-[24px]"
            >{{ speaker.name }}</span>
            <span
              class="pl-1 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
            >}</span>
          </p>
          <!-- 講者抬頭 -->
          <p
            class="mx-auto mb-4 w-fit font-semibold leading-[1.6] tracking-[0em] text-vconf-text-read"
          >
            {{ speaker.title }}
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
          <!-- More 按鈕 -->
          <NuxtLink
            to="#"
            class="mx-auto block w-fit rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-avenir text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[16px] md:leading-[1.6]"
          >
            More
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
