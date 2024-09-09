import { FallbackProps } from 'react-error-boundary'

export const ErrorFallback = ({ error }: FallbackProps) => {
  console.log(error)
  return <>Error</>
}
