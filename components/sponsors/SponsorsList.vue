<script setup lang="ts">
interface Sponsor {
  name: string
  logo: string
  logoAlt: string
  description?: string
}

interface SponsorTier {
  title: string
  /** 容器 gap（手機/桌機） */
  gapClass: string
  /** 卡片寬度，與 gap 成對：calc 扣掉的 px = 該斷點 gap × (每排張數 - 1) */
  cardWidthClass: string
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
    // 手機 1 張/排；桌機 2 張/排、gap 23px
    title: '10x Sponsor',
    gapClass: 'gap-[23px]',
    cardWidthClass: 'md:w-[calc((100%-23px)/2)] w-full',
    sponsors: Array.from({ length: 2 }, () => ({
      name: 'Google Inc',
      logo: placeholderLogo,
      logoAlt: 'Google Inc logo',
      description: placeholderDescription,
    })),
  },
  {
    // 手機 2 張/排、gap 12px；桌機 3 張/排、gap 23px
    title: '5x Sponsor',
    gapClass: 'gap-3 md:gap-[23px]',
    cardWidthClass: 'md:w-[calc((100%-46px)/3)] w-[calc((100%-12px)/2)]',
    logoOnly: true,
    sponsors: Array.from({ length: 3 }, () => ({ ...hexschoolSponsor })),
  },
  {
    // 手機 2 張/排、gap 8px；桌機 3 張/排、gap 23px
    title: '3x Sponsor',
    gapClass: 'gap-2 md:gap-[23px]',
    cardWidthClass: 'md:w-[calc((100%-46px)/3)] w-[calc((100%-8px)/2)]',
    logoOnly: true,
    sponsors: Array.from({ length: 5 }, () => ({ ...hexschoolSponsor })),
  },
  {
    // 手機 3 張/排、gap 8px；桌機 5 張/排、gap 23px
    title: '1x Sponsor',
    gapClass: 'gap-2 md:gap-[23px]',
    cardWidthClass: 'md:w-[calc((100%-92px)/5)] w-[calc((100%-16px)/3)]',
    logoOnly: true,
    sponsors: Array.from({ length: 10 }, () => ({ ...hexschoolSponsor })),
  },
]
</script>

<template>
  <div class="mx-auto max-w-[1032px] px-6">
    <section
      v-for="tier in sponsorTiers"
      :key="tier.title"
      class="mb-[48px] last:mb-0 md:mb-[88px]"
    >
      <!-- 標題 -->
      <h2
        class="mb-4 flex items-center justify-center font-serif font-bold md:mb-6"
      >
        <span
          class="hidden pr-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:block"
        >(</span>
        <span
          class="text-[32px] font-bold leading-[auto] tracking-[0.01em] text-vconf-primary md:text-[48px] md:tracking-[0em]"
        >{{ tier.title }}</span>
        <span
          class="hidden pl-4 text-[32px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:block"
        >)</span>
      </h2>
      <!-- 贊助商區塊 -->
      <div
        class="flex flex-wrap justify-center"
        :class="tier.gapClass"
      >
        <div
          v-for="(sponsor, index) in tier.sponsors"
          :key="index"
          :class="tier.cardWidthClass"
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
            class="mb-4 text-center font-serif text-[18px] leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[24px] md:leading-[1.2] md:tracking-[0em]"
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
