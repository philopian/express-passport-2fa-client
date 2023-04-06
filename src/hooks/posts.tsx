import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { toast } from 'react-toastify'

import config from '../config'
import { queryClient } from '../main'
import { accessTokenStorage } from '../store'

export function useFetchPosts() {
  const [accessToken] = useAtom(accessTokenStorage)
  const response = useQuery({
    queryKey: ['posts'],
    enabled: !!accessToken,
    queryFn: async () => {
      const response = await fetch(`${config.baseRestUrl}/posts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const responseData = await response.json()
      return responseData
    },
  })

  return response
}

export function useAddPost() {
  const [accessToken] = useAtom(accessTokenStorage)
  return useMutation({
    mutationKey: ['posts'],
    mutationFn: async (newPost) => {
      const response = await fetch(`${config.baseRestUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const responseData = await response.json()
      return responseData
    },
    onSuccess: async (data: any) => {
      toast(`🤾 ${data.data.message} just added`)
      queryClient.invalidateQueries(['posts'])
    },
    onError: (error) => {
      console.log('[ERROR]', error)
    },
  })
}
