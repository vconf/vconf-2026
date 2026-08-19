export const easterEggParts = {
  elements: 'FLAG{VCONF_',
  sources: 'DEV_MODE_',
  network: 'UNLOCKED}',
} as const

export const easterEggFlag = `${easterEggParts.elements}${easterEggParts.sources}${easterEggParts.network}`
export const easterEggTrigger = 'vconf2026Welcome'
export const easterEggTitle = 'VCONF SECRET MODE'

export const easterEggBanner = `
You found the developer entrance.

There are 3 pieces of a hidden flag.

[1/3] The first one is closer than you think.

Hint: Elements

提交方式：submitFlag("完整 FLAG")
`
export const easterEggHtmlComment = `
🥚 vconf Easter Egg #1

You found the first piece!

${easterEggParts.elements}

Next hint:
JavaScript remembers things.

Try looking inside Sources.
`
export const easterEggAccepted = `
✅ FLAG ACCEPTED

VCONF DEV MODE: ON

Nice, you found it.

Next:

    ${easterEggTrigger}()

Console knows what to do.
vconf 2026，我們現場見！👋
`
export const easterEggRejected = `
❌ Not quite.

You need all 3 pieces, combined in order.

Console → Elements → Sources → Network
`
export const easterEggColors = ['#41B983', '#873DFF', '#FFFFFF'] as const
