const routes = [
  '/',
  '/about',
  '/sponsors',
  '/speakers',
  '/speakers/kuku',
  '/speakers/hunter',
  '/speakers/serko',
  '/speakers/ray',
  '/speakers/kuro',
] as const

export const prerenderConfig = {
  routes,
} as const
