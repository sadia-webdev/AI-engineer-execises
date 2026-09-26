import { searchDocuments } from '@/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const page = () => {
  return (
    <div className='flex h-screen items-center justify-center '>
        <form className="flex gap-2" action={searchDocuments}>
            <Input name="query" type="search" />
            <Button type="submit">Search</Button>
        </form>
    </div>
  )
}

export default page