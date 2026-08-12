<script setup lang="ts">
interface Props {
  /** 按鈕文字 */
  text?: string
  /** 連結目的地 */
  href?: string
}

withDefaults(defineProps<Props>(), {
  text: '早鳥優惠',
  href: '#',
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="gold-stroke fixed bottom-12 right-0 z-10 flex flex-col items-center rounded-l-3xl py-[15px] pl-[19px] pr-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vconf-white md:py-[19px] md:pl-6 md:pr-[13px]"
  >
    <NuxtImg
      width="37"
      height="38"
      alt=""
      aria-hidden="true"
      src="/home/download.svg"
      loading="lazy"
      class="mb-2 w-[29px] md:mb-2.5 md:w-[37px]"
    />
    <p
      class="font-serif text-[17px] leading-[1.6] tracking-[0.02em] text-vconf-gray-exlight md:text-[22px]"
    >
      {{ text }}
    </p>
  </a>
</template>

<style scoped>
.gold-stroke {
  background: linear-gradient(
    160deg,
    hsl(var(--color-purple)) 0%,
    hsl(var(--color-black)) 50%,
    hsl(var(--color-primary)) 100%
  );
}
.gold-stroke::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: var(--gradient-gold);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
