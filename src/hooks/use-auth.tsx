import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import config from '../config'
import { queryClient } from '../main'
import store from '../store'
import { getRequest, postRequest } from '../util/request'

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

export function useLogin() {
  // const { mutate: loginUser }: any = useLogin()

  const RQ_KEY = 'login'
  const [, setMfaToken] = useAtom(store.mfaToken)
  return useMutation({
    mutationKey: [RQ_KEY],
    mutationFn: async (dto) => {
      return postRequest({ route: '/auth/login', dto })
    },
    onSuccess: async (data) => {
      console.log(data)
      queryClient.invalidateQueries([RQ_KEY])
      setMfaToken(data.mfaToken)
    },
    onError: (error) => {
      console.log('[ERROR]', error)
    },
  })
}

// export function useAddPost() {
//   return useMutation({
//     mutationKey: ['posts'],
//     mutationFn: async (newPost) => {
//       const response = await fetch(`${config.baseUrl}/posts`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newPost),
//       })

//       if (!response.ok) throw new Error('Network response was not ok')

//       const responseData = await response.json()
//       return responseData
//     },
//     onSuccess: async (data: any) => {
//       console.log(data)
//       queryClient.invalidateQueries(['posts'])
//     },
//     onError: (error) => {
//       console.log('[ERROR]', error)
//     },
//   })
// }

// ===================================================================
/*
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'

import config from '../config'
import store from '../store'

type Inputs = {
  email: string
  password: string
}

export async function getRequest() {
  const response = await fetch(`${config.baseUrl}/api/open`)
  const data = await response.json()
  return data
}

export async function postRequest(data: Inputs) {
  const [, setMfaToken] = useAtom(store.mfaToken)
  const response = await fetch(`${config.baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Network response was not ok')

  const responseData = await response.json()

  setMfaToken()
  return responseData
}

export const useCreateTodo = ({ navigate, reset, setIsSubmitting }) => {
  const [mfaToken, setMfaToken] = useState(null)

  const { mutate, isLoading } = useMutation(postRequest, {
    mutationKey: ['mfaToken'],
    onSuccess: (data) => {
      setMfaToken(data.mfaToken)
      reset()
      setIsSubmitting(false)
      navigate('/qr')
    },
  })

  const createTodo = async (todo) => {
    await mutate(todo)
  }

  return { mfaToken, createTodo, isLoading }
}
*/
// ===================================================================
