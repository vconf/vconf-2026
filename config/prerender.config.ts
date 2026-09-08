import { agendaRoutes, speakerRoutes, teamRoutes } from './content-routes'

/**
 * 固定頁面手寫；講者與籌備團隊的彈窗式路由由 content 檔案產生（config/content-routes.ts）。
 * 花絮的 /recap 只是 coming-soon，正式版在 /recap/unpublish，還沒公開所以不進靜態產出。
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
]

export const prerenderConfig = {
  routes,
} as const
