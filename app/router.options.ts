import type { RouterConfig } from '@nuxt/schema'
import { isAgendaModalNavigation } from '~/utils/agendaModalRoute'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // 開/關議程彈窗時只切換 overlay，不改變背景頁捲動位置。
    if (isAgendaModalNavigation(to.path, from.path))
      return false

    if (savedPosition)
      return savedPosition

    return { left: 0, top: 0 }
  },
}
