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

// ===========================================

export default function Register() {
  const navigate = useNavigate()
  const [, setMfaToken] = useAtom(mfaTokenStorage)

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
      const { mfaToken } = await postRequest({ route: '/auth/register', dto })
      setMfaToken(mfaToken)

      // Cleanup
      reset()
      setIsSubmitting(false)
      navigate('/qr')
    } catch (error) {
      console.log({
        message: 'login failed',
      })
      navigate('/register')
    }
  }

  return (
    <div className="loginContainer">
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
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
