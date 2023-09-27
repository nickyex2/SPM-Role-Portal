import React from 'react'
import NavBar from '../../components/Navbar'
import AllSkills from '@/components/AllSkills'

const SkillsPage = () => {
  return (
    <>
        <div className="relative">
            <NavBar></NavBar>
            <AllSkills></AllSkills>
        </div>
    </>
  )
}

export default SkillsPage