<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import AgendaTalkModal from '~/components/agenda/AgendaTalkModal.vue'
import {
  createAgendaItems,
  findAgendaTalkById,
  isContentSpeaker,
} from '~/utils/agenda'

const route = useRoute()
const lenis = useLenis()
const { data: speakers } = await useSpeakers()
const agendaItems = computed(() => createAgendaItems(speakers.value ?? []))
const { registerAgendaModalImages, preloadAgendaTalk } = useSpeakerImages()
const { reserve: reserveAd } = useAdSlot()

// 彈窗是 v-if 開啟、SSR 不渲染，這裡主動註冊讓 prerender 產出靜態圖檔
if (import.meta.server)
  registerAgendaModalImages(speakers.value ?? [])

const talkId = computed(() => {
  const value = route.params.talk
  return Array.isArray(value) ? value[0] : value
})
const isTalkModalOpen = computed(() => Boolean(talkId.value))
const activeTalk = computed(() =>
  talkId.value ? findAgendaTalkById(agendaItems.value, talkId.value) : null,
)

// 佔位講者沒有 content 資料，只有正式講者才有完整 SEO 來源
const activeSpeaker = computed(() => {
  const speaker = activeTalk.value?.speaker

  return speaker && isContentSpeaker(speaker) ? speaker : null
})

useSpeakerSeo(activeSpeaker, {
  type: 'agenda',
  fallback: { title: '議程資訊' },
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
  const talk = activeTalk.value

  closeRequested.value = false
  lockBackgroundScroll()

  void reserveAd()

  if (talk)
    await preloadAgendaTalk(talk.speaker, 'high')

  if (request !== openRequest || activeTalk.value !== talk)
    return

  visible.value = true
}

onMounted(() => {
  if (isTalkModalOpen.value)
    void open()
})

watch(talkId, (value) => {
  if (value) {
    void open()
    return
  }

  // 瀏覽器返回時，網址會先改變，再由同一個頁面元件淡出彈窗。
  if (!closeRequested.value) {
    openRequest++
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
  if (closeRequested.value && talkId.value)
    await navigateTo('/agenda', { replace: true })

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
      :talk="activeTalk"
      :talk-id="talkId"
      @close="close"
      @after-leave="afterLeave"
    />
  </main>
</template>
