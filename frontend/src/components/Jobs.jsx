import React, { useEffect, useState } from 'react'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Jobs = () => {

    const { allJobs, searchedQuery, filters: filtersFromStore } = useSelector(store => store.job)
    const [filteredJobs, setFilteredJobs] = useState([])

    useEffect(() => {
        const rawFilters = filtersFromStore || { location: [], industry: [], salary: [] };
        const filters = {
            location: Array.isArray(rawFilters.location)
                ? rawFilters.location
                : rawFilters.location
                ? [rawFilters.location]
                : [],
            industry: Array.isArray(rawFilters.industry)
                ? rawFilters.industry
                : rawFilters.industry
                ? [rawFilters.industry]
                : [],
            salary: Array.isArray(rawFilters.salary)
                ? rawFilters.salary
                : rawFilters.salary
                ? [rawFilters.salary]
                : [],
        };
        let result = [...allJobs];

        // Global text search (from hero search bar)
        if (searchedQuery && searchedQuery.trim() !== "") {
            const query = searchedQuery.toLowerCase();

            result = result.filter((job) => {
                const title = job?.title?.toLowerCase() || "";
                const description = job?.description?.toLowerCase() || "";
                const location = job?.location?.toLowerCase() || "";
                const company = job?.company?.name?.toLowerCase() || "";
                const requirements = (job?.requirements || []).join(" ").toLowerCase();

                return (
                    title.includes(query) ||
                    description.includes(query) ||
                    location.includes(query) ||
                    company.includes(query) ||
                    requirements.includes(query)
                );
            });
        }

        // Location filter (contains match, multi-select)
        if (filters.location.length > 0) {
            const selectedLocations = filters.location.map((loc) => loc.toLowerCase());
            result = result.filter((job) => {
                const jobLoc = (job?.location || "").toLowerCase();
                return selectedLocations.some((loc) => jobLoc.includes(loc));
            });
        }

        // Industry/role filter (match in title, multi-select)
        if (filters.industry.length > 0) {
            const selectedRoles = filters.industry.map((role) => role.toLowerCase());
            result = result.filter((job) => {
                const title = (job?.title || "").toLowerCase();
                return selectedRoles.some((role) => title.includes(role));
            });
        }

        // Salary range filter (LPA, multi-select)
        if (filters.salary.length > 0) {
            let min = 0, max = Infinity;
            result = result.filter((job) => {
                const salary = Number(job?.salary) || 0;
                return filters.salary.some((range) => {
                    if (range === "0 - 3 LPA") {
                        min = 0; max = 3;
                    } else if (range === "3 - 6 LPA") {
                        min = 3; max = 6;
                    } else if (range === "6 - 10 LPA") {
                        min = 6; max = 10;
                    } else if (range === "10+ LPA") {
                        min = 10; max = Infinity;
                    } else {
                        min = 0; max = Infinity;
                    }
                    return salary >= min && salary < max;
                });
            });
        }

        setFilteredJobs(result);

    }, [allJobs, searchedQuery, filtersFromStore])


    return (
        <div>
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>

                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>

                    {
                        filteredJobs.length === 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filteredJobs.map((job) => (
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
