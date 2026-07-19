<script setup lang="ts">
interface Sponsor {
  name: string
  logo: string
  logoAlt: string
  description?: string
}

interface SponsorTier {
  title: string
  columns: 2 | 3 | 5
  /** 只顯示 logo，不顯示贊助商名稱 */
  logoOnly?: boolean
  sponsors: Sponsor[]
}

const placeholderLogo = '/sponsors/hexschool.svg'

const placeholderDescription
  = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it.'

const hexschoolSponsor: Sponsor = {
  name: 'Hexschool',
  logo: placeholderLogo,
  logoAlt: 'Hexschool logo',
}

const sponsorTiers: SponsorTier[] = [
  {
    title: '10x Sponsor',
    columns: 2,
    sponsors: Array.from({ length: 2 }, () => ({
      name: 'Google Inc',
      logo: placeholderLogo,
      logoAlt: 'Google Inc logo',
      description: placeholderDescription,
    })),
  },
  {
    title: '5x Sponsor',
    columns: 3,
    logoOnly: true,
    sponsors: Array.from({ length: 3 }, () => ({ ...hexschoolSponsor })),
  },
  {
    title: '3x Sponsor',
    columns: 3,
    logoOnly: true,
    sponsors: Array.from({ length: 5 }, () => ({ ...hexschoolSponsor })),
  },
  {
    title: '1x Sponsor',
    columns: 5,
    logoOnly: true,
    sponsors: Array.from({ length: 10 }, () => ({ ...hexschoolSponsor })),
  },
]

const cardWidthClass: Record<SponsorTier['columns'], string> = {
  2: 'w-[calc((100%-23px)/2)]',
  3: 'w-[calc((100%-46px)/3)]',
  5: 'w-[calc((100%-92px)/5)]',
}
</script>

<template>
  <div class="mx-auto max-w-[1032px] px-6">
    <section
      v-for="tier in sponsorTiers"
      :key="tier.title"
      class="mb-[88px]"
    >
      <!-- 標題 -->
      <h2 class="mb-6 flex items-center justify-center font-serif font-bold">
        <span
          class="pr-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light"
        >(</span>
        <span
          class="text-[48px] font-bold leading-[auto] tracking-[0em] text-vconf-primary"
        >{{ tier.title }}</span>
        <span
          class="pl-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light"
        >)</span>
      </h2>
      <!-- 贊助商區塊 -->
      <div class="flex flex-wrap justify-center gap-[23px]">
        <div
          v-for="(sponsor, index) in tier.sponsors"
          :key="index"
          :class="cardWidthClass[tier.columns]"
        >
          <div
            class="mb-4 flex aspect-square items-center justify-center border border-vconf-gray-exlight"
          >
            <NuxtImg
              :src="sponsor.logo"
              :alt="sponsor.logoAlt"
              width="228"
              height="141"
              loading="lazy"
              class="h-auto w-4/5"
            />
          </div>
          <h3
            v-if="!tier.logoOnly"
            class="mb-4 text-center font-serif text-[24px] leading-[1.2] tracking-[0em] text-vconf-text-read"
          >
            {{ sponsor.name }}
          </h3>
          <p
            v-if="sponsor.description"
            class="font-serif font-semibold leading-[1.6] tracking-[0em]"
          >
            {{ sponsor.description }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
