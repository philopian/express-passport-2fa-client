import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import CommentForm from '../components/CommentForm'
import { useFetchPosts } from '../hooks/posts'

export default function Welcome() {
  const [showError, setShowError] = useState(false)
  const { isLoading, error, data, isFetched, isRefetchError } = useFetchPosts()

  if (isLoading) return <>'Loading...'</>
  if (error && isFetched) {
    toast('🫤 hmmmm wrong fetching data from the service.')
  }

  // useEffect(() => {
  //   if (error && isRefetchError) {
  //     toast('🫤 hmmmm wrong fetching data from the service.')
  //   }
  // }, [error, isRefetchError])

  return (
    <>
      <h1>Welcome</h1>
      <CommentForm />
      <code>
        <pre>{JSON.stringify(data?.data, null, 1)}</pre>
      </code>
    </>
  )
}
