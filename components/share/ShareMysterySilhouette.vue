<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** card：講者卡片的直式版位；circle：議程列表的圓形頭像 */
    variant?: 'card' | 'circle'
    /** 保留既有呼叫介面；snow 會多一圈細框 */
    tone?: 'mist' | 'snow' | 'duo'
  }>(),
  { variant: 'card', tone: 'mist' },
)

const PHOTO_SRC = '/speaker/mysteryKeynote-profile-blurred.webp'

const toneClass = computed(() =>
  props.tone === 'snow' ? 'ring-1 ring-inset ring-vconf-gray-exlight' : '',
)

const photoClass = computed(() =>
  props.variant === 'circle' ? 'object-[center_30%]' : 'object-center',
)
</script>

<template>
  <div
    class="relative isolate overflow-hidden"
    :class="toneClass"
  >
    <!-- 已預先完成柔焦與調色的靜態圖片；瀏覽器不再執行影像濾鏡 -->
    <img
      :src="PHOTO_SRC"
      alt=""
      aria-hidden="true"
      loading="lazy"
      class="absolute inset-0 size-full object-cover"
      :class="photoClass"
    />
  </div>
</template>
