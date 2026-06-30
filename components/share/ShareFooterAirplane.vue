<script setup lang="ts">
defineProps<{
  started: boolean
}>()
</script>

<template>
  <svg
    width="265"
    height="291"
    viewBox="0 0 265 291"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="airplane"
    :class="[{ 'airplane--started': started }]"
    aria-hidden="true"
  >
    <g class="airplane__body">
      <path
        d="M0.492386 0.429199L263.492 157.429L189.492 183.429L0.492386 0.429199Z"
      />
      <path
        d="M137.492 203.429L0.492386 1.4292L42.4924 239.429L137.492 203.429Z"
      />
      <path
        d="M189.992 183.929L156.992 289.429M156.992 289.429L101.492 216.929L136.992 202.929L156.992 289.429Z"
      />
    </g>
  </svg>
</template>

<style scoped>
.airplane {
  width: 100%;
  height: 100%;
  overflow: visible;
  display: block;
}

.airplane__body {
  transform-box: fill-box;
  transform-origin: center;
}

.airplane__body path {
  stroke: #863bff;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 700;
  stroke-dashoffset: 700;
  opacity: 0;
}

.airplane--started .airplane__body {
  animation: airplane-float 4.8s ease-in-out infinite;
}

.airplane--started .airplane__body path {
  animation: airplane-draw 2.2s ease-out forwards;
}

.airplane--started .airplane__body path:nth-child(2) {
  animation-delay: 0.18s;
}

.airplane--started .airplane__body path:nth-child(3) {
  animation-delay: 0.36s;
}

@keyframes airplane-draw {
  0% {
    stroke-dashoffset: 700;
    opacity: 0.2;
  }

  65% {
    opacity: 1;
  }

  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@keyframes airplane-float {
  0% {
    transform: translate3d(-4px, 2px, 0) rotate(-6deg);
  }

  25% {
    transform: translate3d(6px, -3px, 0) rotate(3deg);
  }

  50% {
    transform: translate3d(-2px, -8px, 0) rotate(-2deg);
  }

  75% {
    transform: translate3d(5px, -2px, 0) rotate(4deg);
  }

  100% {
    transform: translate3d(-4px, 2px, 0) rotate(-6deg);
  }
}
</style>
