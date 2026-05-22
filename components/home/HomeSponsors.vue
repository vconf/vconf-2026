<template>
  <section class="relative px-6 md:px-0">
    <div class="container mt-[80px] md:mt-[375px]">
      <div class="flex flex-col items-center justify-center overflow-x-clip md:flex-row xl:justify-start">
        <!-- 贊助圖片 -->
        <div class="shrink translate-x-0 translate-y-0 md:ml-[-14%] md:shrink-0 md:translate-x-[15px] xl:ml-0">
          <NuxtImg
            width="631"
            height="772"
            loading="eager"
            placeholder
            src="/home/donate.png"
            class="hidden h-auto w-[clamp(333px,52.07vw,631px)] md:block"
          />
          <NuxtImg
            width="333"
            height="386"
            loading="eager"
            placeholder
            src="/home/donate-md.png"
            class="block md:hidden"
          />
        </div>
        <!-- 內容區域 -->
        <div class="max-w-[518px] px-0 py-6 font-serif font-medium md:translate-y-[-15%] md:px-6 md:py-8 lg:translate-y-[-14%] xl:max-w-[711px] xl:translate-y-[-6%]">
          <h2 class="mb-6 text-center text-[clamp(28px,7.8125vw-32px,48px)] font-bold leading-[1.214] text-vconf-heading">
            <span class="pr-2 lg:pr-6">(</span>
            <span class="pr-2 lg:pr-6">贊助商</span>
            <span>)</span>
          </h2>
          <div class="text-[clamp(16px,1.953vw+1.04px,21px)] leading-[160%] tracking-[0.02em] text-vconf-text-read">
            <p class="mb-6">
              <span class="text-vconf-primary">V-CONF Taiwan 2026 </span>致力於為所有與會者，包括講者、贊助商與工作人員，提供一個安全、無騷擾且相互尊重的活動環境。
            </p>
            <p class="mb-6">
              作為台灣具指標性的 Vue.js 年度盛會，<span class="text-vconf-primary">V-CONF Taiwan 2026 </span>匯聚來自各地的前端開發者、技術愛好者與業界專業人士。今年以「連結社群，啟發未來」為主題，聚焦 Vue.js 生態系與現代前端工具鏈的發展趨勢。
            </p>
            <p class="mb-6">
              我們誠摯邀請您成為 <span class="text-vconf-primary">V-CONF Taiwan 2026 </span>的贊助夥伴，與我們一同接觸高度集中的前端開發者社群、潛在技術人才與業界參與者。
            </p>
            <p class="mb-6">
              透過現場互動、品牌曝光與多元合作形式，您不僅能提升品牌在技術圈的能見度，也能展現企業對開源技術與前端生態的投入，進一步建立與開發者之間的長期連結，強化品牌影響力。
            </p>
            <p class="text-center text-vconf-primary">
              這不僅是一次曝光機會，更是參與並支持開源社群發展的重要契機。
            </p>
          </div>
          <!-- Vue icon（裝飾） -->
          <NuxtImg
            src="/home/vue-bg.png"
            width="384"
            height="355"
            loading="eager"
            class="absolute right-[-230px] top-[-65px] hidden xl:block"
          />
          <!-- Vite icon（裝飾） -->
          <NuxtImg
            src="/home/vite-bg.png"
            width="255"
            height="243"
            loading="eager"
            class="absolute right-[38px] top-[-187px] hidden xl:block"
          />
        </div>

        <!-- 區塊間背景圖 -->
        <!-- <div
          class="section-bg-layer pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
        >
          <NuxtPicture
            src="/home/section-bg.png"
            class="section-bg absolute left-0 top-0"
            sizes="(max-width: 767px) 728px, 1159px"
            width="1159"
            height="880"
            loading="eager"
            :img-attrs="{ class: 'max-w-none w-[728px] h-[553px] md:w-[1159px] md:h-[880px]' }"
          />
        </div> -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-bg-layer {
  overflow-x: clip;
  overflow-y: visible;
}

.section-bg {
  pointer-events: none;
  user-select: none;
}
</style>
