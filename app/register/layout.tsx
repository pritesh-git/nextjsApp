import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-5">
      {children}
    </div>
  )
}

export default layout
