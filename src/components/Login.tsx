import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import config from '../config'
import store from '../store'

type Inputs = {
  email: string
  password: string
}

const createTodo = async (data: Inputs): Promise<Inputs> => {
  const response = await fetch(`${config.baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error('Network response was not ok')

  const responseData = await response.json()
  return responseData
}

export default function Login() {
  const navigate = useNavigate()
  const [tempToken, setTempToken] = useAtom(store.tempToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    setIsSubmitting(true)
    mutation.mutate(data)
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['open'],
    queryFn: () => fetch(`${config.baseUrl}/api/open`).then((res) => res.json()),
  })

  const mutation = useMutation(createTodo, {
    mutationKey: ['temp'],
    onSuccess: (data) => {
      setTempToken(data.accessToken)

      reset()
      setIsSubmitting(false)

      navigate('/qr')
    },
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          placeholder="Email address"
          required
          {...register('email')}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          {...register('password')}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  )
}
