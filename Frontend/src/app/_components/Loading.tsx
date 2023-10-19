import React from 'react'
import { Spinner } from 'flowbite-react'

const Loading = () => {
  return (
    <div className='absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 '>
        <div className='text-center'>
            <Spinner
            size="page_load"
          />
          <h1 className='mt-2 font-bold text-xl'>Loading...</h1>
        </div>
      </div>
  )
}

export default Loading