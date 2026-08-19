import { easterEggHtmlComment } from '~/config/easterEgg.config'

export default defineNitroPlugin((nitroApp) => {
  const comment = `<!--${easterEggHtmlComment}-->`

  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyAppend.push(comment)
  })
})
