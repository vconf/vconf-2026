<script lang="ts" setup>
const NAV_ITEMS = [
  {
    name: 'Concept',
    href: '/about',
  },
  {
    name: 'Rules',
    href: '#',
  },
  {
    name: 'Sponsors',
    href: '#',
  },
  {
    name: 'Contact',
    href: '#',
  },
]
</script>

<template>
  <header>
    <nav class="flex py-6 pl-16 pr-8">
      <NuxtLink
        class="grid place-content-center"
        to="#"
      >
        <NuxtImg
          src="/home/logo.svg"
          height="26"
          width="150"
          loading="eager"
          placeholder
        />
      </NuxtLink>

      <ul class="ml-auto flex text-vconf-text-muted">
        <li
          v-for="NAV_ITEM in NAV_ITEMS"
          :key="NAV_ITEM.href"
          class="relative after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-4/5 after:origin-right after:-translate-x-1/2 after:scale-x-0 after:bg-vconf-black after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
        >
          <NuxtLink
            :to="NAV_ITEM.href"
            class="inline-block px-8 py-[10px] text-[24px] leading-[1.333]"
          >
            {{ NAV_ITEM.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
}
</style>
