/**
 * 籌備團隊成員，資料來源是 content/team/*.yml。
 * 與 useSpeakers() 同樣的快取策略：payload／static 有就不重打 query。
 */
export function useTeamMembers() {
  return useAsyncData(
    'all-team-members',
    () => queryCollection('team').order('order', 'ASC').all(),
    {
      getCachedData: key =>
        useNuxtApp().payload.data[key] ?? useNuxtApp().static.data[key],
    },
  )
}
