<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'

const { gsap, ScrollTrigger } = useGsap()

let colorTimeline: ReturnType<typeof gsap.timeline> | null = null
let originalTextHtml = ''
const charNodes = ref<HTMLElement[]>([])

function resolveTargetColor() {
  const computedValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-text-read')
    .trim()

  return computedValue
    ? `hsl(${computedValue})`
    : 'hsl(var(--color-text-read))'
}

function buildColorTimeline(targetColor: string, progress = 0) {
  if (!sectionRef.value || !ScrollTrigger || !charNodes.value.length)
    return

  colorTimeline?.scrollTrigger?.kill()
  colorTimeline?.kill()

  for (const charNode of charNodes.value) charNode.style.color = ''

  colorTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 60%',
      end: '+=700',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  colorTimeline.to(charNodes.value, {
    color: targetColor,
    ease: 'none',
    stagger: 0.015,
  })

  colorTimeline.progress(progress)
  ScrollTrigger.refresh()
}

onMounted(() => {
  if (!sectionRef.value || !textRef.value || !ScrollTrigger)
    return

  // 減少動態效果：略過逐字上色的 scroll 動畫，直接把內文設為最終「已讀」色（可讀即可）。
  // 只設父層 color → 繼承文字變已讀色，.text-vconf-primary 因自帶 class 顏色不受影響。
  if (reducedMotion.value === 'reduce') {
    textRef.value.style.color = resolveTargetColor()
    return
  }

  originalTextHtml = textRef.value.innerHTML

  // 把內容節點解析進行文字動畫的轉換（排除標題跟空白的部分）
  const walker = document.createTreeWalker(
    textRef.value,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const content = node.textContent ?? ''
        const parent = node.parentElement

        if (!content.trim() || !parent)
          return NodeFilter.FILTER_REJECT

        if (parent.closest('.text-vconf-primary'))
          return NodeFilter.FILTER_REJECT

        return NodeFilter.FILTER_ACCEPT
      },
    },
  )

  const textNodes: Text[] = []
  let currentNode = walker.nextNode()

  // 將文字節點蒐集到 textNodes
  while (currentNode) {
    textNodes.push(currentNode as Text)
    currentNode = walker.nextNode()
  }

  // 拆字組成 span
  for (const textNode of textNodes) {
    const fragment = document.createDocumentFragment()

    for (const char of textNode.textContent ?? '') {
      if (char === ' ') {
        fragment.appendChild(document.createTextNode(char))
        continue
      }

      const span = document.createElement('span')
      span.className = 'char-read'
      span.textContent = char
      fragment.appendChild(span)
    }

    textNode.parentNode?.replaceChild(fragment, textNode)
  }

  charNodes.value = [
    ...textRef.value.querySelectorAll<HTMLElement>('.char-read'),
  ]
  buildColorTimeline(resolveTargetColor())
})

watch(
  isDark,
  () => {
    requestAnimationFrame(() => {
      // reduced-motion 沒有拆字/timeline，改直接重新套用靜態已讀色。
      if (reducedMotion.value === 'reduce') {
        if (textRef.value)
          textRef.value.style.color = resolveTargetColor()
        return
      }

      if (!charNodes.value.length)
        return

      const progress = colorTimeline?.progress() ?? 0
      buildColorTimeline(resolveTargetColor(), progress)
    })
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  colorTimeline?.scrollTrigger?.kill()
  colorTimeline?.kill()

  if (textRef.value && originalTextHtml)
    textRef.value.innerHTML = originalTextHtml
})
</script>

<template>
  <section
    ref="sectionRef"
    class="overflow-hidden"
  >
    <div class="community relative">
      <div
        class="absolute left-1/2 top-1/2 min-h-[486px] w-full min-w-0 -translate-x-1/2 -translate-y-1/2 px-6 py-8 text-center font-serif xs:w-screen lg:min-h-[520px] lg:w-full"
      >
        <ShareSectionTitle
          title="連結社群 啟發未來"
          :margin-bottom="24"
        />
        <div
          ref="textRef"
          class="text-[clamp(16px,2.2vw,21px)] font-medium leading-[160%] tracking-[0.02em] text-vconf-text-unread xs:text-[21px]"
        >
          <p class="mb-6 lg:mb-9">
            <span class="inline lg:block"><span class="text-vconf-primary">V-CONF Taiwan 2026 </span>是一場匯聚 Vue.js 開發者與前端工程師的年度盛會，<span></span></span>
            <span class="inline lg:block">聚焦 Vue 生態系與現代前端開發體驗的演進。</span>
          </p>
          <p class="mb-6 lg:mb-9">
            <span class="inline lg:block">在前端技術快速迭代的浪潮中，我們將一同回顧 Vue 的成長歷程，</span>
            <span class="inline lg:block">梳理實際改變開發模式的關鍵技術與轉折。</span>
            <span class="inline lg:block">除了回顧過去，我們也關注未來，</span>
            <span class="inline lg:block">深入探討以 Vite
              為核心的開發流程，以及新一代工具鏈如何帶來更快速、更流暢的開發體驗，</span>
            <span class="inline lg:block">並透過實務案例分享最新技術趨勢。</span>
          </p>
          <p>
            <span class="inline lg:block">在這裡，你將有機會與來自各地的開發者建立連結，</span>
            <span class="inline lg:block">一同探索 Vue 與 Vite
              的更多可能，並共同想像前端開發的下一個階段。</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.community {
  background-image: url("/about/community-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 637px;
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 480px) {
  .community {
    background-image: url("/about/community-md-bg.png");
    background-position: center;
    height: 912px;
    width: 1512px;
  }
}
</style>
