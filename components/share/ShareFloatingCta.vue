<script setup lang="ts">
interface Props {
  /** 按鈕文字 */
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '早鳥優惠',
})
</script>

<template>
  <div class="fixed right-0 top-0 pl-6 pr-[13px]">
    <NuxtImg
      width="37"
      height="38"
      alt=""
      aria-hidden="true"
      src="/home/download.svg"
      loading="lazy"
      class="mb-2.5"
    />
    <p class="font-serif text-[22px] text-vconf-gray-exlight">
      {{ text }}
    </p>
  </div>
</template>
