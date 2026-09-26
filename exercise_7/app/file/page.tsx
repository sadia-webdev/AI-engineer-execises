"use client"
import { aploadFile } from '@/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  Upload } from "lucide-react";

const page = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <form className='flex gap-2' action={aploadFile}>
        <div className="relative">
          <Input className='cursor-pointer' type='file' name='file' />
          <Upload className='absolute right-5  bottom-2 w-4 h-4 ' />
        </div>
        <Button className='bg-rose-400 cursor-pointer ' type='submit'>
          apload
        </Button>
      </form>
    </div>
  );
}

export default page