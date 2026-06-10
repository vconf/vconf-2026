<template>
  <section class="relative overflow-hidden overflow-x-clip text-clip pb-[266px] pt-[238px] text-center md:pb-[288px] md:pt-[166px]">
    <!-- 切換按鈕 -->
    <ShareThemeToggle class="left-[17px] top-[66px]" />
    <h1 class="relative z-40 flex justify-center font-sans font-semibold leading-[1] text-vconf-primary">
      <span class="pr-[7px] text-[clamp(48px,calc(-5.44px+9.32vw),106px)] leading-[-2%] text-vconf-heading md:pr-[17px]">About</span>
      <span class="pr-[2px] text-[clamp(48px,calc(-5.44px+9.32vw),106px)] leading-[-2%] md:pr-4">VCONF</span>
      <span class="text-[clamp(24px,calc(5.26px+4.662vw),53px)] tracking-[0em]">TW</span>
    </h1>
    <Teleport to="body">
      <div class="pointer-events-none absolute left-1/2 top-0 z-30 h-0 w-screen -translate-x-1/2 overflow-x-clip">
        <NuxtImg
          src="/about/hero-bg-1.png"
          width="1159"
          height="1171"
          loading="eager"
          class="absolute left-[clamp(-800px,calc(-1562px+99.22vw),-546px)] top-[-164px] hidden max-w-none md:block"
        />
        <NuxtImg
          src="/about/hero-bg-left-small.png"
          width="810"
          height="817"
          loading="eager"
          class="absolute left-[-434px] top-[116px] block max-w-none md:hidden"
        />
        <NuxtImg
          src="/about/hero-bg-2.png"
          width="1159"
          height="1175"
          loading="eager"
          class="absolute right-[clamp(-800px,calc(-1475px+87.89vw),-575px)] top-[-394px] hidden max-w-none md:block"
        />
        <NuxtImg
          src="/about/hero-bg-right-small.png"
          width="807"
          height="818"
          loading="eager"
          class="absolute right-[-437px] top-[-301px] block max-w-none md:hidden"
        />
      </div>
    </Teleport>
  </section>
</template>
