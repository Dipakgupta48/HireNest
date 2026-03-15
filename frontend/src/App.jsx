import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/authSlice";
import { USER_API_END_POINT } from "./utils/constant";

import Navbar from './components/shared/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/admin/Companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from './components/admin/AdminJobs';
import PostJob from './components/admin/PostJob';
import EditJob from './components/admin/EditJob';
import Applicants from './components/admin/Applicants';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Layout with Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/browse', element: <Browse /> },
      { path: '/profile', element: <Profile /> },
      { path: '/description/:id', element: <JobDescription /> },
      // Admin routes (protected) – same Layout so Navbar with View Profile shows for recruiters
      { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
      { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
      { path: '/admin/companies/:id', element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
      { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
      { path: '/admin/jobs/create', element: <ProtectedRoute><PostJob /></ProtectedRoute> },
      { path: '/admin/jobs/:id/edit', element: <ProtectedRoute><EditJob /></ProtectedRoute> },
      { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          // DO NOT redirect here; navbar and protected routes handle it
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [dispatch]);

  return <RouterProvider router={appRouter} />;
}

export default App;