import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { teamGroupOrder, teamRoles } from './config/team'

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
    team: defineCollection({
      // 自我介紹是單一欄位、彈窗以 pre-line 呈現，不需要 markdown body，用 data collection 就好
      type: 'data',
      source: 'team/*.yml',
      schema: z.object({
        /** 英文 slug，同時是網址（/team/[slug]）與圖檔檔名 */
        slug: z.string(),
        name: z.string(),
        /** 對外常用別名，SEO 標題與 description 會顯示在姓名後方 */
        alias: z.string().optional(),
        /** 全站成員排序，決定各組內的顯示順序（檔名排序不代表版面順序） */
        order: z.number().int().positive(),
        /** 所屬組別與該組內的職務，可跨組（例：總召組組員兼議程組組長） */
        teams: z
          .array(
            z.object({
              name: z.enum(teamGroupOrder),
              role: z.enum(teamRoles),
            }),
          )
          .min(1),
        jobTitle: z.string(),
        company: z.string().optional(),
        /** 自我介紹，供成員彈窗使用；空行分段 */
        bio: z.string().optional(),
        /** 個人頁 meta／社群摘要；未設定時由職務、公司與 bio 自動產生 */
        seoDescription: z.string().optional(),
        links: z
          .object({
            website: z.string().optional(),
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            x: z.string().optional(),
            threads: z.string().optional(),
          })
          .optional(),
        /** 列表圓形頭像（211×211）；未提供照片者留空，畫面上以名稱首字遞補 */
        avatar: z.string().optional(),
        /** 彈窗桌機直式照（333×506） */
        popupAvatar: z.string().optional(),
        /** 彈窗手機圓形頭像（149×149） */
        popupAvatarMobile: z.string().optional(),
      }),
      indexes: [
        { columns: ['order'] },
        { columns: ['slug'], unique: true },
      ],
    }),
  },
})
