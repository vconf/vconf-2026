<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

definePageMeta({
  pageTransition: false,
  layoutTransition: false,
  scrollToTop: false, // 開/關彈窗時保留頁面捲動位置
})

const route = useRoute()
const { findTalkById } = useAgenda()

const talk = computed(() => findTalkById(route.params.talk as string))

// 由 visible 驅動淡入淡出；Teleport 到 body 確保蓋在最上層
const visible = ref(false)
const isClosing = ref(false)
onMounted(() => {
  visible.value = true
})

function close() {
  if (isClosing.value)
    return

  isClosing.value = true
  visible.value = false
}

function afterLeave() {
  if (isClosing.value)
    navigateTo('/agenda/unpublish')
}

onKeyStroke('Escape', () => close())
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal-fade"
      @after-leave="afterLeave"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-[520px] rounded-[24px] bg-vconf-white p-8 font-serif"
        >
          <button
            type="button"
            class="absolute right-5 top-5 text-[20px] text-vconf-gray-light"
            aria-label="關閉"
            @click="close"
          >
            ✕
          </button>

          <template v-if="talk">
            <p class="mb-2 text-[14px] font-bold text-vconf-primary">
              Talk {{ talk.talkNumber }}・{{ talk.time }}
            </p>
            <h2
              class="mb-6 text-[24px] font-bold leading-[1.3] text-vconf-text-read"
            >
              {{ talk.title }}
            </h2>
            <div class="flex items-center gap-4">
              <NuxtImg
                :src="talk.speaker.avatar"
                :alt="talk.speaker.avatarAlt"
                width="80"
                height="80"
                loading="lazy"
                class="size-[80px] rounded-full object-cover"
              />
              <div>
                <p class="text-[20px] font-bold text-vconf-primary">
                  {{ talk.speaker.name }}
                </p>
                <p class="text-[14px] text-vconf-gray-light">
                  {{ talk.speaker.title }}
                </p>
              </div>
            </div>
          </template>
          <p
            v-else
            class="text-vconf-text-read"
          >
            找不到此議程（id：{{ route.params.talk }}）
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<!-- 非 scoped：Teleport 到 body 的內容需全域 class 才能套用過場 -->
<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
