<script setup lang="ts">
const colorMode = useColorMode()

const currentMode = computed(() =>
  colorMode.value === 'dark' ? 'dark' : 'light',
)

function toggleTheme() {
  colorMode.preference = currentMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <main class="h-[200vh] bg-[hsl(var(--background))] px-6 py-16 text-[hsl(var(--foreground))]">
    <div class="mx-auto flex max-w-3xl items-center justify-between gap-6 rounded-2xl border border-[hsl(var(--border))] p-6">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-vconf-text-muted">
          Theme Mode
        </p>
        <h1 class="mt-2 text-3xl font-semibold">
          About
        </h1>
        <p class="mt-3 text-base text-vconf-text-muted">
          目前使用的是 {{ currentMode }} mode，透過 <code>useColorMode()</code> 切換全域主題。
        </p>
      </div>

      <button
        type="button"
        class="rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-medium text-vconf-primary transition-colors hover:bg-vconf-primary hover:text-[hsl(var(--background))]"
        @click="toggleTheme"
      >
        切換成 {{ currentMode === 'dark' ? 'light' : 'dark' }}
      </button>
    </div>
  </main>
</template>
