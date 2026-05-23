<template>
  <section class="relative overflow-x-clip text-clip pb-[288px] pt-[166px] text-center">
    <!-- 切換按鈕 -->
    <ShareThemeToggle class="left-[17px] top-[66px]" />
    <h1 class="flex h-[106px] justify-center font-sans font-bold leading-[1] text-vconf-primary">
      <span class="pr-[17px] text-[106px] leading-[-2%] text-vconf-heading">About</span>
      <span class="pr-1 text-[106px] leading-[-2%]">VCONF</span>
      <span class="text-[84px]">TW</span>
    </h1>
    <Teleport to="body">
      <div>
        <NuxtImg
          src="/about/hero-bg-1.png"
          width="1159"
          height="1171"
          loading="eager"
          class="pointer-events-none absolute left-[-546px] top-[-164px] z-30 max-w-none"
        />
        <NuxtImg
          src="/about/hero-bg-2.png"
          width="1159"
          height="1175"
          loading="eager"
          class="pointer-events-none absolute right-[-575px] top-[-394px] z-30 max-w-none"
        />
      </div>
    </Teleport>
  </section>
</template>
