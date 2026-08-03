import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    speakers: defineCollection({
      type: 'page',
      source: 'speakers/*.md',
      schema: z.object({
        speakerId: z.string(),
        name: z.string(),
        slug: z.string(),
        company: z.string(),
        jobTitle: z.string(),
        avatar: z.string(),
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
