<script lang="ts" setup>
import { ref } from 'vue'

const NAV_ITEMS = [
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Agenda',
    href: '#',
  },
  {
    name: 'Speakers',
    href: '#',
  },
  {
    name: 'Sponsors',
    href: '#',
  },
  {
    name: 'Team',
    href: '#',
  },
  {
    name: 'Recap',
    href: '#',
  },
]

const lenis = useLenis()
const route = useRoute()
const isMenuOpen = ref(false)

function onClickIcon() {
  lenis.start()
}

function onToggleMenu() {
  const nextOpen = !isMenuOpen.value
  isMenuOpen.value = !isMenuOpen.value

  if (nextOpen) {
    lenis.stop()
  }
  else {
    lenis.start()
  }
}

function onClickNavItem() {
  if (!isMenuOpen.value)
    return

  isMenuOpen.value = false
  lenis.start()
}

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
    lenis.start()
  },
)
</script>

<template>
  <header class="z-20 bg-vconf-white">
    <div class="container">
      <nav class="relative flex items-center px-6 py-4 md:p-6 md:pl-16 md:pr-8">
        <!-- logo 顯示使用 -->
        <NuxtLink
          class="grid place-content-center"
          to="/"
          @click="onClickIcon()"
        >
          <NuxtImg
            src="/share/nav-logo-md.svg"
            height="26"
            width="150"
            loading="eager"
            placeholder
            class="hidden md:block"
          />
          <NuxtImg
            src="/share/nav-logo-sm.svg"
            height="19"
            width="110"
            loading="eager"
            placeholder
            class="md:hidden"
          />
        </NuxtLink>

        <!-- 導覽漢堡按鈕 -->
        <button
          type="button"
          class="ml-auto md:hidden"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation"
          @click="onToggleMenu()"
        >
          <div
            :class="isMenuOpen
              ? 'bg-transparent before:left-0 before:top-1/2 before:w-[35px] before:-translate-y-1/2 before:-rotate-45 before:bg-vconf-primary after:left-0 after:top-1/2 after:w-[35px] after:-translate-y-1/2 after:rotate-45 after:bg-vconf-primary'
              : 'bg-vconf-primary before:right-0 before:top-[-6px] before:w-[15px] before:bg-vconf-primary after:left-0 after:bottom-[-6px] after:w-[15px] after:bg-vconf-primary'"
            class="relative h-[1px] w-[35px] transition-colors duration-300 before:absolute before:h-[1px] before:content-[''] before:[transition:transform_300ms] after:absolute after:h-[1px] after:content-[''] after:[transition:transform_300ms]"
          ></div>
        </button>

        <!-- 導覽列項目 -->
        <ul
          class="z-20 ml-auto h-[calc(100svh-64px)] gap-8 bg-vconf-white px-6 text-vconf-text-muted md:h-auto md:gap-0 md:bg-transparent md:px-0"
          :class="[
            isMenuOpen
              ? 'absolute left-0 top-[51px] flex h-screen w-full flex-col md:relative md:top-0 md:w-fit md:flex-row'
              : 'hidden md:flex',
          ]"
        >
          <li
            v-for="NAV_ITEM in NAV_ITEMS"
            :key="NAV_ITEM.href"
            class="relative bg-vconf-white text-center after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-4/5 after:-translate-x-1/2 after:bg-vconf-black after:transition-transform after:duration-300 after:content-[''] last:border-b-0 md:border-b-0 md:bg-transparent md:hover:after:origin-left md:hover:after:scale-x-100"
            :class="route.path === NAV_ITEM.href
              ? 'after:origin-left after:scale-x-100'
              : 'after:origin-right after:scale-x-0'"
            @click="onClickNavItem()"
          >
            <NuxtLink

              :to="NAV_ITEM.href"
              class="inline-block w-full p-3 py-[10px] text-[24px] leading-[1.333] md:w-auto md:px-8"
            >
              {{ NAV_ITEM.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
}
</style>
