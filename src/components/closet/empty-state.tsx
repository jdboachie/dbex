type EmptyStateProps = {
  icon: any,
  small?: boolean,
  title: string,
  description: string,
}

function EmptyState(props: EmptyStateProps) {
  return (
    <div className='size-full border border-dashed rounded-md flex items-center justify-center'>
      {/* https://vercel.com/geist/empty-state */}
      <div className="h-fit justify-center items-center flex flex-col gap-0">
        <props.icon className={`border rounded-lg size-16 p-4 m-5 text-muted-foreground`} />
        <p className="text-base text-primary text-center">{props.title}</p>
        <p className="text-muted-foreground text-xs">{props.description}</p>
      </div>
    </div>
  )
}

export default EmptyState