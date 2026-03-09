import React from 'react'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '@/redux/jobSlice'

const filterConfig = [
    {
        id: "location",
        label: "Location",
        options: [
            "Delhi",
            "Mumbai",
            "Bangalore",
            "Hyderabad",
            "Pune",
            "Chennai",
            "Kolkata",
            "Gurgaon",
            "Noida",
            "Ahmedabad",
            "Remote"
        ]
    },
    {
        id: "industry",
        label: "Role",
        options: [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Data Scientist",
            "DevOps Engineer",
            "Mobile Developer",
            "UI/UX Designer",
            "QA Engineer",
            "Product Manager"
        ]
    },
    {
        id: "salary",
        label: "Salary Range",
        options: ["0 - 3 LPA", "3 - 6 LPA", "6 - 10 LPA", "10+ LPA"]
    },
];

const FilterCard = () => {
    const dispatch = useDispatch();
    const filtersFromStore = useSelector(store => store.job?.filters);
    const filters = filtersFromStore || { location: [], industry: [], salary: [] };

    const handleFilterChange = (key, option) => {
        const current = Array.isArray(filters[key]) ? filters[key] : [];
        const exists = current.includes(option);
        const updated = exists
            ? current.filter((item) => item !== option)
            : [...current, option];
        dispatch(setFilters({ [key]: updated }));
    };

    const clearAllFilters = () => {
        dispatch(setFilters({ location: [], industry: [], salary: [] }));
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className='flex items-center justify-between mb-3'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                <button
                    type="button"
                    onClick={clearAllFilters}
                    className='text-xs text-blue-600 underline'
                >
                    Clear all
                </button>
            </div>
            <hr className='mb-3' />
            <div className='space-y-4'>
                {filterConfig.map((section, sectionIndex) => (
                    <div key={section.id}>
                        <h2 className='font-semibold text-sm mb-2'>{section.label}</h2>
                        {section.options.map((option, optionIndex) => {
                            const itemId = `${section.id}-${sectionIndex}-${optionIndex}`;
                            const selectedArray = Array.isArray(filters[section.id]) ? filters[section.id] : [];
                            const checked = selectedArray.includes(option);
                            return (
                                <div key={itemId} className='flex items-center space-x-2 my-1'>
                                    <input
                                        id={itemId}
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleFilterChange(section.id, option)}
                                        className='h-3 w-3 accent-[#6A38C2]'
                                    />
                                    <Label
                                        htmlFor={itemId}
                                        className={`text-sm ${checked ? 'font-medium text-[#6A38C2]' : ''}`}
                                    >
                                        {option}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterCard