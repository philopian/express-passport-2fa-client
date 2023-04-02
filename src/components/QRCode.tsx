import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useTokenPolling } from '../hooks/token-polling'
import { mfaTokenStorage, accessTokenStorage, refreshTokenStorage } from '../store'
import { imageRequest, postRequest } from '../util/request'
import './QRCode.css'

type Inputs = {
  code: string
}

export function QRCodeImage() {
  const [mfaToken] = useAtom(mfaTokenStorage)
  const { isLoading, error, data } = useQuery({
    queryKey: ['qr-code'],
    queryFn: () => imageRequest({ token: mfaToken, route: '/mfa/qrcode' }),
  })

  if (isLoading) return <>'Loading...'</>
  if (error) return <>'An error has occurred: ' + error.message</>

  return (
    <>
      <h2>Scan the QR code in Google Authenticator</h2>
      {data && <img src={data} />}
    </>
  )
}

export function QRCodeForm() {
  const navigate = useNavigate()
  const [mfaToken] = useAtom(mfaTokenStorage)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [, setAccessToken] = useAtom(accessTokenStorage)
  const [, setRefreshToken] = useAtom(refreshTokenStorage)

  // TODO: start polling
  // const { isTokenPollingRunning, startTokenPolling, stopTokenPolling } = useTokenPolling()

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
      const { accessToken, refreshToken } = await postRequest({
        token: mfaToken,
        route: '/mfa/verify',
        dto,
      })

      // Cleanup
      reset()
      setIsSubmitting(false)

      // Set tokens to store
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      navigate('/welcome')
    } catch (error) {
      console.error({ code: 401, message: 'Unauthorized: failed MFA' })
      navigate('/register')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="code">Code</label>
        <input
          type="code"
          id="code"
          placeholder="Google Autheticator Code"
          required
          {...register('code')}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  )
}

const data = [
  {
    title: 'MFA',
    content: <QRCodeForm />,
  },
  {
    title: 'QR Image',
    content: <QRCodeImage />,
  },
]

export default function QRCode() {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [mfaToken] = useAtom(mfaTokenStorage)
  const navigate = useNavigate()

  // No MFA direct to login
  if (!mfaToken) navigate('/login')

  return (
    <>
      <div className="tabContainer">
        <ul className="tabs">
          {data.map(({ title }, i) => (
            <li key={title}>
              <a onClick={() => setSelectedTab(i)} className={selectedTab === i ? 'active' : ''}>
                {title}
              </a>
            </li>
          ))}
        </ul>

        <div className="tabContent">{data[selectedTab].content}</div>
      </div>
    </>
  )
}
