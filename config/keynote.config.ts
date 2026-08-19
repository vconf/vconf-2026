/**
 * 神秘 keynote（Talk 1）對外可見的資料。
 */
export const mysteryKeynote = {
  talkNumber: 1,
  name: '???',
  jobTitle: 'Keynote Speaker',
  topic: '???',
  startTime: '09:30',
  endTime: '10:15',
} as const

export type MysteryKeynote = typeof mysteryKeynote
