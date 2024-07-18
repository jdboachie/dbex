type EmptyStateProps = {
  icon: any,
  small?: boolean,
  title: string,
  description?: string,
}

function EmptyState(props: EmptyStateProps) {
  return (
    <div className='z-10 size-full border border-dashed rounded-md flex items-center justify-center truncate'>
      {/* https://vercel.com/geist/empty-state */}
      <div className="z-0 h-fit justify-center items-center flex flex-col gap-0">
        <div className={`grid place-items-center border rounded-full ${props.small ? 'size-10 ' : 'size-20 m-4'}`}>
          <props.icon className={`size-8 text-muted-foreground ${props.small && 'size-4 p-2'}`} />
        </div>
        <p className={`text-primary text-center ${props.small ? 'text-sm' : 'text-xl'}`}>{props.title}</p>
        <p className="text-muted-foreground text-xs">{props.description}</p>
      </div>
    </div>
  )
}

export default EmptyState