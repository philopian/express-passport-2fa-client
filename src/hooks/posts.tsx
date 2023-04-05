import { useQuery, useMutation } from '@tanstack/react-query'

import { queryClient } from '../main'

const BASE_URL = 'http://localhost:4004'

export function useFetchPosts() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(`${BASE_URL}/posts`).then((res) => res.json()),
  })

  return { isLoading, error, data }
}

export function useAddPost() {
  return useMutation({
    mutationKey: ['posts'],
    mutationFn: async (newPost) => {
      const response = await fetch(`${BASE_URL}/posts`, {
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
