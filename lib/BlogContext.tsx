'use client'
import React, { createContext, useContext, useState } from 'react'
interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
}
export interface BlogContextType {
  blogPosts: BlogPost[]
  setBlogPosts: (posts: BlogPost[]) => void
}

const BlogContext = createContext<BlogContextType>({
  blogPosts: [],
  setBlogPosts: () => {},
})

export const BlogWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(() => {
    const storedPosts = localStorage.getItem('blogPosts')
    return storedPosts ? JSON.parse(storedPosts) : []
  })

  const setBlogPosts = (posts: BlogPost[]) => {
    setBlogPostsState(posts)
    localStorage.setItem('blogPosts', JSON.stringify(posts))
  }

  return (
    <BlogContext.Provider value={{ blogPosts, setBlogPosts }}>
      {children}
    </BlogContext.Provider>
  )
}

export const useBlogContext = () => useContext(BlogContext)
