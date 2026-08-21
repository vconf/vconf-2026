<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import SpeakerProfileModal from '~/components/speakers/SpeakerProfileModal.vue'
import { earlyBirdCta } from '~/config/cta.config'

const route = useRoute()
const lenis = useLenis()
const speakerId = computed(() => {
  const value = route.params.speaker

  return Array.isArray(value) ? value[0] : value
})
const { data: speakers } = await useSpeakers()
const { registerModalImages, preloadModalBackground, preloadSpeakerModal }
  = useSpeakerImages()

if (import.meta.server)
  registerModalImages(speakers.value ?? [])

const activeSpeaker = computed(
  () =>
    speakers.value?.find(speaker => speaker.talkSlug === speakerId.value)
    ?? null,
)

function backToList() {
  return navigateTo('/speakers', { replace: true })
}

if (speakerId.value && !activeSpeaker.value)
  await backToList()

useSpeakerSeo(activeSpeaker, {
  type: 'speakers',
  fallback: { title: '講者介紹' },
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
  const speaker = activeSpeaker.value

  if (!speaker)
    return

  closeRequested.value = false
  lockBackgroundScroll()

  await Promise.all([
    preloadModalBackground('high'),
    preloadSpeakerModal(speaker, 'high'),
  ])

  if (request !== openRequest || activeSpeaker.value !== speaker)
    return

  visible.value = true
}

onMounted(() => {
  if (!speakerId.value)
    return

  if (activeSpeaker.value)
    void open()
  else backToList()
})

watch(speakerId, (value) => {
  if (value) {
    if (activeSpeaker.value)
      void open()
    else backToList()

    return
  }

  openRequest++

  // 彈窗沒開就沒有鎖過捲動（例如剛從不存在的講者退回列表），不需要收尾
  if (!visible.value)
    return unlockBackgroundScroll()

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
  if (closeRequested.value && speakerId.value)
    await navigateTo('/speakers', { replace: true })

  closeRequested.value = false
  unlockBackgroundScroll()
}

onKeyStroke('Escape', close)
onBeforeUnmount(unlockBackgroundScroll)
</script>

<template>
  <main>
    <ShareHero title="Speakers" />
    <SpeakersList />
    <SpeakerProfileModal
      :visible="visible"
      :speaker="activeSpeaker"
      @close="close"
      @after-leave="afterLeave"
    />
    <ShareFloatingCta
      :text="earlyBirdCta.text"
      :href="earlyBirdCta.url"
    />
  </main>
</template>
