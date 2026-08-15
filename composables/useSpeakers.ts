export function useSpeakers() {
  return useAsyncData(
    'all-speakers',
    async () => {
      const speakers = await queryCollection('speakers')
        .order('talkNumber', 'ASC')
        .all()

      return speakers.filter(speaker => !speaker.draft)
    },
    {
      getCachedData: key =>
        useNuxtApp().payload.data[key] ?? useNuxtApp().static.data[key],
    },
  )
}

export function useSpeakerByTalkSlug(
  talkSlug: MaybeRefOrGetter<string | undefined>,
) {
  const speakersAsyncData = useSpeakers()

  const speaker = computed(() => {
    const slug = toValue(talkSlug)

    if (!slug)
      return null

    return (
      speakersAsyncData.data.value?.find(item => item.talkSlug === slug)
      ?? null
    )
  })

  return {
    ...speakersAsyncData,
    speaker,
  }
}
