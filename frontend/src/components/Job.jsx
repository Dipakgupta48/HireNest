import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Job = ({ job }) => {

    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
        const exists = savedJobs.some((item) => item._id === job._id);
        setIsSaved(exists);
    }, [job._id]);

    const toggleSaveJobHandler = () => {
        let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
        const jobIndex = savedJobs.findIndex((item) => item._id === job._id);

        if (jobIndex !== -1) {
            // Unsave job
            savedJobs.splice(jobIndex, 1);
            localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
            setIsSaved(false);
            toast.info("Job removed from Saved Jobs");
        } else {
            // Save job
            savedJobs.push(job);
            localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
            setIsSaved(true);
            toast.success("Job saved for later");
        }
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>

            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>

                <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon"
                    onClick={toggleSaveJobHandler}
                >
                    <Bookmark className={isSaved ? "fill-[#7209b7] text-[#7209b7]" : ""} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>

                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">
                    {job?.position} Positions
                </Badge>

                <Badge className={'text-black font-bold'} variant="ghost">
                    {job?.jobType}
                </Badge>

                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
                    {job?.salary} LPA
                </Badge>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                >
                    Details
                </Button>

                <Button
                    className={`bg-[#7209b7] ${isSaved ? "bg-gray-500" : ""}`}
                    onClick={toggleSaveJobHandler}
                >
                    {isSaved ? "Unsave" : "Save For Later"}
                </Button>
            </div>

        </div>
    )
}

export default Job