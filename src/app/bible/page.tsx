import React from 'react'
import { EB_Garamond } from 'next/font/google'
import { cn } from '@/lib/utils'

const serif = EB_Garamond({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin']
})

const Page = async () => {

  const res = await fetch('https://bible-api.com/jude1?translation=ylt').then((a) => a.json())

  return (
    <main className='bg-amber-50 flex justify-center'>


      <div className='tracking- min-h-screen p-8 text-primary max-w-2xl'>
        <div className="p-2">
          <p className="text-xl font-medium">{res['reference']}</p>
          <p className="text-muted-foreground text-xs">{res['translation_name']}</p>
        </div>
        <div className="p-4 py-8">
          <p className={cn('leading-loose')}>
            {res['verses'].map((verse: any) => (
              <span key={verse['verse']} className='duration-300 transition-all ease-in-out hover:underline hover:underline-offset-4 hover:decoration-dotted cursor-pointer'>
                <span className='text-xs align-top text-muted-foreground p-1'>{verse['verse']}</span>
                <span className='text-base'>{verse['text']}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </main>
  )
}

export default Page