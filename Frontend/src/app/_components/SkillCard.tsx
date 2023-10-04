'use client'
import React from 'react'
import Link from 'next/link'


// define props passed to SkillCard for dynamic rendering
const SkillCard = (
  {skill_id, skill_name, skill_status}: TSkillDetails
) => {
  return (
        <Link href="#" className="h-full block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mx-auto">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{skill_name}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">Skill ID: {skill_id}</p>
            

            <div className='grid justify-items-center mt-6'>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center justify-center inline-flex items-right mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {/* <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                    <span className="sr-only">Icon description</span> */}

                    <span>View Skill</span>

                </button>
            </div>
            
        </Link>
  )
}

export default SkillCard