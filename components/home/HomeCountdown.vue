<script setup lang="ts">
const TARGET_DATE = new Date('2026-10-17T09:30:00+08:00')

interface CountdownState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

const countdown = ref<CountdownState>({
  days: '000',
  hours: '00',
  minutes: '00',
  seconds: '00',
})

let rafId: number | null = null
let lastRenderedSecond: number | null = null

function pad(value: number, length: number) {
  return String(Math.max(value, 0)).padStart(length, '0')
}

function getCountdownState() {
  const now = new Date()
  const diff = Math.max(TARGET_DATE.getTime() - now.getTime(), 0)

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    days: pad(days, 3),
    hours: pad(hours, 2),
    minutes: pad(minutes, 2),
    seconds: pad(seconds, 2),
  }
}

function updateCountdown(totalSeconds?: number) {
  const nextState = getCountdownState()

  countdown.value = nextState
  lastRenderedSecond
    = totalSeconds
      ?? Math.floor(Math.max(TARGET_DATE.getTime() - Date.now(), 0) / 1000)
}

function tickCountdown() {
  const remainingSeconds = Math.floor(
    Math.max(TARGET_DATE.getTime() - Date.now(), 0) / 1000,
  )

  if (remainingSeconds !== lastRenderedSecond)
    updateCountdown(remainingSeconds)

  if (remainingSeconds > 0)
    rafId = requestAnimationFrame(tickCountdown)
}

onMounted(() => {
  updateCountdown()
  rafId = requestAnimationFrame(tickCountdown)
})

onBeforeUnmount(() => {
  if (rafId !== null)
    cancelAnimationFrame(rafId)
})

const segments = computed(() => [
  { key: 'Days', label: 'Days', value: countdown.value.days },
  { key: 'Hours', label: 'Hours', value: countdown.value.hours },
  { key: 'Minutes', label: 'Minutes', value: countdown.value.minutes },
  { key: 'Seconds', label: 'Seconds', value: countdown.value.seconds },
])
</script>

<template>
  <section class="pt-[200px] text-center md:pt-[250px]">
    <div class="container">
      <div class="mx-auto flex w-fit flex-col items-center">
        <!-- 上方 vite 裝飾物 -->
        <NuxtImg
          src="/home/homeCountdown-top.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="722"
          height="96"
          format="avif,webp"
          densities="x1 x2"
          class="mb-5 hidden md:mb-10 md:block"
        />
        <NuxtImg
          src="/home/homeCountdown-top-small.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="361"
          height="49"
          format="avif,webp"
          densities="x1 x2"
          class="mb-3 block md:mb-10 md:hidden"
        />

        <h2
          class="mb-4 font-serif text-[32px] font-bold tracking-[0%] text-vconf-heading md:mb-8 md:text-[64px]"
        >
          Oct 17 2026
        </h2>
        <p
          class="mb-4 font-serif text-[16px] font-bold tracking-[1%] text-vconf-heading md:mb-8 md:text-[32px]"
        >
          即將，VUE 見未來
        </p>
        <div class="flex items-center gap-[20px] md:gap-[75px]">
          <div
            v-for="segment in segments"
            :key="segment.key"
            class="countdown-item relative text-center font-avenir"
          >
            <div
              class="countdown-number-frame relative inline-block overflow-hidden pb-[21px] text-[50px] font-black leading-[1] tracking-[2%] text-vconf-primary md:pb-[37px] md:text-[100px]"
              :data-value="segment.value"
            >
              <p class="countdown-number">
                {{ segment.value }}
              </p>
            </div>
            <p
              class="text-[13px] font-medium tracking-[0%] text-vconf-primary md:text-[24px]"
            >
              {{ segment.label }}
            </p>
          </div>
        </div>

        <!-- 下方 vite 裝飾物 -->
        <NuxtImg
          src="/home/homeCountdown-bottom.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="722"
          height="96"
          format="avif,webp"
          densities="x1 x2"
          class="mt-5 hidden md:mt-10 md:block"
        />
        <NuxtImg
          src="/home/homeCountdown-bottom-small.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="361"
          height="61"
          format="avif,webp"
          densities="x1 x2"
          class="mt-3 block md:mt-10 md:hidden"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-number-frame::after {
  content: attr(data-value);
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  height: 50%;
  transform: scaleY(-0.74);
  transform-origin: top center;
  color: hsl(var(--color-primary));
  opacity: 0.35;
  overflow: hidden;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.45) 55%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.45) 55%,
    transparent 100%
  );
  pointer-events: none;
}

.countdown-number-frame,
.countdown-number {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

.countdown-item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 12px;
  right: -13px;
  width: 5.5px;
  height: 5.5px;
  border-radius: 9999px;
  background: hsl(var(--color-purple));
  box-shadow: 0 21px 0 0 hsl(var(--color-purple));
}

@media (min-width: 768px) {
  .countdown-item:not(:last-child)::after {
    top: 24px;
    right: -44px;
    width: 11px;
    height: 11px;
    box-shadow: 0 42px 0 0 hsl(var(--color-purple));
  }
}
</style>
