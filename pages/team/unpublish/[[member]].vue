<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import TeamMemberModal from '~/components/team/TeamMemberModal.vue'
import { findTeamMember, teamMembers } from '~/config/team'

const route = useRoute()
const lenis = useLenis()
const memberSlug = computed(() => {
  const value = route.params.member

  return Array.isArray(value) ? value[0] : value
})
const activeMember = computed(() =>
  memberSlug.value ? (findTeamMember(memberSlug.value) ?? null) : null,
)

// 彈窗是 v-if 開啟、SSR 不渲染，這裡主動註冊讓 prerender 產出靜態圖檔
if (import.meta.server)
  useTeamImages().registerTeamModalImages(teamMembers)

function backToList() {
  return navigateTo('/team/unpublish', { replace: true })
}

if (memberSlug.value && !activeMember.value)
  await backToList()

useTeamMemberSeo(activeMember, {
  fallbackTitle: '籌備團隊',
  // 籌備團隊頁尚未公開，正式上線時移除並補上 sitemap
  robots: 'noindex, nofollow',
})

const visible = ref(false)
const closeRequested = ref(false)
let isScrollLockedByModal = false

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

function open() {
  closeRequested.value = false
  lockBackgroundScroll()
  visible.value = true
}

onMounted(() => {
  if (!memberSlug.value)
    return

  if (activeMember.value)
    open()
  else backToList()
})

watch(memberSlug, (value) => {
  if (value) {
    if (activeMember.value)
      open()
    else backToList()

    return
  }

  // 彈窗沒開就沒有鎖過捲動（例如剛從不存在的成員退回列表），不需要收尾
  if (!visible.value)
    return

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
  </main>
</template>
