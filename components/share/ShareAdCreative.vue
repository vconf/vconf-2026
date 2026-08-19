<script setup lang="ts">
import type { AdImage } from '~/types/ad'
import { AD_DESKTOP_MEDIA } from '~/config/ad.config'

// 多層 <picture> 是刻意的多根節點，外層 class 由呼叫端自己的容器負責
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    images: {
      desktop: AdImage
      mobile: AdImage
    }
    alt: string
    /** 圖片本身的樣式；外框尺寸交給呼叫端的 class 決定 */
    imageClass?: string
  }>(),
  { imageClass: 'block size-full object-cover' },
)

const isLoaded = ref(false)
const creativeKey = computed(
  () => `${props.images.desktop.url}|${props.images.mobile.url}`,
)

watch(creativeKey, () => {
  isLoaded.value = false
})
</script>

<template>
  <!--
    廣告一律完整呈現不裁切，版位比例對不上時會留白（素材是固定比例、版位會隨視窗浮動）。
  -->
  <picture
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 block size-full scale-110 transition-opacity duration-300 motion-reduce:transition-none"
    :class="isLoaded ? 'opacity-0' : 'opacity-100'"
  >
    <source
      :media="AD_DESKTOP_MEDIA"
      :srcset="images.desktop.previewUrl || images.desktop.url"
    />
    <img
      :src="images.mobile.previewUrl || images.mobile.url"
      alt=""
      loading="eager"
      class="size-full object-cover blur-xl"
    />
  </picture>
  <picture
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 block size-full scale-110 blur-xl transition-opacity duration-300 motion-reduce:transition-none"
    :class="isLoaded ? 'opacity-100' : 'opacity-0'"
  >
    <source
      :media="AD_DESKTOP_MEDIA"
      :srcset="images.desktop.url"
    />
    <img
      :src="images.mobile.url"
      alt=""
      loading="eager"
      class="size-full object-cover"
    />
  </picture>
  <picture
    :key="creativeKey"
    class="relative block size-full transition-opacity duration-300 motion-reduce:transition-none"
    :class="isLoaded ? 'opacity-100' : 'opacity-0'"
  >
    <source
      :media="AD_DESKTOP_MEDIA"
      :srcset="images.desktop.url"
      :width="images.desktop.width"
      :height="images.desktop.height"
    />
    <img
      :src="images.mobile.url"
      :alt="alt"
      :width="images.mobile.width"
      :height="images.mobile.height"
      loading="eager"
      :class="imageClass"
      @load="isLoaded = true"
    />
  </picture>
</template>
