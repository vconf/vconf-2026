const AGENDA_UNPUBLISH_PATH = '/agenda/unpublish'

function normalizePath(path: string) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path
}

export function isAgendaUnpublishPath(path: string) {
  const normalizedPath = normalizePath(path)

  return (
    normalizedPath === AGENDA_UNPUBLISH_PATH
    || normalizedPath.startsWith(`${AGENDA_UNPUBLISH_PATH}/`)
  )
}

export function isAgendaModalNavigation(toPath: string, fromPath: string) {
  return isAgendaUnpublishPath(toPath) && isAgendaUnpublishPath(fromPath)
}
