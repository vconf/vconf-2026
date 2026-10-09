<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    isAbout?: boolean
  }>(),
  {
    isAbout: false,
  },
)
</script>

<template>
  <section
    class="relative overflow-hidden overflow-x-clip text-clip pb-[266px] pt-[238px] text-center md:pb-[288px] md:pt-[166px]"
  >
    <!-- 切換按鈕：掛到 body，換頁時頁面的 transform 會把它關在頁面的層級裡 -->
    <Teleport to="body">
      <ShareThemeToggle class="z-40" />
    </Teleport>
    <h1
      class="relative z-40 flex justify-center font-sans font-semibold leading-[1] text-vconf-primary"
    >
      <span
        class="pr-[7px] text-[clamp(48px,calc(-5.44px+9.32vw),106px)] leading-[-2%] text-vconf-heading md:pr-[17px]"
      >{{ title }}</span>
      <template v-if="isAbout">
        <span
          class="pr-[2px] text-[clamp(48px,calc(-5.44px+9.32vw),106px)] leading-[-2%] md:pr-4"
        >VCONF</span>
        <span
          class="text-[clamp(24px,calc(5.26px+4.662vw),53px)] tracking-[0em]"
        >TW</span>
      </template>
    </h1>
    <!-- 背景層比 Hero 高、會延伸到下一區，用負 z-index 墊在最底；
         正值會在換頁轉場時（頁面 transform 自成層級）蓋住內容 -->
    <Teleport to="body">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-[760px] w-svw -translate-x-1/2 overflow-hidden md:h-[980px]"
      >
        <!-- 位置與尺寸＝About 稿（242:13627 / 378:70356）兩個 deco-1 frame 的外框；桌機 ≥1512 釘在稿上的位置，
             以下按稿上露出的比例（左 47.35%、右 47.09% 視窗寬）縮，兩張加起來不到 100%，不會在中間交錯 -->
        <NuxtImg
          src="/about/hero-bg-1.png"
          alt=""
          aria-hidden="true"
          width="1434"
          height="1447"
          loading="eager"
          format="avif,webp"
          densities="x1 x2"
          class="absolute left-[clamp(-1070px,calc(47.35vw-1434px),-718px)] top-[-262px] hidden max-w-none md:block"
        />
        <NuxtImg
          src="/about/hero-bg-2.png"
          alt=""
          aria-hidden="true"
          width="1430"
          height="1449"
          loading="eager"
          format="avif,webp"
          densities="x1 x2"
          class="absolute right-[clamp(-1068px,calc(47.09vw-1430px),-718px)] top-[-528px] hidden max-w-none md:block"
        />
        <!-- 手機版 -->
        <NuxtImg
          src="/about/hero-bg-left-small.png"
          alt=""
          aria-hidden="true"
          width="810"
          height="817"
          loading="eager"
          format="avif,webp"
          densities="x1 x2"
          class="absolute left-[-437px] top-[111px] block max-w-none md:hidden"
        />
        <NuxtImg
          src="/about/hero-bg-right-small.png"
          alt=""
          aria-hidden="true"
          width="807"
          height="818"
          loading="eager"
          format="avif,webp"
          densities="x1 x2"
          class="absolute right-[-443px] top-[-304px] block max-w-none md:hidden"
        />
      </div>
    </Teleport>
  </section>
</template>
