<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

useSeoMeta({
  title: '議程資訊',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const lenis = useLenis()
const { findTalkById } = useAgenda()

const talkId = computed(() => {
  const value = route.params.talk
  return Array.isArray(value) ? value[0] : value
})
const talk = computed(() => (talkId.value ? findTalkById(talkId.value) : null))
const visible = ref(false)
const closeRequested = ref(false)
let isScrollLockedByModal = false

function lockBackgroundScroll() {
  // 路由變更時 NavBar 會呼叫 start()，因此鎖定期間仍需再次 stop()。
  lenis.stop()
  isScrollLockedByModal = true
}

function unlockBackgroundScroll() {
  if (!isScrollLockedByModal)
    return

  lenis.start()
  isScrollLockedByModal = false
}

function open() {
  closeRequested.value = false
  lockBackgroundScroll()
  visible.value = true
}

onMounted(() => {
  if (talkId.value)
    open()
})

watch(talkId, (value) => {
  if (value) {
    open()
    return
  }

  // 瀏覽器返回時，網址會先改變，再由同一個頁面元件淡出彈窗。
  if (!closeRequested.value) {
    lockBackgroundScroll()
    visible.value = false
  }
})

function close() {
  if (!visible.value || closeRequested.value)
    return

  closeRequested.value = true
  visible.value = false
}

async function afterLeave() {
  if (closeRequested.value && talkId.value)
    await navigateTo('/agenda/unpublish', { replace: true })

  closeRequested.value = false
  unlockBackgroundScroll()
}

onKeyStroke('Escape', close)
onBeforeUnmount(unlockBackgroundScroll)
</script>

<template>
  <main>
    <ShareHero title="Agenda" />
    <AgendaList />

    <Teleport to="body">
      <Transition
        name="agenda-modal"
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
              找不到此議程（id：{{ talkId }}）
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style>
.agenda-modal-enter-active,
.agenda-modal-leave-active {
  transition: opacity 0.3s ease;
}

.agenda-modal-enter-from,
.agenda-modal-leave-to {
  opacity: 0;
}
</style>
