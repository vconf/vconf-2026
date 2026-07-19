<script setup lang="ts">
interface Speaker {
  name: string
  title: string
  avatar: string
  avatarAlt: string
}

interface TalkItem {
  type: 'talk'
  time: string
  talkNumber: number
  title: string
  speaker: Speaker
}

interface BreakItem {
  type: 'break'
  time: string
  label: string
  theme: 'gray' | 'purple' | 'primary'
}

type AgendaItem = TalkItem | BreakItem

const placeholderAvatar
  = 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const agendaItems: AgendaItem[] = [
  {
    type: 'talk',
    time: '09:30',
    talkNumber: 1,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: '尤雨溪',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: '尤雨溪頭像',
    },
  },
  { type: 'break', time: '10:15', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '10:25',
    talkNumber: 2,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: 'Hunter',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: 'Hunter 頭像',
    },
  },
  { type: 'break', time: '11:10', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '11:20',
    talkNumber: 3,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: 'SerKo',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: 'SerKo 頭像',
    },
  },
  { type: 'break', time: '12:05', label: '午餐', theme: 'purple' },
  {
    type: 'talk',
    time: '13:05',
    talkNumber: 4,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: 'KuKu',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: 'KuKu頭像',
    },
  },
  { type: 'break', time: '13:50', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '14:00',
    talkNumber: 5,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: 'KuKu',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: 'KuKu頭像',
    },
  },
  { type: 'break', time: '14:45', label: '點心', theme: 'purple' },
  {
    type: 'talk',
    time: '15:15',
    talkNumber: 6,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name: 'Alex 宅幹嘛',
      title: 'Creator of Vue.js',
      avatar: placeholderAvatar,
      avatarAlt: 'Alex 宅幹嘛頭像',
    },
  },
  { type: 'break', time: '16:00', label: '閉幕', theme: 'primary' },
]

const breakThemeClass: Record<BreakItem['theme'], string> = {
  gray: 'bg-vconf-gray-ultralight rounded-[24px]',
  purple: 'bg-vconf-purple-ultralight rounded-[24px]',
  primary: 'bg-vconf-primary-light rounded-[24px]',
}
</script>

<template>
  <div class="m-auto w-fit px-6">
    <div
      v-for="item in agendaItems"
      :key="item.time"
    >
      <!-- 議程時段（獨立一排） -->
      <time
        class="block font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[18px] md:leading-[1]"
        :datetime="`2026-10-17T${item.time}:00+08:00`"
      >{{ item.time }}</time>
      <div
        class="grid grid-cols-[54px_minmax(0,1fr)] md:grid-cols-[66px_minmax(0,1fr)]"
      >
        <!-- 休息時段 -->
        <p
          v-if="item.type === 'break'"
          class="col-start-2 px-6 py-2 text-center font-serif text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:py-3 md:text-[21px] md:leading-[1.6]"
          :class="breakThemeClass[item.theme]"
        >
          {{ item.label }}
        </p>
        <!-- 講者議程 -->
        <div
          v-else
          class="col-start-2 w-fit max-w-[299px] rounded-[24px] border border-vconf-gray-light px-4 pb-4 font-serif md:max-w-[668px] md:px-6 md:pb-6"
        >
          <!-- 標籤 -->
          <div
            class="mb-3 flex w-fit items-baseline gap-[5px] rounded-b-[12px] bg-vconf-purple p-[10px] font-bold text-white md:mb-4"
          >
            <span
              class="block text-[14px] leading-[1.6] tracking-[0.02em] md:text-[16px]"
            >Talk</span>
            <span
              class="block text-[24px] leading-[1.2] tracking-[0em] md:text-[32px] md:leading-[auto] md:tracking-[0.01em]"
            >{{ item.talkNumber }}</span>
          </div>
          <!-- 講者議程名稱 -->
          <h3
            class="mb:mb-4 mb-3 text-[24px] font-bold leading-[1.2] tracking-[0em] text-vconf-text-read md:text-[32px] md:leading-[auto] md:tracking-[0.01em]"
          >
            {{ item.title }}
          </h3>
          <!-- 講者基本資訊 -->
          <div class="mb-3 flex items-center justify-start gap-4 md:mb-4">
            <NuxtImg
              class="size-[100px] rounded-full object-cover"
              width="100"
              height="100"
              :src="item.speaker.avatar"
              :alt="item.speaker.avatarAlt"
              loading="lazy"
              format="avif,webp"
              densities="x1 x2"
            />
            <div
              class="flex flex-col items-start gap-4 md:flex-row md:items-center"
            >
              <p class="flex items-center justify-center">
                <span
                  class="pr-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
                >{</span>
                <span
                  class="text-[20px] font-bold leading-[1.2] tracking-[0em] text-vconf-primary md:text-[24px]"
                >{{ item.speaker.name }}</span>
                <span
                  class="pl-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light"
                >}</span>
              </p>
              <p
                class="font-semibold leading-[1.6] tracking-[0em] text-vconf-text-read"
              >
                {{ item.speaker.title }}
              </p>
            </div>
          </div>
          <!-- More 按鈕 -->
          <NuxtLink
            to="#"
            class="ml-auto block w-fit rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-avenir text-[16px] font-extrabold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[20px] md:leading-[1.5]"
          >
            More
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
