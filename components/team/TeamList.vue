<script setup lang="ts">
interface TeamMember {
  name: string
  role: string
  avatar: string
  avatarAlt: string
}

interface TeamGroup {
  title: string
  members: TeamMember[]
}

const placeholderAvatar
  = 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

function createMembers(count: number, role: string): TeamMember[] {
  return Array.from({ length: count }, () => ({
    name: 'Alex',
    role,
    avatar: placeholderAvatar,
    avatarAlt: `Alex（${role}）頭像`,
  }))
}

const teamGroups: TeamGroup[] = [
  { title: '總召組', members: createMembers(1, '總召') },
  { title: '議程組', members: createMembers(6, '組員') },
  { title: '行銷組', members: createMembers(4, '組員') },
  { title: '開發組', members: createMembers(3, '組員') },
  { title: '設計組', members: createMembers(2, '組員') },
]
</script>

<template>
  <div class="mx-auto max-w-[1032px] px-6">
    <section
      v-for="group in teamGroups"
      :key="group.title"
      class="mb-[64px] flex flex-col items-center last:mb-0"
    >
      <!-- 群組標題 -->
      <h2 class="mb-8 flex items-center justify-center font-serif font-bold">
        <span
          class="pr-1 text-[16px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:pr-4 md:text-[32px]"
        >(</span>
        <span
          class="text-[32px] leading-[auto] tracking-[0.01em] text-vconf-primary md:text-[48px] md:tracking-[0em]"
        >{{ group.title }}</span>
        <span
          class="pl-1 text-[16px] font-bold leading-[auto] tracking-[0em] text-vconf-gray-light md:pl-4 md:text-[32px]"
        >)</span>
      </h2>
      <!-- 成員 -->
      <div
        class="flex flex-wrap justify-center gap-x-[12px] gap-y-[24px] md:gap-x-[45px]"
      >
        <div
          v-for="(member, index) in group.members"
          :key="index"
          class="flex flex-col items-center"
        >
          <!-- 頭像 -->
          <NuxtImg
            :src="member.avatar"
            :alt="member.avatarAlt"
            width="211"
            height="211"
            loading="lazy"
            class="mb-[10px] aspect-square max-w-[171px] rounded-[72px] border border-vconf-gray-light object-cover md:max-w-[211px] md:rounded-[80px]"
          />
          <!-- 成員名稱 -->
          <p class="mb-4 flex items-center justify-center font-serif">
            <span
              class="pr-1 text-[17px] font-medium leading-[1] tracking-[0.02em] text-vconf-gray-light md:tracking-[0em]"
            >(</span>
            <span
              class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-primary"
            >{{ member.name }}</span>
            <span
              class="pl-1 text-[17px] font-bold leading-[1] tracking-[0.02em] text-vconf-gray-light md:tracking-[0em]"
            >)</span>
          </p>
          <!-- 職稱 -->
          <p
            class="font-serif font-bold leading-[1.6] tracking-[0.02em] text-vconf-text-read"
          >
            {{ member.role }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
