<script setup lang="ts">
import type { TeamMember } from '~/config/team'
import { useMediaQuery } from '@vueuse/core'
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
const isDesktop = useMediaQuery('(min-width: 768px)')

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
          class="grid size-full grid-rows-[minmax(0,1fr)] place-items-center items-start overflow-hidden overscroll-contain px-6 pb-6 pt-[51px] md:items-center md:px-[44px] md:py-0"
          data-lenis-prevent
          @click.self="emit('close')"
        >
          <div
            class="relative mx-auto flex size-full max-w-[1032px] flex-col md:h-auto md:max-h-[min(85svh,710px)]"
          >
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
              class="relative flex size-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-vconf-white font-serif"
            >
              <div
                class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 scrollbar scrollbar-thumb-vconf-scrollbar scrollbar-w-scrollbar md:px-8 md:pb-[37px] md:pt-8 md:scrollbar-w-scrollbar-md"
                data-lenis-prevent
              >
                <div
                  class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 md:grid-rows-[auto_1fr_auto] md:items-start md:gap-x-8 md:gap-y-0"
                >
                  <!-- 成員照片 -->
                  <div
                    class="md:row-span-3"
                    aria-label="成員照片"
                  >
                    <template v-if="teamPhoto(member, 'avatar')">
                      <NuxtImg
                        v-if="!isDesktop"
                        :src="teamPhoto(member, 'popupMobile')"
                        :alt="`${member.name}（${member.jobTitle}）照片`"
                        width="149"
                        height="149"
                        loading="eager"
                        format="avif,webp"
                        densities="x1 x2"
                        class="block size-[149px] rounded-[42%] object-cover"
                      />
                      <NuxtImg
                        v-else
                        :src="teamPhoto(member, 'popup')"
                        :alt="`${member.name}（${member.jobTitle}）照片`"
                        width="333"
                        height="506"
                        loading="eager"
                        format="avif,webp"
                        densities="x1 x2"
                        class="h-[506px] w-[333px] rounded-[12px] object-cover"
                      />
                    </template>
                    <!-- 尚未提供照片：以名稱首字遞補，維持版型 -->
                    <div
                      v-else
                      aria-hidden="true"
                      class="grid size-[149px] place-items-center rounded-[42%] bg-vconf-gray-ultralight text-[48px] font-bold text-vconf-gray-light md:size-auto md:h-[506px] md:w-[333px] md:rounded-[12px] md:text-[96px]"
                    >
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                  <!-- 姓名與職稱 -->
                  <header class="md:col-start-2 md:row-start-1 md:mb-6">
                    <h2
                      id="team-member-title"
                      class="mb-2 flex items-center md:mb-4"
                    >
                      <span
                        class="pr-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pr-4 md:text-[32px]"
                      >{</span>
                      <span
                        class="font-serif text-[20px] font-bold leading-[1.2] tracking-[0em] text-vconf-primary md:text-[48px]"
                      >{{ member.name }}</span>
                      <span
                        class="pl-2 font-sans text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:pl-4 md:text-[32px]"
                      >}</span>
                    </h2>

                    <div
                      class="text-[16px] font-demi-light leading-[1.6] tracking-[0em] text-vconf-text-read"
                    >
                      <p class="md:mb-1">
                        {{ member.jobTitle }}
                      </p>
                      <p v-if="member.company">
                        {{ member.company }}
                      </p>
                    </div>
                  </header>

                  <!-- 社群連結 -->
                  <ul
                    v-if="socialLinks.length"
                    class="col-span-2 flex items-center justify-end gap-4 md:col-span-1 md:col-start-2 md:row-start-3 md:pt-6"
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

                  <SpeakerProfileSection
                    v-if="member.bio"
                    label="自我介紹"
                    class="col-span-2 md:col-span-1 md:col-start-2 md:row-start-2"
                  >
                    <p
                      class="whitespace-pre-line font-serif font-light leading-[1.5] tracking-[0.02em] text-black"
                    >
                      {{ member.bio }}
                    </p>
                  </SpeakerProfileSection>
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
