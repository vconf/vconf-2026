<script setup lang="ts">
import type { TeamMember } from '~/config/team'
import SpeakerProfileSection from '~/components/speakers/SpeakerProfileSection.vue'
import { teamPhoto } from '~/config/team'

const props = defineProps<{
  visible: boolean
  member: TeamMember | null
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()

// 圖示沿用議程／講者彈窗那組社群 icon，排序比照設計稿
const memberLinkIcons = [
  { key: 'website', label: '個人網站', icon: '/agenda/website-icon.svg' },
  { key: 'x', label: 'X', icon: '/agenda/x.svg' },
  { key: 'facebook', label: 'FB', icon: '/agenda/fb.svg' },
  { key: 'threads', label: 'thread', icon: '/agenda/thread.svg' },
  { key: 'instagram', label: 'IG', icon: '/agenda/ig-icon.svg' },
] as const

const socialLinks = computed(() => {
  const links = props.member?.links

  if (!links)
    return []

  return memberLinkIcons.flatMap((iconConfig) => {
    const href = links[iconConfig.key]

    return href ? [{ ...iconConfig, href }] : []
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="team-member-modal"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] overflow-hidden bg-vconf-black/85"
        role="dialog"
        aria-modal="true"
        :aria-label="member ? undefined : '籌備團隊成員介紹'"
        :aria-labelledby="member ? 'team-member-title' : undefined"
        @click.self="emit('close')"
      >
        <div
          class="grid size-full place-items-center items-start overflow-y-auto overscroll-contain px-6 py-[51px] scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:items-center md:px-[44px]"
          data-lenis-prevent
          @click.self="emit('close')"
        >
          <div class="relative mx-auto w-full max-w-[965px]">
            <!-- 關閉按鈕 -->
            <button
              type="button"
              class="absolute right-[-7px] top-[-40px] z-10 grid size-[30px] place-items-center rounded-full bg-vconf-white text-vconf-purple md:right-[-35px] md:top-[-35px] md:size-10"
              aria-label="關閉成員介紹"
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

            <div
              v-if="member"
              class="max-h-[80svh] overflow-y-auto overscroll-contain rounded-[24px] bg-vconf-white p-5 font-serif scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:max-h-[710px] md:scrollbar-w-scrollbar-md"
              data-lenis-prevent
            >
              <div class="flex flex-col gap-6 md:flex-row md:gap-8">
                <!-- 成員照片：手機用 149×149 圓形、桌機用 333×506 直式 -->
                <aside
                  class="mx-auto shrink-0 md:mx-0"
                  aria-label="成員照片"
                >
                  <template v-if="teamPhoto(member, 'avatar')">
                    <NuxtImg
                      :src="teamPhoto(member, 'popupMobile')"
                      :alt="`${member.name}（${member.jobTitle}）照片`"
                      width="149"
                      height="149"
                      loading="lazy"
                      format="avif,webp"
                      densities="x1 x2"
                      class="block size-[149px] rounded-full object-cover md:hidden"
                    />
                    <NuxtImg
                      :src="teamPhoto(member, 'popup')"
                      :alt="`${member.name}（${member.jobTitle}）照片`"
                      width="333"
                      height="506"
                      loading="lazy"
                      format="avif,webp"
                      densities="x1 x2"
                      class="hidden h-[506px] w-[333px] rounded-[12px] object-cover object-top md:block"
                    />
                  </template>
                  <!-- 尚未提供照片：以名稱首字遞補，維持版型 -->
                  <div
                    v-else
                    aria-hidden="true"
                    class="grid size-[149px] place-items-center rounded-full bg-vconf-gray-ultralight text-[48px] font-bold text-vconf-gray-light md:size-auto md:h-[506px] md:w-[333px] md:rounded-[12px] md:text-[96px]"
                  >
                    {{ member.name.charAt(0) }}
                  </div>
                </aside>

                <!-- 成員資訊 -->
                <div class="flex min-w-0 flex-1 flex-col">
                  <header class="mb-4 md:mb-6">
                    <h2
                      id="team-member-title"
                      class="mb-2 flex items-center md:mb-4"
                    >
                      <span
                        class="pr-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pr-4 md:text-[32px] md:tracking-[0em]"
                      >{</span>
                      <span
                        class="font-serif text-[20px] font-bold leading-[1.2] text-vconf-primary md:text-[48px]"
                      >{{ member.name }}</span>
                      <span
                        class="pl-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pl-4 md:text-[32px] md:tracking-[0em]"
                      >}</span>
                    </h2>

                    <div
                      class="text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-text-read"
                    >
                      <p>{{ member.jobTitle }}</p>
                      <p
                        v-if="member.company"
                        class="text-vconf-gray-light"
                      >
                        {{ member.company }}
                      </p>
                    </div>
                  </header>

                  <SpeakerProfileSection
                    v-if="member.bio"
                    label="自我介紹"
                  >
                    <p
                      class="whitespace-pre-line font-serif text-[16px] font-demi-light leading-[1.6] tracking-[0.01em] text-black"
                    >
                      {{ member.bio }}
                    </p>
                  </SpeakerProfileSection>

                  <ul
                    v-if="socialLinks.length"
                    class="mt-6 flex items-center justify-end gap-4 md:mt-auto md:pt-6"
                  >
                    <li
                      v-for="link in socialLinks"
                      :key="link.key"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.team-member-modal-enter-active,
.team-member-modal-leave-active {
  transition: opacity 0.3s ease;
}

.team-member-modal-enter-from,
.team-member-modal-leave-to {
  opacity: 0;
}
</style>
