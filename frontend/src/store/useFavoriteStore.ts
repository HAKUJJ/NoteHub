import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import type { Note } from '../types'
import { api,json } from '../services/api'
import { useAuthStore } from './authStore'
export interface FavoriteItem {
  kind: 'note'|'book'; id:string; title:string; subtitle:string; coverId?:number|null; note?:Note; savedAt:number
}
export function useFavorites() {
  const userId=useAuthStore(s=>s.user?.id)
  return useQuery({queryKey:['favorites',userId],enabled:!!userId,queryFn:async()=> (await api<{data:FavoriteItem[]}>('/favorites')).data})
}
export function useMyFavorites(): FavoriteItem[] { return useFavorites().data ?? [] }
export function useToggleFavorite() {
  const client=useQueryClient()
  return useMutation({
    mutationFn:async({item,active}:{item:Omit<FavoriteItem,'savedAt'>;active:boolean})=>{
      if(active) await api(`/favorites/${encodeURIComponent(item.id)}?kind=${item.kind}`,json('DELETE'))
      else await api('/favorites',json('POST',item.kind === 'note' ? {noteId:item.id} : {kind:'book',id:item.id,title:item.title,subtitle:item.subtitle,coverId:item.coverId}))
    },
    onSuccess:()=>client.invalidateQueries({queryKey:['favorites']}),
  })
}
