<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import AgendaTalkModal from '~/components/agenda/AgendaTalkModal.vue'

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

    <AgendaTalkModal
      :visible="visible"
      :talk="talk"
      :talk-id="talkId"
      @close="close"
      @after-leave="afterLeave"
    />
  </main>
</template>
