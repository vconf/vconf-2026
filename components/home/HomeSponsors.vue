<template>
  <section class="px-6">
    <div class="container mt-[80px] md:mt-[171px]">
      <div class="flex flex-col items-center justify-center md:flex-row">
        <!-- 贊助圖片 -->
        <div class="shrink translate-x-0 translate-y-0 md:ml-[-14%] md:shrink-0 md:translate-x-[15px] md:translate-y-[-12px] xl:ml-0">
          <NuxtImg
            width="631"
            height="772"
            loading="eager"
            placeholder
            src="/home/donate.png"
            class="hidden md:block"
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
        <div class="max-w-[518px] px-0 py-6 font-serif font-medium md:px-6 md:py-8 xl:max-w-[711px]">
          <h2 class="mb-6 text-center text-[28px] font-bold leading-[1.214] text-vconf-heading md:text-[48px]">
            <span class="pr-2 lg:pr-6">(</span>
            <span class="pr-2 lg:pr-6">贊助商</span>
            <span>)</span>
          </h2>
          <div class="text-[16px] leading-[160%] tracking-[0.02em] text-vconf-text-read md:text-[21px]">
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
        </div>
      </div>
    </div>
  </section>
</template>
