export function usePageScrollReady() {
  return useState('page-scroll-ready', () => true)
}

export function onPageScrollReady(callback: () => void) {
  const pageScrollReady = usePageScrollReady()
  let stopWatch: (() => void) | undefined

  onMounted(() => {
    if (pageScrollReady.value) {
      callback()
      return
    }

    stopWatch = watch(pageScrollReady, (isReady) => {
      if (!isReady)
        return

      stopWatch?.()
      stopWatch = undefined
      callback()
    })
  })

  onBeforeUnmount(() => stopWatch?.())
}
