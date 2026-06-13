<script lang="ts" setup>
import { useBreakpoints } from '@vueuse/core'
import { ref } from 'vue'

const NAV_ITEMS = [
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Agenda',
    href: '/agenda',
  },
  {
    name: 'Speakers',
    href: '/speakers',
  },
  {
    name: 'Sponsors',
    href: '/sponsors',
    mdHidden: true,
  },
  {
    name: 'Team',
    href: '/team',
    mdHidden: true,
  },
  {
    name: 'Recap',
    href: '/recap',
    mdHidden: true,
  },
]

const lenis = useLenis()
const route = useRoute()
const isMenuOpen = ref(false)

const breakpoints = useBreakpoints({ lg: 1024 })
const isLg = breakpoints.greaterOrEqual('lg')

watch(isLg, (lg) => {
  if (lg && isMenuOpen.value) {
    isMenuOpen.value = false
    lenis.start()
  }
})

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

function isNavItemActive(href: string) {
  if (href === '#')
    return false

  return route.path === href || route.path.startsWith(`${href}/`)
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
  <header
    class="top-0 bg-vconf-white"
    :class="{ 'z-50': isMenuOpen }"
  >
    <div class="container">
      <nav class="relative flex items-center px-6 py-4 md:py-6 md:pl-[34px] md:pr-4 lg:pl-16 lg:pr-8">
        <!-- logo 顯示使用 -->
        <NuxtLink
          class="grid place-content-center md:py-[10px] lg:py-0"
          to="/"
          @click="onClickIcon()"
        >
          <NuxtImg
            src="/share/nav-logo-md.svg"
            height="38"
            width="220"
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

        <!-- 導覽列項目 -->
        <ul
          class="nav-menu z-40 ml-auto gap-8 px-6 text-vconf-text-muted"
          :class="[
            isMenuOpen
              ? 'active fixed left-0 top-[57px] flex h-[calc(100svh-57px)] w-full flex-col bg-vconf-white'
              : 'hidden md:flex md:h-auto md:gap-0 md:bg-transparent md:px-0',
          ]"
        >
          <li
            v-for="NAV_ITEM in NAV_ITEMS"
            :key="NAV_ITEM.href"
            class="relative bg-vconf-white text-center after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-4/5 after:-translate-x-1/2 after:bg-vconf-black after:transition-transform after:duration-300 after:content-[''] last:border-b-0 md:border-b-0 md:bg-transparent md:hover:after:origin-left md:hover:after:scale-x-100"
            :class="[
              isNavItemActive(NAV_ITEM.href)
                ? 'after:origin-left after:scale-x-100'
                : 'after:origin-right after:scale-x-0',
              NAV_ITEM.mdHidden && !isMenuOpen ? 'md:hidden lg:block' : '',
            ]"
            @click="onClickNavItem()"
          >
            <NuxtLink

              :to="NAV_ITEM.href"
              class="inline-block w-full px-4 py-[10px] text-[24px] tracking-[0em] xl:w-auto xl:px-8"
            >
              {{ NAV_ITEM.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- 導覽漢堡按鈕 -->
        <button
          type="button"
          class="mr-2 w-[43px] flex-none py-3 pl-3 lg:hidden"
          :class="isMenuOpen ? 'ml-auto' : 'ml-auto md:ml-0'"
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
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-menu.active {
  top: 57px;
  height: calc(100svh - 57px);
}

@media (min-width: 768px) {
  .nav-menu.active {
    top: 104px;
    height: calc(100svh - 104px);
  }
}

@media (min-width: 1024px) {
  .nav-menu.active {
    display: none;
  }
}

.router-link-active {
  font-weight: bold;
}
</style>
