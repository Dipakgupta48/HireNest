import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, UserPlus2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [savedUsers, setSavedUsers] = useState([]);

  // Save current user to localStorage
  useEffect(() => {
    if (user) {
      let users = JSON.parse(localStorage.getItem('savedUsers')) || [];
      users = users.filter(u => u.email !== user.email);
      users.unshift(user); // add current user on top
      localStorage.setItem('savedUsers', JSON.stringify(users));
      // show only accounts with the same role as current user
      setSavedUsers(users.filter(u => u.role === user.role));
    } else {
      const users = JSON.parse(localStorage.getItem('savedUsers')) || [];
      setSavedUsers(users);
    }
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Logout failed');
    }
  };

  const switchUser = (selectedUser) => {
    dispatch(setUser(selectedUser));
    toast.success(`Switched to ${selectedUser.fullname || selectedUser.email}`);

    // Redirect based on role
    if (selectedUser.role === 'recruiter') navigate('/admin/companies');
    else navigate('/');
  };

  return (
    <div className='bg-white border-b'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
        <div>
          <h1 className='text-2xl font-bold'>
            Hire<span className='text-black'>Nest</span>
          </h1>
        </div>

        <div className='flex items-center gap-10'>
          {/* Menu Links */}
          <ul className='flex font-medium items-center gap-6'>
            <li><Link to='/'>Home</Link></li>
            {user?.role === 'recruiter' ? (
              <>
                <li><Link to='/admin/companies'>Companies</Link></li>
                <li><Link to='/admin/jobs'>Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to='/jobs'>Jobs</Link></li>
                <li><Link to='/browse'>Browse</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className='flex items-center gap-3'>
              <Link to='/login'><Button variant='outline'>Login</Button></Link>
              <Link to='/signup'><Button className='bg-[#6A38C2] hover:bg-[#5b30a6]'>Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className='flex items-center gap-3 cursor-pointer'>
                  <span className='font-medium'>{user?.fullname}</span>
                  <Avatar>
                    <AvatarImage
                      src={user?.profile?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.fullname}`}
                    />
                  </Avatar>
                </div>
              </PopoverTrigger>

              <PopoverContent className='w-80'>
                <div>
                  <div className='flex gap-3 items-center mb-3'>
                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.fullname}`}
                      />
                    </Avatar>
                    <div>
                      <h4 className='font-medium'>{user?.fullname}</h4>
                      <p className='text-sm text-muted-foreground'>{user?.profile?.bio || 'No bio added'}</p>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Link to='/profile'>
                      <Button variant='ghost' className='w-full flex gap-2 justify-start'>
                        <User2 size={18} /> View Profile
                      </Button>
                    </Link>

                    {/* Switch account dropdown */}
                    {savedUsers.length > 1 && (
                      <select
                        onChange={e => switchUser(JSON.parse(e.target.value))}
                        className='w-full border p-2 rounded'
                        defaultValue=''
                      >
                        <option value='' disabled>Switch Account</option>
                        {savedUsers.map(u => (
                          <option key={u.email} value={JSON.stringify(u)}>
                            {u.fullname || u.email}
                          </option>
                        ))}
                      </select>
                    )}

                    <Button
                      variant='ghost'
                      className='w-full flex gap-2 justify-start'
                      onClick={() => navigate('/login')}
                    >
                      <UserPlus2 size={18} /> Add another account
                    </Button>

                    <Button onClick={logoutHandler} variant='ghost' className='w-full flex gap-2 justify-start'>
                      <LogOut size={18} /> Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;