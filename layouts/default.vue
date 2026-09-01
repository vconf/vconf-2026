<script setup lang="ts">
import { eventImage, eventOrganizer, websiteBasic } from '~/config/seo.config'
import { isModalNavigation } from '~/utils/modalRoute'

useSchemaOrg([eventOrganizer, eventImage, websiteBasic])

// ShareFooter 在 <slot> 外面，不吃 <NuxtPage> 的 page transition。Footer 比一個視窗
// 還高，捲到底時畫面幾乎全是它，頁面的離場動畫會整段播在畫面外，看起來像沒有轉場。
// 這裡讓 Footer 跟著頁面一起淡出，數值與 app.vue 的 .page-leave-* 對齊，
// 收回來的時機則對齊 plugins/lenis.client.ts 的捲動歸零。
const nuxtApp = useNuxtApp()
const isPageLeaving = ref(false)

const stopGuard = useRouter().beforeEach((to, from) => {
  // 開/關彈窗只切換 overlay，背景頁與 Footer 都不動
  if (!isModalNavigation(to.path, from.path))
    isPageLeaving.value = true
})

// 導覽被中斷時沒有離場動畫可等，直接把 Footer 收回來，避免它淡出後卡住不見
const stopAfterEach = useRouter().afterEach((_to, _from, failure) => {
  if (failure)
    isPageLeaving.value = false
})

const unhook = nuxtApp.hook('page:transition:finish', () => {
  isPageLeaving.value = false
})

onUnmounted(() => {
  stopGuard()
  stopAfterEach()
  unhook()
})
</script>

<template>
  <div>
    <ShareNavBar />
    <slot></slot>
    <LazyShareFooter
      hydrate-on-visible
      class="transition-[opacity,filter] [transition-duration:400ms] motion-reduce:transition-none"
      :class="
        isPageLeaving
          ? 'opacity-0 blur-[0.5rem] motion-reduce:opacity-100 motion-reduce:blur-none'
          : ''
      "
    />
  </div>
</template>
