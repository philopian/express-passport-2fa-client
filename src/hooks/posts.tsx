import { useQuery, useMutation } from '@tanstack/react-query'

import config from '../config'
import { queryClient } from '../main'

export function useFetchPosts() {
  const response = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(`${config.baseRestUrl}/posts`).then((res) => res.json()),
  })

  return response
}

export function useAddPost() {
  return useMutation({
    mutationKey: ['posts'],
    mutationFn: async (newPost) => {
      const response = await fetch(`${config.baseRestUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: add accessToken
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const responseData = await response.json()
      return responseData
    },
    onSuccess: async (data: any) => {
      console.log(data)
      queryClient.invalidateQueries(['posts'])
    },
    onError: (error) => {
      console.log('[ERROR]', error)
    },
  })
}
