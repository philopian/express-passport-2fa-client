// import { useQuery, useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

// import { useLogin, useOpenData } from '../hooks/use-auth'
// import config from '../config'
import store from '../store'
import { postRequest } from '../util/request'

type Inputs = {
  email: string
  password: string
}

// ===========================================

export default function Login() {
  const navigate = useNavigate()
  const [, setMfaToken] = useAtom(store.mfaToken)

  // const { mutate: loginUser }: any = useLogin()
  // const { isLoading, error, data } = useOpenData()
  // console.log(data)

  // const [, setMfaToken] = useAtom(store.mfaToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (dto) => {
    try {
      setIsSubmitting(true)

      // Get MFA token
      const { mfaToken } = await postRequest({ route: '/auth/login', dto })
      setMfaToken(mfaToken)

      // Cleanup
      reset()
      setIsSubmitting(false)
      navigate('/qr')
    } catch (error) {
      console.log({
        message: 'login failed',
      })
      navigate('/')
    }
  }

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['open'],
  //   queryFn: getRequest,
  // })

  // const mutation = useMutation(createTodo, {
  //   mutationKey: ['mfaToken'],
  //   onSuccess: (data) => {
  //     setMfaToken(data.mfaToken)

  //     reset()
  //     setIsSubmitting(false)

  //     navigate('/qr')
  //   },
  // })

  // if (isLoading) return 'Loading...'
  // if (error) return 'An error has occurred: ' + error.message

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
