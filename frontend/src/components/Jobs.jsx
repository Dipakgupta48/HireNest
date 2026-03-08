import React, { useEffect, useState } from 'react'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Jobs = () => {

    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const [filterJobs, setFilterJobs] = useState([])

    useEffect(() => {

        if (searchedQuery && searchedQuery.trim() !== "") {

            const query = searchedQuery.toLowerCase()

            const filteredJobs = allJobs.filter((job) => {

                const title = job?.title?.toLowerCase() || ""
                const description = job?.description?.toLowerCase() || ""
                const location = job?.location?.toLowerCase() || ""
                const company = job?.company?.name?.toLowerCase() || ""
                const requirements = job?.requirements?.join(" ").toLowerCase() || ""

                return (
                    title.includes(query) ||
                    description.includes(query) ||
                    location.includes(query) ||
                    company.includes(query) ||
                    requirements.includes(query)
                )
            })

            setFilterJobs(filteredJobs)

        } else {
            setFilterJobs(allJobs)
        }

    }, [allJobs, searchedQuery])


    return (
        <div>
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>

                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>

                    {
                        filterJobs.length === 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                key={job?._id}
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Jobs