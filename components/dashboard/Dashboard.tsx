"use client";
import React from 'react'
import { Heading } from '../ui/heading'
import { Button } from '../ui/button'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const Dashboard = () => {
  return (
    <div className='h-screen'>
        <div className=" p-4">
                  
                    <Button variant='destructive' onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
                      Keluar
                    </Button>
                  
                    <Button  className="w-full ">
                      <Link href="/login">Masuk</Link>
                    </Button>
                  
                </div>
                <div className='min-w-2xl mx-auto'>
        <Heading
        title='Product'
        description='mengatur Product'/>
        </div>
    </div>
  )
}

export default Dashboard