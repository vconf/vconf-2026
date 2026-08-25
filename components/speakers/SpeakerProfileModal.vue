<script setup lang="ts">
import type { SpeakersCollectionItem } from '@nuxt/content'
import { useMediaQuery } from '@vueuse/core'
import SpeakerProfileSection from '~/components/speakers/SpeakerProfileSection.vue'
import { speakerPhoto } from '~/utils/agenda'

const props = defineProps<{
  visible: boolean
  speaker: SpeakersCollectionItem | null
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()
const isDesktop = useMediaQuery('(min-width: 768px)')

const speakerLinkIcons = [
  { label: 'GitHub', icon: '/agenda/github-icon.svg' },
  { label: '希望宣傳連結', icon: '/agenda/website-icon.svg' },
  { label: '個人網站', icon: '/agenda/website-icon.svg' },
  { label: 'X', icon: '/agenda/x.svg' },
  { label: 'FB', icon: '/agenda/fb.svg' },
  { label: 'thread', icon: '/agenda/thread.svg' },
  { label: 'IG', icon: '/agenda/ig-icon.svg' },
] as const

const socialLinks = computed(() => {
  if (!props.speaker)
    return []

  // 同一個 label 可能有多筆（例如兩個希望宣傳連結），全部都要顯示
  return speakerLinkIcons.flatMap(iconConfig =>
    (props.speaker?.links ?? [])
      .filter(item => item.label === iconConfig.label)
      .map(link => ({ ...link, ...iconConfig })),
  )
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
        <NuxtImg
          v-if="!isDesktop"
          src="/speaker/speaker-modal-bg-mobile.png"
          alt=""
          aria-hidden="true"
          width="554"
          height="504"
          loading="eager"
          format="avif,webp"
          densities="x1 x2"
          class="pointer-events-none absolute left-1/2 top-[70%] -z-10 ml-[-35px] h-[504px] w-[554px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
        <div
          class="relative grid size-full place-items-start overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-8 scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:place-items-center md:overflow-visible md:px-12"
          data-lenis-prevent
          @click.self="emit('close')"
        >
          <div
            class="relative isolate mx-auto flex w-full flex-col gap-5 md:h-[85svh] md:max-h-[710px] md:max-w-[965px] md:flex-row md:items-start md:gap-[40px]"
          >
            <button
              type="button"
              class="absolute right-[-7px] top-[-20px] z-10 grid size-[30px] place-items-center rounded-full bg-vconf-white text-vconf-purple md:right-[-35px] md:top-[-35px] md:size-10"
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
              v-if="isDesktop"
              src="/speaker/speaker-modal-bg-desktop.png"
              alt=""
              aria-hidden="true"
              width="788"
              height="717"
              loading="eager"
              format="avif,webp"
              densities="x1 x2"
              class="pointer-events-none absolute bottom-[-340px] left-[-265px] -z-10 h-[717px] w-[788px] max-w-none"
            />

            <template v-if="speaker">
              <aside
                class="relative mx-auto aspect-speaker-photo-modal-sm w-full max-w-[260px] md:mx-0 md:aspect-speaker-photo-modal md:h-[560px] md:max-h-full md:min-h-0 md:w-auto md:max-w-none md:shrink-0"
                aria-label="講者照片"
              >
                <div class="size-full overflow-hidden rounded-[12px]">
                  <NuxtImg
                    v-if="!isDesktop"
                    :src="speakerPhoto(speaker, 'profileMobile')"
                    :alt="speaker.avatarAlt"
                    width="260"
                    height="370"
                    loading="eager"
                    format="avif,webp"
                    densities="x1 x2"
                    class="block size-full object-cover object-top"
                  />
                  <NuxtImg
                    v-else
                    :src="speakerPhoto(speaker, 'profile')"
                    :alt="speaker.avatarAlt"
                    width="333"
                    height="560"
                    loading="eager"
                    format="avif,webp"
                    densities="x1 x2"
                    class="block size-full object-cover object-top"
                  />
                </div>

                <div
                  v-if="isDesktop"
                  class="speaker-reflection pointer-events-none absolute inset-x-0 top-full hidden size-full overflow-hidden rounded-[12px] md:block"
                  aria-hidden="true"
                >
                  <NuxtImg
                    :src="speakerPhoto(speaker, 'profile')"
                    alt=""
                    width="333"
                    height="560"
                    loading="eager"
                    format="avif,webp"
                    densities="x1 x2"
                    class="size-full -scale-y-100 object-cover object-top"
                  />
                </div>
              </aside>

              <article
                class="overflow-hidden rounded-[20px] bg-vconf-white font-serif md:h-full md:min-h-0 md:flex-1"
              >
                <div
                  class="overscroll-contain px-6 py-7 scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:h-full md:overflow-y-auto md:p-8 md:scrollbar-w-scrollbar-md"
                  data-lenis-prevent
                >
                  <header class="mb-4 md:mb-6">
                    <h2
                      id="speaker-profile-title"
                      class="mb-2 flex items-center md:mb-4"
                    >
                      <span
                        class="pr-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pr-4 md:text-[32px] md:tracking-[0em]"
                      >{</span>
                      <span
                        class="font-serif text-[20px] font-bold leading-[1.2] text-vconf-primary md:text-[48px]"
                      >{{ speaker.name }}</span>
                      <span
                        class="pl-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pl-4 md:text-[32px] md:tracking-[0em]"
                      >}</span>
                    </h2>

                    <div class="flex flex-col gap-4 md:gap-6">
                      <div
                        class="text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-text-read"
                      >
                        <p
                          v-if="speaker.company && speaker.company !== '-'"
                          class="md:mb-1"
                        >
                          {{ speaker.company }}
                        </p>
                        <p>{{ speaker.jobTitle }}</p>
                      </div>

                      <ul
                        v-if="socialLinks.length"
                        class="ml-auto flex shrink-0 items-center gap-4"
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
                    class="mb-2 md:mb-6"
                  >
                    <p class="whitespace-pre-line">
                      {{ speaker.speakerInfo }}
                    </p>
                  </SpeakerProfileSection>

                  <SpeakerProfileSection
                    v-if="speaker.experiences.length"
                    label="經歷"
                    class="mb-2 md:mb-6"
                  >
                    <ul role="list">
                      <li
                        v-for="experience in speaker.experiences"
                        :key="experience"
                        class="flex items-start gap-2 tracking-[0em] before:mt-[calc(0.8em-0.125rem)] before:size-1 before:shrink-0 before:rounded-full before:bg-current"
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
                    <ContentRenderer
                      :value="speaker"
                      data-speaker-description
                    />
                  </SpeakerProfileSection>
                </div>
              </article>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.speaker-reflection {
  opacity: 0.35;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.45) 55%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.45) 55%,
    transparent 100%
  );
}

.speaker-modal-enter-active,
.speaker-modal-leave-active {
  transition: opacity 0.3s ease;
}

.speaker-modal-enter-from,
.speaker-modal-leave-to {
  opacity: 0;
}

[data-speaker-description] :deep(p + p),
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
