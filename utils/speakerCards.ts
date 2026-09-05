import type { SpeakersCollectionItem } from '@nuxt/content'

/** 卡片上真正會顯示的欄位 */
interface SpeakerCardBase {
  key: string
  name: string
  jobTitle: string
  talkNumber: number
  startTime: string
  endTime: string
}

export type SpeakerCard = SpeakerCardBase & {
  kind: 'speaker'
  speaker: SpeakersCollectionItem
}

/** 講者卡片清單。 */
export function createSpeakerCards(
  speakers: SpeakersCollectionItem[],
): SpeakerCard[] {
  return speakers.map(speaker => ({
    kind: 'speaker',
    key: speaker.id,
    name: speaker.name,
    jobTitle: speaker.jobTitle,
    talkNumber: speaker.talkNumber,
    startTime: speaker.startTime,
    endTime: speaker.endTime,
    speaker,
  }))
}
