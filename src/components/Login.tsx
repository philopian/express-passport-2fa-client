import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { mfaTokenStorage } from '../store'
import { postRequest } from '../util/request'

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const [, setMfaToken] = useAtom(mfaTokenStorage)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form
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
      console.error({ code: 401, message: 'Unauthorized: failed login' })
      navigate('/')
    }
  }

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
