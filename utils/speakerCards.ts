import type { SpeakersCollectionItem } from '@nuxt/content'
import { mysteryKeynote } from '~/config/keynote.config'

/** 卡片上真正會顯示的欄位；神秘 keynote 只有這些，沒有照片與連結 */
interface SpeakerCardBase {
  key: string
  name: string
  jobTitle: string
  talkNumber: number
  startTime: string
  endTime: string
}

export type SpeakerCard
  = | (SpeakerCardBase & { kind: 'speaker', speaker: SpeakersCollectionItem })
    | (SpeakerCardBase & { kind: 'mystery' })

/**
 * 講者卡片清單。
 * Talk 1 還沒公開時在最前面插一張神秘卡（粒子剪影、不可點）；
 * 正式講者一上線就自動取代，不需要另外切換。
 */
export function createSpeakerCards(
  speakers: SpeakersCollectionItem[],
): SpeakerCard[] {
  const cards: SpeakerCard[] = speakers.map(speaker => ({
    kind: 'speaker',
    key: speaker.id,
    name: speaker.name,
    jobTitle: speaker.jobTitle,
    talkNumber: speaker.talkNumber,
    startTime: speaker.startTime,
    endTime: speaker.endTime,
    speaker,
  }))

  const isKeynotePublished = speakers.some(
    speaker => speaker.talkNumber === mysteryKeynote.talkNumber,
  )

  if (isKeynotePublished)
    return cards

  return [
    {
      kind: 'mystery',
      key: 'mystery-keynote',
      name: mysteryKeynote.name,
      jobTitle: mysteryKeynote.jobTitle,
      talkNumber: mysteryKeynote.talkNumber,
      startTime: mysteryKeynote.startTime,
      endTime: mysteryKeynote.endTime,
    },
    ...cards,
  ]
}
