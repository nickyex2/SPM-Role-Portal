'use client'
import React from 'react'
import SkillCard from './SkillCard'
import axios from 'axios'

const skillsURL = 'http://localhost:5001/skills'

const getSkills = () => {
    // fetch from database all the skills and format into list
    // return all SkillCard components
    const [skills, setSkills] = React.useState(null);

    React.useEffect(() => {
        const all = async () => {
            await axios.get(skillsURL)
            .then(
            response => setSkills(response.data.data))
        }
        all();
    }, []);

}

const AllSkills = () => {
  return (
    <>
        <div className="container mx-auto px-7">
            <h1 className="text-3xl font-bold py-5">All Skills</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 place-contents-center ">
                <div className="w-full ">
                    <SkillCard />
                </div>
                <div className="w-full ">
                    <SkillCard />
                </div>
                <div className="w-full ">
                    <SkillCard />
                </div>
            </div>
        </div>


    </>
  )
}

export default AllSkills