import { agendaRoutes, speakerRoutes, teamRoutes } from './content-routes'
import { recapPhotoRoutes } from './recap'

/**
 * 固定頁面手寫；講者與籌備團隊的彈窗式路由由 content 檔案產生（config/content-routes.ts），
 * 花絮的燈箱路由來自 config/recap.ts。
 */
const routes = [
  '/',
  '/about',
  '/sponsors',
  '/speakers',
  '/agenda',
  '/team',
  '/recap',
  ...speakerRoutes,
  ...agendaRoutes,
  ...teamRoutes,
  ...recapPhotoRoutes,
]

export const prerenderConfig = {
  routes,
} as const
