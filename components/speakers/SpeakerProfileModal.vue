<script setup lang="ts">
import type { SpeakersCollectionItem } from '@nuxt/content'
import SpeakerProfileSection from '~/components/speakers/SpeakerProfileSection.vue'
import { speakerPhoto } from '~/utils/agenda'

const props = defineProps<{
  visible: boolean
  speaker: SpeakersCollectionItem | null
  speakerId?: string
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()

const speakerLinkIcons = [
  { label: '個人網站', icon: '/agenda/website-icon.svg' },
  { label: 'X', icon: '/agenda/x.svg' },
  { label: 'FB', icon: '/agenda/fb.svg' },
  { label: 'thread', icon: '/agenda/thread.svg' },
  { label: 'IG', icon: '/agenda/ig-icon.svg' },
] as const

const socialLinks = computed(() => {
  if (!props.speaker)
    return []

  return speakerLinkIcons.flatMap((iconConfig) => {
    const link = props.speaker?.links.find(
      item => item.label === iconConfig.label,
    )

    return link ? [{ ...link, ...iconConfig }] : []
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="speaker-modal"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] overflow-hidden bg-vconf-black/85"
        role="dialog"
        aria-modal="true"
        :aria-label="speaker ? undefined : '講者介紹'"
        :aria-labelledby="speaker ? 'speaker-profile-title' : undefined"
        @click.self="emit('close')"
      >
        <!-- 背景裝飾圖可在這一層補上 -->
        <div
          class="relative grid size-full place-items-center px-6 py-[52px] md:px-12"
          @click.self="emit('close')"
        >
          <div
            class="relative mx-auto flex h-[80svh] max-h-[710px] w-full flex-col gap-5 md:max-w-[917px] md:flex-row md:items-start md:gap-[40px]"
          >
            <button
              type="button"
              class="absolute right-[-7px] top-[-40px] z-10 grid size-[30px] place-items-center rounded-full bg-vconf-white text-vconf-purple md:right-[-35px] md:top-[-35px] md:size-10"
              aria-label="關閉講者介紹"
              @click="emit('close')"
            >
              <svg
                viewBox="0 0 28 28"
                aria-hidden="true"
                class="size-3.5 md:size-5"
              >
                <path
                  d="M1 1L27 27M27 1L1 27"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <NuxtImg
              src="/speaker/speakerModalBg.png"
              alt=""
              aria-hidden="true"
              width="788"
              height="717"
              loading="lazy"
              format="avif,webp"
              densities="x1 x2"
              class="absolute inset-0"
            />

            <template v-if="speaker">
              <aside
                class="aspect-speaker-photo-modal h-[550px] max-h-full min-h-0 overflow-hidden rounded-[12px] md:shrink-0"
                aria-label="講者照片"
              >
                <NuxtImg
                  :src="speakerPhoto(speaker, 'modal')"
                  :alt="speaker.avatarAlt"
                  width="300"
                  height="610"
                  loading="lazy"
                  format="avif,webp"
                  densities="x1 x2"
                  class="size-full object-cover object-top"
                />
              </aside>

              <article
                class="min-h-0 flex-1 overflow-hidden rounded-[20px] bg-vconf-white font-serif md:h-full"
              >
                <div
                  class="h-full overflow-y-auto overscroll-contain px-6 py-7 scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:p-8"
                  data-lenis-prevent
                >
                  <header class="mb-6">
                    <h2
                      id="speaker-profile-title"
                      class="mb-4 flex items-center"
                    >
                      <span
                        class="pr-4 font-sans text-[32px] font-medium leading-[1] text-vconf-gray-light"
                      >{</span>
                      <span
                        class="text-[48px] font-bold leading-normal text-vconf-primary"
                      >{{ speaker.name }}</span>
                      <span
                        class="pl-4 font-sans text-[32px] font-medium leading-[1] text-vconf-gray-light"
                      >}</span>
                    </h2>

                    <div
                      class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
                    >
                      <div
                        class="text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-text-read"
                        :class="{ 'mb-6': socialLinks.length }"
                      >
                        <p
                          v-if="speaker.company && speaker.company !== '-'"
                          class="mb-1"
                        >
                          {{ speaker.company }}
                        </p>
                        <p>{{ speaker.jobTitle }}</p>
                      </div>

                      <ul
                        v-if="socialLinks.length"
                        class="flex shrink-0 items-center gap-4"
                      >
                        <li
                          v-for="link in socialLinks"
                          :key="`${link.label}-${link.href}`"
                          class="shrink-0"
                        >
                          <a
                            :href="link.href"
                            :aria-label="link.label"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="block size-6"
                          >
                            <NuxtImg
                              :src="link.icon"
                              width="24"
                              height="24"
                              alt=""
                              aria-hidden="true"
                              class="block size-full object-contain"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </header>

                  <SpeakerProfileSection
                    label="講者個人介紹"
                    class="mb-6"
                  >
                    <p>{{ speaker.speakerInfo }}</p>
                  </SpeakerProfileSection>

                  <SpeakerProfileSection
                    v-if="speaker.experiences.length"
                    label="經歷"
                    class="mb-6"
                  >
                    <ul>
                      <li
                        v-for="experience in speaker.experiences"
                        :key="experience"
                      >
                        {{ experience }}
                      </li>
                    </ul>
                  </SpeakerProfileSection>

                  <SpeakerProfileSection
                    :label="`Talk ${speaker.talkNumber}`"
                    as="p"
                  >
                    <template #meta>
                      <time
                        :datetime="`2026-10-17T${speaker.startTime}:00+08:00`"
                        class="text-[16px] leading-[1.6] tracking-[0.02em] text-vconf-purple"
                      >
                        {{ speaker.startTime }}–{{ speaker.endTime }}
                      </time>
                    </template>
                    <p
                      class="mb-3 text-[24px] font-bold leading-[1.2] tracking-[0em] text-vconf-text-read"
                    >
                      {{ speaker.topic }}
                    </p>
                    <!-- 議程介紹來自講者 md 的正文，需用 ContentRenderer 渲染 AST -->
                    <ContentRenderer
                      :value="speaker"
                      data-speaker-description
                    />
                  </SpeakerProfileSection>
                </div>
              </article>
            </template>

            <article
              v-else
              class="w-full rounded-[20px] bg-vconf-white px-6 py-16 text-center text-vconf-text-read"
            >
              找不到此講者（id：{{ speakerId }}）
            </article>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.speaker-modal-enter-active,
.speaker-modal-leave-active {
  transition: opacity 0.3s ease;
}

.speaker-modal-enter-from,
.speaker-modal-leave-to {
  opacity: 0;
}

[data-speaker-description] :deep(p + p),
[data-speaker-description] :deep(p + ol),
[data-speaker-description] :deep(p + ul),
[data-speaker-description] :deep(ol + p),
[data-speaker-description] :deep(ul + p) {
  margin-top: 1.5rem;
}

[data-speaker-description] :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

[data-speaker-description] :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}
</style>
