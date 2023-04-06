import { toast } from 'react-toastify'

import CommentForm from '../components/CommentForm'
import { useFetchPosts } from '../hooks/posts'

export default function Welcome() {
  const { isLoading, data, isRefetchError } = useFetchPosts()

  if (isLoading) return <>Loading...</>
  if (isRefetchError) {
    toast('🫤 hmmmm wrong fetching data from the service.')
  }

  return (
    <div className="welcomePage">
      <h1>Welcome</h1>
      <CommentForm />

      <h3>Posts</h3>
      <ul className="containerPosts">
        {data.data &&
          data.data.map(({ id, message }: { id: string; message: string }) => {
            return (
              <li className="item" key={id}>
                {message}
              </li>
            )
          })}
      </ul>
    </div>
  )
}
