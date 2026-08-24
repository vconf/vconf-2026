// 彈窗式路由：父路徑與 /父路徑/:id 共用同一個頁面元件，只切換 overlay
const MODAL_BASE_PATHS = ['/agenda/unpublish', '/speakers', '/team']

function normalizePath(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path
}

export function getModalBasePath(path: string) {
  const normalizedPath = normalizePath(path)

  return (
    MODAL_BASE_PATHS.find(
      basePath =>
        normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`),
    ) ?? null
  )
}

export function isModalNavigation(toPath: string, fromPath: string) {
  const basePath = getModalBasePath(toPath)

  return Boolean(basePath) && basePath === getModalBasePath(fromPath)
}
