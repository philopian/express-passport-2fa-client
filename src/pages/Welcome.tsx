import CommentForm from '../components/CommentForm'
import { useFetchPosts } from '../hooks/posts'

export default function Welcome() {
  const { isLoading, error, data } = useFetchPosts()

  if (isLoading) return <>'Loading...'</>
  if (error) return <>'An error has occurred: ' + error.message</>

  return (
    <>
      <h1>Welcome</h1>
      <CommentForm />
      <code>
        <pre>{JSON.stringify(data, null, 1)}</pre>
      </code>
    </>
  )
}
