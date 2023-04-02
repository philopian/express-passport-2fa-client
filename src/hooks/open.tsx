import { useQuery } from '@tanstack/react-query'

import { getRequest } from '../util/request'

export function useOpenData() {
  // const { isLoading, error, data } = useOpenData()

  const { isLoading, error, data } = useQuery({
    queryKey: ['open-data'],
    queryFn: (data) => {
      getRequest({ route: '/api/open', dto: data })
    },
  })

  return { isLoading, error, data }
}
