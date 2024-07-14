import Link from 'next/link'
import { ServerIcon } from '@/components/icons'


export default function Layout ({ children }: { children: React.ReactNode }) {

  return (
    <div className='size-full'>
      <section className='flex border-b gap-4 p-4 py-3 items-center'>
        <ServerIcon className='size-5' />
        <Link href={'/app/connections'} className='text-lg'>Connections</Link>
      </section>
      {children}
    </div>
  )
}
