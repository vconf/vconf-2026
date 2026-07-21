<script setup lang="ts">
// 議程資料與 id 規則集中在 composable，讓清單與彈窗共用
const { agendaItems, breakThemeClass, talkId } = useAgenda()
</script>

<template>
  <div class="m-auto w-fit px-6">
    <div
      v-for="item in agendaItems"
      :key="item.time"
    >
      <!-- 議程時段（獨立一排） -->
      <time
        class="sticky top-0 block font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[18px] md:leading-[1]"
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
        <!-- 整張卡片為連結，點擊任一處都開啟彈窗 -->
        <NuxtLink
          v-else
          :to="`/agenda/unpublish/${talkId(item)}`"
          class="col-start-2 block w-fit max-w-[299px] rounded-[24px] border border-vconf-gray-light px-4 pb-4 font-serif transition-colors hover:border-vconf-primary focus:border-vconf-primary focus:outline-none md:max-w-[668px] md:px-6 md:pb-6"
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
              <p class="flex w-fit items-center justify-center">
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
          <!-- More（整張卡片已是連結，這裡只是視覺按鈕） -->
          <span
            class="ml-auto block w-fit rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-avenir text-[16px] font-extrabold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[20px] md:leading-[1.5]"
          >
            More
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
