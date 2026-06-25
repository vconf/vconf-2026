<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    sceneClass?: string
  }>(),
  {
    sceneClass: 'w-full',
  },
)

// ── Colour / opacity tables ───────────────────────────────────────────────────
const rightLayerColors = [
  '#FFFFFF',
  '#FCDFEC',
  '#FABFD9',
  '#F79FC6',
  '#F57EB2',
  '#F25E9F',
  '#F03E8C',
  '#ED1E79',
  '#EF3C6C',
  '#F15960',
  '#F37753',
  '#F69547',
  '#F8B33A',
  '#FAD02E',
  '#FCEE21',
]
// 對應 public/hero-0626-3.svg：內側 6 張全實心，往外側階梯式變淡
const rightLayerOpacities = [
  0,
  100,
  100,
  100,
  100,
  100,
  100,
  60,
  50,
  50,
  30,
  30,
  30,
  30,
  30,
].map(v => v / 100)

const leftLayerColors = [
  '#687A89',
  '#5F8196',
  '#5688A2',
  '#4D8FAF',
  '#4496BC',
  '#3B9DC9',
  '#32A4D5',
  '#29ABE2',
  '#2CADD4',
  '#30AFC7',
  '#33B1B9',
  '#37B2AC',
  '#3AB49E',
  '#3EB691',
  '#41B883',
]
// 對應 public/hero-0626-4.svg：以 #29ABE2 (idx7) 為最亮高光，兩側遞減
const leftLayerOpacities = [
  0,
  36,
  36,
  36,
  50,
  50,
  70,
  80,
  36,
  36,
  36,
  36,
  20,
  20,
  20,
].map(v => v / 100)

const layerCount = rightLayerColors.length
const layers = Array.from({ length: layerCount }, (_, i) => i)
// 疊放順序：對齊設計稿（idx14 在最底 → idx1 在最上），讓內側卡片畫在最上層
const paintLayers = [...layers].reverse()

// ── SVG tile geometry ─────────────────────────────────────────────────────────
// 每張卡片直接用設計稿四邊形的「四個頂點」(exact polygon)：右扇 public/hero-0626-3.svg、
// 左扇 public/hero-0626-4.svg，經相似變換（等比縮放＋旋轉）對位到本 SVG 座標。
// 用精確多邊形而非平行四邊形近似，可完全貼合設計稿的透視變化（避免轉折處出現「特別平」的卡）。
// idx0 為 opacity 0 的隱形佔位卡。
const leftPolygons = [
  '84.8,1157.5 294.9,1297.7 301.3,1497.1 90.8,1355.3',
  '114.1,1069.8 324.2,1210 330.6,1409.4 120.1,1267.6',
  '171,985.1 359.4,1132.5 333.8,1318.1 142,1170.3',
  '241.1,871.2 407.8,1025.7 350,1197.6 177.1,1043.8',
  '320.2,752.3 465.3,914 375.4,1072.2 221.3,912.4',
  '404,652.7 527.5,821.6 405.4,966 270.1,800.2',
  '488.1,596.5 589.9,772.6 435.6,903.3 319.2,731.5',
  '363.4,729.8 567.3,607.3 647.4,790.6 461,907.5',
  '417.9,774.4 583.8,636.6 688.5,818.8 539.2,954.3',
  '473.2,789 601.1,635.9 730.4,816.9 618.3,971',
  '529.8,784.4 619.7,615.9 773.6,795.7 698.6,968.5',
  '588.8,772.3 640.7,588.5 819.3,767.2 781.5,958.6',
  '644.3,763.9 658.3,564.8 861.4,742.3 860.7,952.3',
  '712,772.5 688,558.1 915.7,734.4 952.2,963.1',
  '785.7,809.2 723.6,579.4 975.9,754.5 1049.6,1001.9',
]
const rightPolygons = [
  '1024.1,335.1 1273.1,505.5 1175.5,679.5 931.4,534',
  '1063.3,315 1312.3,485.4 1214.7,659.4 970.6,513.9',
  '1115.7,299.2 1343.5,483 1242.1,629.9 1016.6,481.3',
  '1181.1,275 1387.7,472.2 1282.5,591.9 1075.7,440.4',
  '1253.9,249.6 1439.3,460 1330.3,552.6 1142.1,398.1',
  '1328.5,230 1492.7,453.8 1379.9,519.1 1210.4,361.7',
  '1399.3,223.4 1542.3,460.5 1425.7,498.8 1274.9,338.3',
  '1461.8,498.5 1329.6,335 1460.4,236.9 1582.2,487.4',
  '1540.2,516 1418,321.5 1576.7,265.3 1691.5,536',
  '1605.6,486 1493.4,260.5 1679.9,246.2 1787.9,537.1',
  '1656.2,440.1 1554.1,183.6 1768.5,211.2 1869.5,522.3',
  '1692.9,392.1 1600.8,104.6 1843,174.1 1937.1,505.4',
  '1716.5,346.8 1634.5,28.3 1904.6,139.7 1991.7,491.2',
  '1728,318.8 1656,-30.6 1953.9,122.6 2034.1,494.3',
  '1727.9,322.9 1666,-57.6 1991.7,137.6 2065,529.5',
]

