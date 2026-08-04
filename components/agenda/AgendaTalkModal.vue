<script setup lang="ts">
import type { TalkItem } from '~/utils/agenda'
import { isContentSpeaker } from '~/utils/agenda'

const props = defineProps<{
  visible: boolean
  talk: TalkItem | null
  talkId?: string
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()

const speakerLinkIcons = [
  {
    label: '個人網站',
    icon: '/agenda/website-icon.svg',
    width: 28,
    height: 28,
    mobileWidth: 24,
    mobileHeight: 24,
  },
  {
    label: 'FB',
    icon: '/agenda/fb.svg',
    width: 17,
    height: 28,
    mobileWidth: 14,
    mobileHeight: 23,
  },
  {
    label: 'thread',
    icon: '/agenda/thread.svg',
    width: 23,
    height: 28,
    mobileWidth: 19,
    mobileHeight: 23,
  },
  {
    label: 'IG',
    icon: '/agenda/ig-icon.svg',
    width: 28,
    height: 28,
    mobileWidth: 24,
    mobileHeight: 24,
  },
] as const

const speakerDetails = computed(() => {
  if (!props.talk || !isContentSpeaker(props.talk.speaker))
    return null

  return props.talk.speaker
})

const speakerSocialLinks = computed(() => {
  if (!speakerDetails.value)
    return []

  return speakerLinkIcons.flatMap((iconConfig) => {
    const link = speakerDetails.value?.links.find(
      item => item.label === iconConfig.label,
    )

    return link ? [{ ...link, ...iconConfig }] : []
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="agenda-modal"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] overflow-hidden bg-vconf-black/80"
        role="dialog"
        aria-modal="true"
        :aria-label="talk ? undefined : '議程資訊'"
        :aria-labelledby="talk ? 'agenda-talk-title' : undefined"
        @click.self="emit('close')"
      >
        <div
          class="grid size-full place-items-center px-6 py-[51px] md:px-[44px]"
        >
          <div
            class="relative mx-auto flex h-[90svh] max-h-[710px] w-full max-w-[1209px] flex-col items-start justify-center gap-6 md:flex-row"
          >
            <!-- 關閉按鈕 -->
            <button
              type="button"
              class="absolute right-[-7px] top-[-40px] z-10 grid size-[30px] place-items-center rounded-full bg-vconf-white text-vconf-purple md:right-[-35px] md:top-[-35px] md:size-10"
              aria-label="關閉議程資訊"
              @click="emit('close')"
            >
              <svg
                viewBox="0 0 28 28"
                aria-hidden="true"
                class="size-3.5 md:size-6"
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
            <!-- 廣告 -->
            <aside
              v-if="talk"
              class="w-full shrink-0 overflow-hidden rounded-[24px] object-top md:size-full md:w-[300px] md:object-center"
              aria-label="贊助廣告"
            >
              <NuxtImg
                width="354"
                height="110"
                src="/agenda/mobile-ad.png"
                alt="贊助廣告"
                loading="lazy"
                format="avif,webp"
                densities="x1 x2"
                class="block h-[110px] w-full rounded-[24px] object-cover md:hidden"
              />
              <NuxtImg
                width="300"
                height="710"
                src="/agenda/desktop-ad.png"
                alt="贊助廣告"
                loading="lazy"
                format="avif,webp"
                densities="x1 x2"
                class="hidden h-[710px] w-full rounded-[24px] object-cover object-top md:block"
              />
            </aside>
            <!-- 講者議程 -->
            <article
              class="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-vconf-white font-serif"
            >
              <template v-if="talk">
                <header
                  class="mb-3 flex shrink-0 items-center gap-3 pl-4 font-serif md:mb-[31px] md:gap-[19px] md:pl-[27px]"
                >
                  <p
                    class="flex w-fit items-baseline gap-[5px] rounded-b-[12px] bg-vconf-purple p-[10px] font-bold text-white"
                  >
                    <span
                      class="block text-[14px] leading-[1.6] tracking-[0.02em] md:text-[16px]"
                    >Talk</span>
                    <span
                      class="block text-[24px] leading-[1.2] tracking-[0em] md:text-[32px] md:leading-normal md:tracking-[0.01em]"
                    >{{ talk.talkNumber }}</span>
                  </p>
                  <time
                    class="text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-purple md:text-[18px] md:font-medium md:leading-normal md:tracking-[0.01em]"
                    :datetime="`2026-10-17T${talk.time}:00+08:00`"
                  >
                    10/17 {{ talk.time }}～{{ talk.endTime }}
                  </time>
                </header>

                <div
                  class="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar"
                  data-lenis-prevent
                >
                  <div
                    class="grid px-8 pb-12 md:grid-cols-[minmax(0,1fr)_200px] md:gap-8 lg:grid-cols-[minmax(0,1fr)_253px] lg:gap-12"
                  >
                    <section>
                      <h2
                        id="agenda-talk-title"
                        class="mb-4 text-[24px] font-bold leading-normal tracking-[0.01em] text-vconf-text-read md:mb-8 md:text-[32px]"
                      >
                        {{ talk.title }}
                      </h2>

                      <template v-if="speakerDetails">
                        <ContentRenderer
                          :value="speakerDetails"
                          data-agenda-description
                          class="font-serif text-[16px] font-demi-light leading-[1.6] tracking-[0.01em] text-vconf-text-read"
                        />
                      </template>
                    </section>
                    <aside
                      class="mt-[48px] self-start bg-vconf-white md:sticky md:top-0 md:mt-0"
                      aria-label="講者資訊"
                    >
                      <div class="flex gap-4 md:block">
                        <NuxtImg
                          :src="talk.speaker.avatar"
                          :alt="talk.speaker.avatarAlt"
                          width="306"
                          height="366"
                          loading="lazy"
                          format="avif,webp"
                          densities="x1 x2"
                          class="size-[120px] rounded-full object-cover md:h-[400px] md:w-full md:rounded-none"
                        />
                        <div class="mt-6">
                          <p class="mb-2 flex items-center md:mb-0">
                            <span
                              class="pr-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light md:pr-4"
                            >{</span>
                            <span
                              class="text-[20px] font-bold leading-[1.2] tracking-[0em] text-vconf-primary md:text-[24px]"
                            >{{ talk.speaker.name }}</span>
                            <span
                              class="pl-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light md:pl-4"
                            >}</span>
                          </p>
                          <p
                            class="mt-4 text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-text-read"
                          >
                            {{ talk.speaker.jobTitle }}
                          </p>
                          <p
                            v-if="speakerDetails"
                            class="text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-gray-light"
                          >
                            {{ speakerDetails.company }}
                          </p>
                        </div>
                      </div>

                      <ul
                        v-if="speakerSocialLinks.length"
                        class="mt-5 flex items-start justify-end gap-4"
                      >
                        <li
                          v-for="link in speakerSocialLinks"
                          :key="`${link.label}-${link.href}`"
                        >
                          <a
                            :href="link.href"
                            :aria-label="link.label"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="block"
                            data-social-link-icon
                            :style="{
                              '--social-icon-width': `${link.mobileWidth}px`,
                              '--social-icon-height': `${link.mobileHeight}px`,
                              '--social-icon-md-width': `${link.width}px`,
                              '--social-icon-md-height': `${link.height}px`,
                            }"
                          >
                            <NuxtImg
                              :src="link.icon"
                              :width="link.width"
                              :height="link.height"
                              alt=""
                              aria-hidden="true"
                              class="block size-full object-contain"
                            />
                          </a>
                        </li>
                      </ul>
                    </aside>
                  </div>
                </div>
              </template>

              <p
                v-else
                class="px-6 py-16 text-center text-vconf-text-read"
              >
                找不到此議程（id：{{ talkId }}）
              </p>
            </article>
          </div>
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

[data-social-link-icon] {
  width: var(--social-icon-width);
  height: var(--social-icon-height);
}

@media (min-width: 768px) {
  [data-social-link-icon] {
    width: var(--social-icon-md-width);
    height: var(--social-icon-md-height);
  }
}

[data-agenda-description] :deep(p + p),
[data-agenda-description] :deep(p + ol),
[data-agenda-description] :deep(ol + p) {
  margin-top: 1.5rem;
}

[data-agenda-description] :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}
</style>
