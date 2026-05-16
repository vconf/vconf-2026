<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  image?: string
}>(), {
  image: '/home/community-bg.png',
})

const title = ref('（ 連結社群 啟發未來 ）')
const subtitle = ref('V-CONF Taiwan 2026')
const description = ref(
  '聚焦 Vue 生態系與現代前端開發體驗，透過交流讓靈感與技術持續流動。',
)
</script>

<template>
  <section class="overflow-hidden">
    <div class="community relative">
      <div class="absolute left-1/2 top-1/2 min-h-[486px] w-full min-w-0 -translate-x-1/2 -translate-y-1/2 px-6 py-8 text-center font-serif xs:w-screen lg:min-h-[520px] lg:w-full">
        <h2 class="mb-6 text-[28px] font-bold  leading-tight text-vconf-heading xs:text-[48px]">
          <span class="pr-3">(</span>
          <span class="pr-3">連結社群</span>
          <span class="pr-3">啟發未來</span>
          <span>)</span>
        </h2>
        <div class="text-[16px] font-medium leading-[160%] tracking-[0.02em] text-vconf-text-unread xs:text-[21px]">
          <p class="mb-9">
            <span class="inline lg:block"><span class="text-vconf-primary">V-CONF Taiwan 2026 </span>是一場匯聚 Vue.js 開發者與前端工程師的年度盛會，<span></span></span>
            <span class="inline lg:block">聚焦 Vue 生態系與現代前端開發體驗的演進。</span>
          </p>
          <p class="mb-9">
            <span class="inline lg:block">在前端技術快速迭代的浪潮中，我們將一同回顧 Vue 的成長歷程，</span>
            <span class="inline lg:block">梳理那些實際改變開發模式的關鍵技術與轉折。</span>
            <span class="inline lg:block">除了回顧過去，我們也關注未來，</span>
            <span class="inline lg:block">深入探討以 Vite 為核心的開發流程，以及新一代工具鏈如何帶來更快速、更流暢的開發體驗，</span>
            <span class="inline lg:block">並透過實務案例分享最新技術趨勢。</span>
          </p>
          <p>
            <span class="inline lg:block">在這裡，你將有機會與來自各地的開發者建立連結，</span>
            <span class="inline lg:block">一同探索 Vue 與 Vite 的更多可能，並共同想像前端開發的下一個階段。</span>
          </p>
        </div>
      </div>
    </div>

    <div class="h-screen"></div>
  </section>
</template>

<style scoped>
  .community {
    background-image: url('/home/community-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 637px;
    width: 100%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

@media (min-width: 480px) {
  .community {
    background-image: url('/home/community-md-bg.png');
    background-position: center;
    height: 912px;
    width: 1512px;
  }
}
</style>
