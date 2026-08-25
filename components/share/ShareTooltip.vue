<script setup lang="ts">
const props = defineProps<{
  /** 泡泡文字；空字串不顯示 */
  text: string
}>()

const root = ref<HTMLElement | null>(null)
const tip = ref<HTMLElement | null>(null)
const visible = ref(false)
const placement = ref<'bottom' | 'top'>('bottom')

function clipBottom(el: HTMLElement) {
  let node = el.parentElement

  while (node) {
    if (getComputedStyle(node).overflowY !== 'visible')
      return node.getBoundingClientRect().bottom

    node = node.parentElement
  }

  return window.innerHeight
}

function show() {
  if (!root.value)
    return

  const rect = root.value.getBoundingClientRect()
  const need = (tip.value?.offsetHeight ?? 28) + 8

  placement.value
    = rect.bottom + need <= clipBottom(root.value) ? 'bottom' : 'top'
  visible.value = true
}
</script>

<template>
  <div
    ref="root"
    class="relative"
    @mouseenter="show"
    @focusin="show"
    @mouseleave="visible = false"
    @focusout="visible = false"
  >
    <slot></slot>
    <span
      v-if="props.text"
      ref="tip"
      aria-hidden="true"
      class="pointer-events-none absolute right-0 z-10 hidden whitespace-nowrap rounded-[8px] bg-vconf-black/85 px-2 py-1 text-[13px] font-medium leading-[1.4] text-vconf-white transition-opacity duration-200 md:block"
      :class="[
        placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
        visible ? 'opacity-100' : 'opacity-0',
      ]"
    >{{ props.text }}</span>
  </div>
</template>
