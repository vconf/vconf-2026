<script setup lang="ts">
import type { TalkItem } from '~/utils/agenda'

defineProps<{
  visible: boolean
  talk: TalkItem | null
  talkId?: string
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      name="agenda-modal"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div
          class="relative w-full max-w-[520px] rounded-[24px] bg-vconf-white p-8 font-serif"
        >
          <button
            type="button"
            class="absolute right-5 top-5 text-[20px] text-vconf-gray-light"
            aria-label="關閉"
            @click="emit('close')"
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
</template>

<style scoped>
.agenda-modal-enter-active,
.agenda-modal-leave-active {
  transition: opacity 0.3s ease;
}

.agenda-modal-enter-from,
.agenda-modal-leave-to {
  opacity: 0;
}
</style>
