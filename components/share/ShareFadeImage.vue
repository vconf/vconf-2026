<script setup lang="ts">
defineOptions({ inheritAttrs: false })

/**
 * 彈窗用的圖片：還沒載好時透明（給了 frameClass 就露出底色框），載好才淡入。
 * 已在快取裡的圖掛上時就 complete，直接顯示，不會每次開彈窗都多淡一次。
 */
withDefaults(
  defineProps<{
    /** 底色框的尺寸與圓角；不給就不包框，只做淡入 */
    frameClass?: string
  }>(),
  {
    frameClass: undefined,
  },
)

const image = ref<{ $el: HTMLImageElement } | null>(null)
const loaded = ref(false)
const animate = ref(false)

onMounted(() => {
  const el = image.value?.$el

  if (el?.complete && el.naturalWidth)
    loaded.value = true
  else animate.value = true
})
</script>

<template>
  <span
    v-if="frameClass"
    class="block overflow-hidden bg-vconf-gray-exlight dark:bg-vconf-white/10"
    :class="frameClass"
  >
    <NuxtImg
      ref="image"
      v-bind="$attrs"
      :class="[
        loaded ? 'opacity-100' : 'opacity-0',
        animate && 'transition-opacity duration-200',
      ]"
      @load="loaded = true"
      @error="loaded = true"
    />
  </span>
  <NuxtImg
    v-else
    ref="image"
    v-bind="$attrs"
    :class="[
      loaded ? 'opacity-100' : 'opacity-0',
      animate && 'transition-opacity duration-200',
    ]"
    @load="loaded = true"
    @error="loaded = true"
  />
</template>