// 左扇整體上移量（負值往上；數字越小越往上）
const leftYShift = -40
// 右扇整體位移：往下＋微左，讓粉扇內側貼住中央 V、與左扇連成一條波（對齊設計稿）
const rightShift = { x: -20, y: 135 }
// hero 場景垂直位移（負值往上）。註：桌機會被下方 ANCHOR_Y 的 margin 補償完全抵消，
// 所以這個值「實際上只影響手機版」（手機沒有補償）。手機要上移就調更小/更負。
const sceneYShift = -120

// 固定「中央 V ↔ 上方 logo」距離（不隨解析度縮放改變）
// SVG 會隨寬度等比縮放（s = svg寬/1494），故 marginTop 也要跟著補償：
//   marginTop = heroVGapPx - ANCHOR_Y * s
// ANCHOR_Y = 中央 V 頂端在 viewBox 的 y（含 sceneYShift）
const ANCHOR_Y = 286.628 + sceneYShift
// 校準值：往 0 加 → 場景下移、距 logo 更遠；更負 → 上移、更近（1 單位 ≈ 1px）
const heroVGapPx = -110

// ── SVG refs ──────────────────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgDotsRef = ref<SVGImageElement | null>(null)
const svgBgRef = ref<SVGImageElement | null>(null)
let bgDotsRO: ResizeObserver | null = null

// 桌機點陣中心固定在 viewBox 座標（與扇形同步縮放）：往左/上調小，往右/下調大
const DOTS_CX = 1130
const DOTS_CY = 990
// 手機點陣圖頂端距 SVG 底部的固定 CSS px；數值越小 → 位置越低
const DOTS_OFFSET_PX_SM = 250 // 手機：hero-bg-sm.svg（icon 8px）；數字越大點陣越往上

