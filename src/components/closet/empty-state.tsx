import React from "react"

type EmptyStateProps = {
  icon: any,
  small?: boolean,
  title: string,
  isError?: boolean,
  className?: string,
  description?: string,
  children?: React.ReactNode
}

function EmptyState(props: EmptyStateProps) {
  return (
    <div className={`flex flex-col gap-2 z-10 size-full border border-dashed rounded-md items-center justify-center truncate ${props.className}`}>
      {/* https://vercel.com/geist/empty-state */}
      <div className="z-0 h-fit p-4 justify-center items-center flex flex-col gap-0.5">
        <div className={`grid place-items-center border rounded-full ${props.small ? 'size-10 m-2' : 'size-20 m-4'} ${props.isError && 'border-red-500'}`}>
          <props.icon className={`size-8 text-muted-foreground ${props.small && 'size-4 p-2'} ${props.isError && 'text-red-500'}`} />
        </div>
        <p className={`text-primary text-center ${props.small ? 'text-sm' : 'text-xl'} ${props.isError && 'text-red-500'}`}>{props.title}</p>
        <p className="text-muted-foreground text-xs">{props.description}</p>
      </div>
      {props.children}
    </div>
  )
}

export default EmptyState