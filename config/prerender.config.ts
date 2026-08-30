import { agendaRoutes, speakerRoutes, teamRoutes } from './content-routes'

/**
 * 固定頁面手寫；講者與籌備團隊的彈窗式路由由 content 檔案產生（config/content-routes.ts）。
 */
const routes = [
  '/',
  '/about',
  '/sponsors',
  '/speakers',
  '/agenda',
  '/team',
  ...speakerRoutes,
  ...agendaRoutes,
  ...teamRoutes,
]

export const prerenderConfig = {
  routes,
} as const
