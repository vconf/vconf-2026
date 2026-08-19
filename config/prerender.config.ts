const routes = [
  '/',
  '/about',
  '/sponsors',
  '/speakers',
  '/agenda/unpublish',
  '/team/unpublish',
  '/speakers/kuku',
  '/speakers/hunter',
  '/speakers/serko',
  '/speakers/ray',
  '/speakers/kuro',
] as const

export const prerenderConfig = {
  routes,
} as const
