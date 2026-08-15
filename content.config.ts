import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    speakers: defineCollection({
      type: 'page',
      source: 'speakers/*.md',
      schema: z.object({
        speakerId: z.string(),
        draft: z.boolean().default(false),
        name: z.string(),
        slug: z.string(),
        company: z.string(),
        jobTitle: z.string(),
        /** 預設／桌機講者照（首頁輪播、講者介紹頁、結構化資料） */
        avatar: z.string(),
        /** 手機版講者照（講者介紹頁） */
        avatarMobile: z.string().optional(),
        /** 議程列表圓形頭像 */
        agendaAvatar: z.string().optional(),
        /** 議程彈窗桌機講者照 */
        modalAvatar: z.string().optional(),
        /** 議程彈窗手機圓形頭像 */
        modalAvatarMobile: z.string().optional(),
        /** 講者彈窗桌機講者照（333×560） */
        profileAvatar: z.string().optional(),
        /** 講者彈窗手機講者照（260×370） */
        profileAvatarMobile: z.string().optional(),
        avatarAlt: z.string(),
        speakerInfo: z.string(),
        experiences: z.array(z.string()).default([]),
        links: z
          .array(
            z.object({
              label: z.string(),
              href: z.string(),
              text: z.string(),
            }),
          )
          .default([]),
        talkNumber: z.number().int().positive(),
        talkSlug: z.string(),
        topic: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
      indexes: [
        { columns: ['talkNumber'] },
        { columns: ['talkSlug'], unique: true },
      ],
    }),
  },
})
