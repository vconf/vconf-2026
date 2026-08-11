<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import SpeakerProfileModal from '~/components/speakers/SpeakerProfileModal.vue'

const route = useRoute()
const lenis = useLenis()
const speakerId = computed(() => {
  const value = route.params.speaker

  return Array.isArray(value) ? value[0] : value
})
const { data: speakers } = await useSpeakers()
const activeSpeaker = computed(
  () =>
    speakers.value?.find(speaker => speaker.talkSlug === speakerId.value)
    ?? null,
)

useSpeakerSeo(activeSpeaker, {
  type: 'speakers',
  fallback: { title: '講者介紹' },
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
  if (speakerId.value)
    open()
})

watch(speakerId, (value) => {
  if (value) {
    open()
    return
  }

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
  if (closeRequested.value && speakerId.value)
    await navigateTo('/speakers/unpublish', { replace: true })

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
      :speaker-id="speakerId"
      @close="close"
      @after-leave="afterLeave"
    />
  </main>
</template>
