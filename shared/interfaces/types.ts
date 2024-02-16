export type UserType = {
  id?: string
  first_name: string
  last_name: string
  fullName?: string
  email: string
  password: string
  bio: string
  about_me: string
  hobbies: string[]
  profile_pic?: string
  create_date?: Date
  role?: string
  active_status?: boolean
  posts?: string
  userCircle?: string
}

export type AuthType = {
  token: string
  cookies?: string
}

export type BlogType = {
  id: string
  fullName: string
  title: string
  profile_pic: string
  post_img: string
  content: string
  LikeCount: string
  CommentCount: string
  ShareCount: string
  users: string
  comments: string[]
  createdAt: string
  updatedAt: string
}

export type UsersResponse = {
  success: boolean
  data?: UserType[] | UserType
  message?: string
}
