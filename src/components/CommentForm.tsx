import { useForm } from 'react-hook-form'

import { useAddPost } from '../hooks/posts'

type Dto = {
  message: string
}

export default function CommentForm() {
  const { mutate: createPost } = useAddPost()

  const {
    register,
    handleSubmit,
    // watch,
    reset,
    formState: { errors },
  } = useForm()
  const onSubmit = (data: any) => {
    const dto: Dto = {
      message: data.message,
    }
    createPost(dto)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Write something" {...register('message', { required: true })} required />
      {errors.message && <span>This field is required</span>}

      <input type="submit" />
    </form>
  )
}
