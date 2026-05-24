<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme(theme: 'dark' | 'light') {
  colorMode.preference = theme
}
</script>

<template>
  <div class="absolute hidden w-fit flex-col gap-2 rounded-full bg-vconf-theme-toggle-bg px-2 py-3 lg:flex">
    <button
      type="button"
      class="grid size-[39px] place-content-center rounded-full border border-vconf-sun bg-vconf-sun-background text-vconf-sun"
      aria-label="Switch to light mode"
      @click="toggleTheme('light')"
    >
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7107 18.895C15.0299 18.895 17.7207 16.2042 17.7207 12.885C17.7207 9.56577 15.0299 6.875 11.7107 6.875C8.39145 6.875 5.70068 9.56577 5.70068 12.885C5.70068 16.2042 8.39145 18.895 11.7107 18.895Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M12.8157 1.105C12.8157 0.494725 12.321 0 11.7107 0C11.1004 0 10.6057 0.494725 10.6057 1.105V4.23C10.6057 4.84027 11.1004 5.335 11.7107 5.335C12.321 5.335 12.8157 4.84027 12.8157 4.23V1.105Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M12.8157 21.54C12.8157 20.9297 12.321 20.435 11.7107 20.435C11.1004 20.435 10.6057 20.9297 10.6057 21.54V24.665C10.6057 25.2753 11.1004 25.77 11.7107 25.77C12.321 25.77 12.8157 25.2753 12.8157 24.665V21.54Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M2.0655 6.03513C1.53698 5.72999 0.861177 5.91107 0.55604 6.43959C0.250903 6.9681 0.431985 7.64391 0.960498 7.94905L3.66683 9.51155C4.19534 9.81668 4.87115 9.6356 5.17629 9.10709C5.48142 8.57857 5.30034 7.90277 4.77183 7.59763L2.0655 6.03513Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M19.7595 16.2533C19.231 15.9482 18.5551 16.1293 18.25 16.6578C17.9449 17.1863 18.126 17.8621 18.6545 18.1672L21.3608 19.7297C21.8893 20.0349 22.5651 19.8538 22.8703 19.3253C23.1754 18.7968 22.9943 18.121 22.4658 17.8158L19.7595 16.2533Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M0.956939 17.8176C0.428426 18.1228 0.247343 18.7986 0.55248 19.3271C0.857618 19.8556 1.53343 20.0367 2.06194 19.7316L4.76827 18.1691C5.29678 17.8639 5.47786 17.1881 5.17273 16.6596C4.86759 16.1311 4.19178 15.95 3.66327 16.2551L0.956939 17.8176Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
        <path
          d="M18.658 7.60078C18.1295 7.90592 17.9484 8.58173 18.2535 9.11024C18.5587 9.63875 19.2345 9.81984 19.763 9.5147L22.4693 7.9522C22.9978 7.64706 23.1789 6.97125 22.8738 6.44274C22.5686 5.91423 21.8928 5.73315 21.3643 6.03828L18.658 7.60078Z"
          fill="currentColor"
          fill-opacity="0.5"
        />
      </svg>
    </button>
    <button
      type="button"
      class="grid size-[39px] place-content-center rounded-full border-[0.5px] border-vconf-moon-border bg-vconf-moon-background text-vconf-moon"
      aria-label="Switch to dark mode"
      @click="toggleTheme('dark')"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.015 18.095C8.925 18.095 3.99 13.16 3.99 7.07C3.99 4.38 4.955 1.915 6.555 0C2.685 1.815 0 5.74 0 10.3C0 16.58 5.09 21.67 11.37 21.67C15.435 21.67 19 19.535 21.01 16.33C19.285 17.45 17.23 18.1 15.02 18.1L15.015 18.095Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
</template>
