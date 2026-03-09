import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const EditJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    position: 0,
    companyId: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const jobId = params.id;

  const { companies } = useSelector(store => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || '',
            description: job.description || '',
            requirements: (job.requirements || []).join(','),
            salary: job.salary ?? '',
            location: job.location || '',
            jobType: job.jobType || '',
            experienceLevel: String(job.experienceLevel ?? ''),
            position: job.position ?? 0,
            companyId: job.company?._id || '',
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to load job details.');
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-center w-screen my-5'>
        <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
          <h1 className='text-xl font-bold mb-4'>Edit Job</h1>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Title</Label>
              <Input
                type='text'
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type='text'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type='text'
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Salary (LPA)</Label>
              <Input
                type='number'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type='text'
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select
                value={input.experienceLevel}
                onValueChange={(value) =>
                  setInput({ ...input, experienceLevel: value })
                }
              >
                <SelectTrigger className='w-full my-1'>
                  <SelectValue placeholder='Select experience level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='0'>Fresher</SelectItem>
                    <SelectItem value='1'>Junior Level</SelectItem>
                    <SelectItem value='2'>Mid Level</SelectItem>
                    <SelectItem value='3'>Senior Level</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>No of Position</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select
                  value={
                    companies.find(
                      (c) => c._id === input.companyId
                    )?.name.toLowerCase() || ''
                  }
                  onValueChange={selectChangeHandler}
                >
                  <SelectTrigger className='w-[180px] my-1'>
                    <SelectValue placeholder='Select a Company' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company.name.toLowerCase()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {loading ? (
            <Button className='w-full my-4'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full my-4'>
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditJob;

