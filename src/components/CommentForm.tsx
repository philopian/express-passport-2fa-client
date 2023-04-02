import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'

import { useAddPost } from '../hooks/posts'

type Dto = {
  id: string
  message: string
}

export default function CommentForm() {
  const { mutate: createPost } = useAddPost()

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm()
  const onSubmit = (data: any) => {
    const dto: Dto = {
      id: nanoid(),
      message: data.message,
    }

    console.log(dto)
    createPost(dto)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="something" {...register('message', { required: true })} />
      {errors.message && <span>This field is required</span>}

      <input type="submit" />
    </form>
  )
}
