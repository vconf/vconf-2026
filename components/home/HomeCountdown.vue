<script setup lang="ts">
const TARGET_DATE = new Date(
  Date.now() + (((23 * 24) + 23) * 60 * 60 + 59 * 60 + 59) * 1000,
)

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

let timer: ReturnType<typeof setInterval> | null = null

function pad(value: number, length: number) {
  return String(Math.max(value, 0)).padStart(length, '0')
}

function updateCountdown() {
  const now = new Date()
  const diff = Math.max(TARGET_DATE.getTime() - now.getTime(), 0)

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  countdown.value = {
    days: pad(days, 3),
    hours: pad(hours, 2),
    minutes: pad(minutes, 2),
    seconds: pad(seconds, 2),
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (timer)
    clearInterval(timer)
})

const segments = computed(() => [
  { key: 'days', label: 'days', value: countdown.value.days },
  { key: 'hours', label: 'hours', value: countdown.value.hours },
  { key: 'minutes', label: 'minuts', value: countdown.value.minutes },
  { key: 'seconds', label: 'seconds', value: countdown.value.seconds },
])
</script>

<template>
  <section class="mx-auto w-fit pb-[280px] pt-[279px] text-center">
    <div class="container relative">
      <h2 class="mb-8 font-serif text-[64px] font-bold tracking-[0%] text-vconf-heading">
        Oct 31 2026
      </h2>
      <p class="mb-8 font-serif text-[32px] font-bold tracking-[1%] text-vconf-heading">
        即將，VUE 見未來
      </p>
      <!-- 倒數計時 -->
      <div class="flex items-center gap-[77px]">
        <div
          v-for="segment in segments"
          :key="segment.key"
          class="countdown-item relative text-center font-avenir"
        >
          <div
            class="countdown-number-frame  relative inline-block overflow-hidden pb-[37px] text-[100px] font-black leading-[1] tracking-[2%] text-vconf-primary"
            :data-value="segment.value"
          >
            <p class="countdown-number">
              {{ segment.value }}
            </p>
          </div>
          <p class="text-[24px] font-medium tracking-[0%] text-vconf-primary">
            {{ segment.label }}
          </p>
        </div>
      </div>

      <!-- 上下裝飾背景 -->
      <NuxtImg
        src="/home/homeCountdown-top.png"
        width="722"
        height="130"
        class="absolute left-1/2 top-[-190px] -translate-x-1/2"
      />
      <NuxtImg
        src="/home/homeCountdown-bottom.png"
        width="722"
        height="138"
        class="absolute bottom-[-190px] left-1/2 -translate-x-1/2"
      />
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
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.45) 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.45) 55%, transparent 100%);
  pointer-events: none;
}

.countdown-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -44px;
  width: 11px;
  height: 11px;
  border-radius: 9999px;
  background: hsl(var(--color-purple));
  box-shadow: 0 42px 0 0 hsl(var(--color-purple));
}
</style>
