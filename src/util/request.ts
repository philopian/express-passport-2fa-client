import config from '../config'

type Request = {
  route: string
  dto?: any
  token?: string
}

function withToken(token = '') {
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

export async function getRequest({ token, route }: Request) {
  const headers: any = { ...withToken(token) }
  const response = await fetch(`${config.baseUrl}${route}`, {
    method: 'GET',
    headers,
  })
  if (!response.ok) throw new Error('Network response was not ok')

  const responseData = await response.json()
  return responseData
}

export async function postRequest({ token, route, dto }: Request) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...withToken(token),
  }
  const response = await fetch(`${config.baseUrl}${route}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dto),
  })
  const data = await response.json()
  return data
}

export async function putRequest({ token, route, dto }: Request) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...withToken(token),
  }
  const response = await fetch(`${config.baseUrl}${route}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(dto),
  })
  const data = await response.json()
  return data
}

export async function patchRequest({ token, route, dto }: Request) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...withToken(token),
  }
  const response = await fetch(`${config.baseUrl}${route}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(dto),
  })
  const data = await response.json()
  return data
}

export async function deleteRequest({ token, route }: Request) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...withToken(token),
  }
  const response = await fetch(`${config.baseUrl}${route}`, {
    method: 'DELETE',
    headers,
  })
  const data = await response.json()
  return data
}

export async function imageRequest({ token, route }: Request) {
  try {
    const headers: any = {
      Accept: 'image/png',
      ...withToken(token),
    }

    const response = await fetch(`${config.baseUrl}${route}`, {
      method: 'GET',
      headers,
    })
    const buffer = await response.arrayBuffer()
    const blob = new Blob([buffer], { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    return url
  } catch (error) {
    console.error(error)
  }
}
