type EmptyStateProps = {
  icon: any,
  small?: boolean,
  title: string,
  description: string,
}

function EmptyState(props: EmptyStateProps) {
  return (
    <div className='z-10 size-full border border-dashed rounded-md flex items-center justify-center truncate'>
      {/* https://vercel.com/geist/empty-state */}
      <div className="z-0 h-fit justify-center items-center flex flex-col gap-0">
        <div className={`size-20 grid place-items-center border rounded-full m-5 ${props.small && 'size-10'}`}>
          <props.icon className={`size-8 text-muted-foreground ${props.small && 'size-4 p-2 m-2.5'}`} />
        </div>
        <p className={`text-xl text-primary text-center ${props.small && 'text-sm'}`}>{props.title}</p>
        <p className="text-muted-foreground text-xs">{props.description}</p>
      </div>
    </div>
  )
}

export default EmptyState