import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import config from '../config'
import store from '../store'
import './QRCode.css'

type Inputs = {
  code: string
}

export function QRCodeImage() {
  const [tempToken] = useAtom(store.tempToken)
  const { isLoading, error, data } = useQuery({
    queryKey: ['qr-code'],
    queryFn: () =>
      fetch(`${config.baseUrl}/2fa/qrcode`, {
        method: 'GET',
        headers: {
          Accept: 'image/png',
          Authorization: `Bearer ${tempToken}`,
        },
      })
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const blob = new Blob([buffer], { type: 'image/png' })
          const url = URL.createObjectURL(blob)
          return url
        })
        .catch((error) => {
          console.error(error)
        }),
  })
  console.log('🚀 ~ file: QRCode.tsx:37 ~ QRCodeImage ~ data:', data)

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <h2>Scan the QR code in Google Authenticator</h2>
      {data && <img src={data} />}
    </>
  )
}

export function QRCodeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
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

        <button type="submit">Submit</button>
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
