import { easterEggParts } from '~/config/easterEgg.config'

export default defineEventHandler(() => {
  return {
    event: 'Vconf',
    status: 'ready',
    egg: {
      flag: easterEggParts.network,
      message: 'You found the final piece.',
    },
  }
})