function updateBgDotsSize() {
  if (!heroSvgRef.value || !svgBgDotsRef.value)
    return
  const w = heroSvgRef.value.getBoundingClientRect().width
  if (w <= 0)
    return
  const s = w / 1494

  // 固定 hero 場景與上方 logo 的距離：補償 SVG 等比縮放（桌機才鎖定；手機沿用 class 邊距）
  if (rootRef.value) {
    rootRef.value.style.marginTop
      = w < 1000 ? '' : `${heroVGapPx - ANCHOR_Y * s}px`
  }

  // 手機偵測：mobile min-w=900px，桌機 min-w=1400px，用 1000px 為分界
  if (w < 1000) {
    // hero-bg-sm.svg 原生 705×392，icon ~8px SVG units → 反縮放後固定 8px CSS
    const dotW = Math.round(705 / s)
    const dotH = Math.round(392 / s)
    svgBgDotsRef.value.setAttribute('href', '/hero-bg-sm.svg')
    // +150 = 點陣中心相對 viewBox 1039 往右的位移；調小 → 往左、調大 → 往右
    svgBgDotsRef.value.setAttribute(
      'x',
      String(Math.round(1039 - dotW / 2) + 170),
    )
    svgBgDotsRef.value.setAttribute(
      'y',
      String(Math.round(1099 - DOTS_OFFSET_PX_SM / s)),
    )
    svgBgDotsRef.value.setAttribute('width', String(dotW))
    svgBgDotsRef.value.setAttribute('height', String(dotH))
  }
  else {
    // 桌機：hero-bg-md.svg 原生 1478×707，icon 16px SVG units → 反縮放後 16px CSS
    // 位置：把點陣「中心」釘在固定 viewBox (DOTS_CX, DOTS_CY)，與扇形同座標系一起縮放
    //       → 與 hero 圖維持固定相對距離，不隨寬度漂移（size 仍反縮放保持 icon 16px）
    const dotW = 1478 / s
    const dotH = 707 / s
    svgBgDotsRef.value.setAttribute('href', '/hero-bg-md.svg')
    svgBgDotsRef.value.setAttribute('width', String(Math.round(dotW)))
    svgBgDotsRef.value.setAttribute('height', String(Math.round(dotH)))
    svgBgDotsRef.value.setAttribute(
      'x',
      String(Math.round(DOTS_CX - dotW / 2)),
    )
    svgBgDotsRef.value.setAttribute(
      'y',
      String(Math.round(DOTS_CY - dotH / 2)),
    )
  }
}

// ── onMounted ─────────────────────────────────────────────────────────────────
onMounted(() => {
  if (heroSvgRef.value) {
    updateBgDotsSize()
    bgDotsRO = new ResizeObserver(updateBgDotsSize)
    bgDotsRO.observe(heroSvgRef.value)
  }

  // 靜態模式：卡片 transform 由 template :transform 綁定直接套用最終狀態
  if (svgBgRef.value)
    (svgBgRef.value as unknown as SVGElement).setAttribute('opacity', '1')
  if (heroSvgRef.value)
    heroSvgRef.value.style.opacity = '1'
})

onUnmounted(() => {
  bgDotsRO?.disconnect()
  bgDotsRO = null
})

const sceneClasses = computed(() => props.sceneClass)
</script>

<template>
  <div
    ref="rootRef"
    :class="sceneClasses"
  >
    <svg
      ref="heroSvgRef"
      class="relative left-1/2 w-full min-w-[900px] -translate-x-1/2 md:min-w-[1400px]"
      style="opacity: 0; overflow: visible"
      viewBox="292 0 1494 1099"
      preserveAspectRatio="xMidYMin meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g :transform="`translate(0,${sceneYShift})`">
        <!-- 背景裝飾點陣圖：JS 反縮放，icon 固定 16px 不隨 viewport 縮放 -->
        <image
          ref="svgBgDotsRef"
          href="/hero-bg-md.svg"
          x="391"
          y="637"
          width="1478"
          height="707"
        />

        <!-- 左扇 (藍/青色系, 15 張) -->
        <g :transform="`translate(0,${leftYShift})`">
          <polygon
            v-for="i in paintLayers"
            :key="`tl-${i}`"
            :points="leftPolygons[i]"
            :fill="leftLayerColors[i]"
            :fill-opacity="leftLayerOpacities[i]"
          />
        </g>

        <!-- 右扇 (粉/黃色系, 15 張) -->
        <g :transform="`translate(${rightShift.x},${rightShift.y})`">
          <polygon
            v-for="i in paintLayers"
            :key="`tr-${i}`"
            :points="rightPolygons[i]"
            :fill="rightLayerColors[i]"
            :fill-opacity="rightLayerOpacities[i]"
          />
        </g>

        <!-- 電路板底圖 (GSAP 霓虹閃爍)：放中央 V 之前 → 疊在 V 後面 -->
        <image
          ref="svgBgRef"
          href="/home/hero-middle-bg.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
          opacity="0"
        />

        <!-- 中心骨牌圖：放最後 → 疊在最前面 -->
        <image
          href="/home/hero-middle.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
        />
      </g>
    </svg>
  </div>
</template>
