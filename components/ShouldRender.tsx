import React, { ReactNode } from 'react'

type PropsType = {
  check: boolean
  children: ReactNode
}

export default function ShouldRender({
  check,
  children,
}: PropsType): JSX.Element | null {
  return check ? <>{children}</> : null
}
