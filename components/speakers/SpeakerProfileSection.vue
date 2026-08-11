<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 紫色 pill 上的標籤文字 */
    label: string
    /** 標籤要用的標籤名，Talk 這種非標題用途傳 p */
    as?: 'h3' | 'p'
  }>(),
  { as: 'h3' },
)
</script>

<template>
  <section>
    <div class="mb-2 flex items-center gap-2">
      <component
        :is="as"
        class="w-fit rounded-xl bg-vconf-purple px-3 py-1 text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-gray-exlight"
      >
        {{ label }}
      </component>
      <!-- 標籤右側附註，例如議程時間 -->
      <slot name="meta"></slot>
    </div>
    <div
      class="text-[16px] font-demi-light leading-[1.6] tracking-[0.01em] text-black"
    >
      <slot></slot>
    </div>
  </section>
</template>
