<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import TeamMemberModal from '~/components/team/TeamMemberModal.vue'
import { earlyBirdCta } from '~/config/cta.config'
import { findTeamMember } from '~/config/team'

const route = useRoute()
const lenis = useLenis()
const memberSlug = computed(() => {
  const value = route.params.member

  return Array.isArray(value) ? value[0] : value
})
const { data: members } = await useTeamMembers()
const activeMember = computed(() =>
  memberSlug.value
    ? (findTeamMember(members.value, memberSlug.value) ?? null)
    : null,
)
const { registerTeamModalImages, preloadTeamModal } = useTeamImages()

// 彈窗是 v-if 開啟、SSR 不渲染，這裡主動註冊讓 prerender 產出靜態圖檔
if (import.meta.server)
  registerTeamModalImages(members.value ?? [])

function backToList() {
  return navigateTo('/team', { replace: true })
}

if (memberSlug.value && !activeMember.value)
  await backToList()

useTeamMemberSeo(activeMember, {
  fallbackTitle: '籌備團隊',
})

const visible = ref(false)
const closeRequested = ref(false)
let isScrollLockedByModal = false
let openRequest = 0

function lockBackgroundScroll() {
  lenis.stop()
  isScrollLockedByModal = true
}

function unlockBackgroundScroll() {
  if (!isScrollLockedByModal)
    return

  lenis.start()
  isScrollLockedByModal = false
}

async function open() {
  const request = ++openRequest
  const member = activeMember.value

  if (!member)
    return

  closeRequested.value = false
  lockBackgroundScroll()

  await preloadTeamModal(member, 'high')

  if (request !== openRequest || activeMember.value !== member)
    return

  visible.value = true
}

onMounted(() => {
  if (!memberSlug.value)
    return

  if (activeMember.value)
    void open()
  else backToList()
})

watch(memberSlug, (value) => {
  if (value) {
    if (activeMember.value)
      void open()
    else backToList()

    return
  }

  openRequest++

  // 彈窗沒開就沒有鎖過捲動（例如剛從不存在的成員退回列表），不需要收尾
  if (!visible.value)
    return unlockBackgroundScroll()

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
  openRequest++
  visible.value = false
}

async function afterLeave() {
  if (closeRequested.value && memberSlug.value)
    await backToList()

  closeRequested.value = false
  unlockBackgroundScroll()
}

onKeyStroke('Escape', close)
onBeforeUnmount(unlockBackgroundScroll)
</script>

<template>
  <main>
    <ShareHero title="Staff" />
    <TeamStaffIntro />
    <TeamList />
    <TeamMemberModal
      :visible="visible"
      :member="activeMember"
      @close="close"
      @after-leave="afterLeave"
    />
    <ShareFloatingCta
      :text="earlyBirdCta.text"
      :href="earlyBirdCta.url"
    />
  </main>
</template>
