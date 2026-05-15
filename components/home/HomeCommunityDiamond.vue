<script setup lang="ts">
const props = withDefaults(defineProps<{
  iconCount?: number
}>(), {
  iconCount: 1200,
})

const accentIndices = new Set([118, 462, 975])

function getIconSrc(accent = false) {
  if (accent)
    return '/home/vue-icon.svg'

  return '/home/vite-icon.svg'
}

// Grid is always 40 cols in a fixed 1200px container — shape never changes with viewport.
// Smaller screens see a cropped portion via section overflow-hidden.
const COLS = 40
const ROWS = computed(() => Math.ceil(props.iconCount / COLS))

const OUTER_RX = 1.1
const OUTER_RY = 1.2
const INNER_RX = 0.72
const INNER_RY = 0.7

const gridCells = computed(() => {
  const rows = ROWS.value
  const cells: { key: string, show: boolean, accent: boolean }[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      const nx = (c - (COLS - 1) / 2) / ((COLS - 1) / 2)
      const ny = (r - (rows - 1) / 2) / ((rows - 1) / 2)

      const inOuter = (nx / OUTER_RX) ** 2 + (ny / OUTER_RY) ** 2 <= 1
      const inInner = (nx / INNER_RX) ** 2 + (ny / INNER_RY) ** 2 <= 1
      const inRing = inOuter && !inInner

      cells.push({
        key: `${r}-${c}`,
        show: inRing,
        accent: inRing && accentIndices.has(r * COLS + c),
      })
    }
  }
  return cells
})
</script>

<template>
  <section class="relative overflow-hidden py-10">
    <div class="relative mx-auto min-h-[520px] w-full">
      <div
        class="absolute left-1/2 top-0 w-[1200px] -translate-x-1/2"
      >
        <div class="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-x-[6px] gap-y-[10px]">
          <template
            v-for="cell in gridCells"
            :key="cell.key"
          >
            <img
              v-if="cell.show"
              :src="getIconSrc(cell.accent)"
              alt=""
              aria-hidden="true"
              class="mx-auto h-[12px] w-[12px]"
              style="filter: saturate(1.05); opacity: 0.95"
            />
            <span
              v-else
              aria-hidden="true"
              class="mx-auto block h-[12px] w-[12px]"
            ></span>
          </template>
        </div>
      </div>

      <!-- 內容區塊 -->
      <div class="pointer-events-none absolute inset-0 grid place-items-center px-4">
        <div class="w-full max-w-[760px] rounded-[44px] bg-white/[0.9] px-6 py-10 text-center backdrop-blur-[1px] dark:bg-slate-950/[0.72] md:px-14 md:py-16">
          <div class="mx-auto max-w-[560px]">
            <p class="text-[13px] font-semibold uppercase tracking-[0.32em] text-emerald-500/85">
              Connect The Community
            </p>
            <h2 class="mt-4 text-[28px] font-bold leading-tight text-slate-800 dark:text-slate-50 md:text-[42px]">
              連結社群 啟發未來
            </h2>
            <p class="mx-auto mt-5 max-w-[520px] text-sm leading-7 text-slate-500 dark:text-slate-300/90 md:text-base">
              以 Vue 與 Vite 為核心，串起開發者、設計師與產品團隊的交流現場。
              這裡保留足夠的留白，讓一段清楚的訊息成為視覺中心。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
