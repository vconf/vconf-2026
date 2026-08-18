<script lang="ts" setup>
import { onKeyStroke, useBreakpoints, useWindowScroll } from '@vueuse/core'

const NAV_ITEMS = [
  {
    name: '關於 VCONF 台灣',
    href: '/about',
  },
  {
    name: '議程',
    href: '/agenda',
  },
  {
    name: '講者',
    href: '/speakers',
  },
  {
    name: '贊助',
    href: '/sponsors',
    mdHidden: true,
  },
  {
    name: '成員',
    href: '/team',
    mdHidden: true,
  },
  {
    name: '花絮',
    href: '/recap',
    mdHidden: true,
  },
]
const lenis = useLenis()
const route = useRoute()
const isMenuOpen = ref(false)

const headerBgClass = computed(() =>
  isMenuOpen.value ? 'bg-vconf-white' : 'bg-transparent',
)

const { y: scrollY } = useWindowScroll()
const isGlass = computed(() => scrollY.value > 10 && !isMenuOpen.value)

const breakpoints = useBreakpoints({ lg: 1024 })
const isLg = breakpoints.greaterOrEqual('lg')

function closeMenu() {
  isMenuOpen.value = false
}

function isNavItemActive(href: string) {
  return route.path === href || route.path.startsWith(`${href}/`)
}

function navItemClass(item: { href: string, mdHidden?: boolean }) {
  return [
    isNavItemActive(item.href)
      ? 'after:origin-left lg:after:scale-x-100'
      : 'after:origin-right',
    item.mdHidden && !isMenuOpen.value ? 'md:hidden lg:block' : '',
  ]
}

// 選單開合是背景捲動鎖定的唯一來源，各 handler 只改狀態、不各自呼叫 lenis
watch(isMenuOpen, (open) => {
  if (open)
    lenis.stop()
  else lenis.start()
})

// 換頁、以及放大到 lg（改由桌機版排版接手）都要收掉殘留的展開狀態
watch(() => route.fullPath, closeMenu)
watch(isLg, (lg) => {
  if (lg)
    closeMenu()
})

// 全螢幕選單在視覺上等同彈窗，鍵盤使用者要能直接按 Esc 離開
onKeyStroke('Escape', closeMenu)
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-[backdrop-filter] duration-300"
    :class="isGlass ? 'bg-white/20 backdrop-blur-[5px]' : headerBgClass"
  >
    <div class="container">
      <nav
        class="relative flex items-center px-6 py-4 md:py-6 md:pl-[34px] md:pr-4 lg:pl-16 lg:pr-8"
      >
        <!-- logo 顯示使用 -->
        <NuxtLink
          class="grid place-content-center md:py-2.5 lg:py-0"
          to="/"
          aria-label="回到 v-conf Taiwan 2026 首頁"
          @click="closeMenu()"
        >
          <NuxtImg
            src="/share/nav-logo-md.svg"
            alt=""
            aria-hidden="true"
            height="38"
            width="220"
            loading="eager"
            class="hidden md:block"
          />
          <NuxtImg
            src="/share/nav-logo-sm.svg"
            alt=""
            aria-hidden="true"
            height="19"
            width="110"
            loading="eager"
            class="md:hidden"
          />
        </NuxtLink>

        <!-- 導覽列項目 -->
        <ul
          id="nav-menu"
          class="nav-menu z-40 ml-auto gap-8 px-6 font-serif text-vconf-text-muted"
          :class="[
            isMenuOpen
              ? 'active fixed left-0 top-[57px] flex h-[calc(100svh-57px)] w-full flex-col bg-vconf-white'
              : 'hidden md:flex md:h-auto md:gap-0 md:bg-transparent md:px-0',
          ]"
        >
          <li
            v-for="NAV_ITEM in NAV_ITEMS"
            :key="NAV_ITEM.href"
            class="relative bg-vconf-white text-center after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-4/5 after:-translate-x-1/2 after:scale-x-0 after:bg-vconf-black after:transition-transform after:duration-300 after:content-[''] last:border-b-0 md:border-b-0 md:bg-transparent lg:hover:after:origin-left lg:hover:after:scale-x-100"
            :class="navItemClass(NAV_ITEM)"
            @click="closeMenu()"
          >
            <NuxtLink
              :to="NAV_ITEM.href"
              class="inline-block w-full px-4 py-2.5 text-[22px] leading-[1.5] xl:w-auto xl:px-8"
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
          aria-controls="nav-menu"
          aria-label="切換導覽選單"
          @click="isMenuOpen = !isMenuOpen"
        >
          <div
            :class="
              isMenuOpen
                ? 'bg-transparent before:left-0 before:top-1/2 before:w-[35px] before:-translate-y-1/2 before:-rotate-45 before:bg-vconf-primary after:left-0 after:top-1/2 after:w-[35px] after:-translate-y-1/2 after:rotate-45 after:bg-vconf-primary'
                : 'bg-vconf-primary before:right-0 before:-top-1.5 before:w-[15px] before:bg-vconf-primary after:left-0 after:-bottom-1.5 after:w-[15px] after:bg-vconf-primary'
            "
            class="relative h-px w-[35px] transition-colors duration-300 before:absolute before:h-px before:transition-transform before:duration-300 before:content-[''] after:absolute after:h-px after:transition-transform after:duration-300 after:content-['']"
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
