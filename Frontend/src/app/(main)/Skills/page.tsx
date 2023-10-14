'use client'
import React from 'react'
import SkillCard from '@/app/_components/SkillCard'
import axios from 'axios'

// react-flowbite components

const SkillsPage = () => {

  const skillsURL = 'http://localhost:5001/getAllSkills'

  const [skills, setSkills] = React.useState<Array<TSkillDetails>>([]);
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
      const all = async () => {

        const options = {
          headers: {"content-type": "application/json"}
        }

        setLoading(true)
        await axios.get(skillsURL, options)
        .then(
        (response) => {
          setSkills(response.data.data.skills)
          console.log(response.data.data.skills)
        }
        )
        setLoading(false)
        
      }
      all()
  }, []);

    const showSkillCards = () => {
      return skills.map((skill, index) => {
        return (
          <div key={index} className='h-full'>
            <SkillCard skill_id={skill.skill_id} skill_name={skill.skill_name} skill_status={skill.skill_status} />
          </div>
        )
      }
    )}

  return (
    <>
        <div className="relative">
              <div className="container mx-auto px-7">
                  <h1 className="text-3xl font-bold py-5">All Skills</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 place-contents-center">
                      {showSkillCards()}
                  </div>
              </div>

        </div>
    </>
  )
}

export default SkillsPage