import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {

    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(",") || "",
        file: null
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const fileChangeHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("fullname", input.fullname);
            formData.append("email", input.email);
            formData.append("phoneNumber", input.phoneNumber);
            formData.append("bio", input.bio);
            formData.append("skills", input.skills);
            if (input.file) {
                // field name must match multer.single("logo")
                formData.append("logo", input.file);
            }

            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile updated successfully.");
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            const message = error?.response?.data?.message || "Failed to update profile.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler} className='space-y-4'>

                    <div>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div>
                        <Label>Bio</Label>
                        <Input
                            type="text"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div>
                        <Label>Skills (comma separated)</Label>
                        <Input
                            type="text"
                            name="skills"
                            value={input.skills}
                            onChange={changeEventHandler}
                        />
                    </div>

                    {user?.role !== 'recruiter' && (
                        <div>
                            <Label>Resume</Label>
                            <Input
                                type="file"
                                onChange={fileChangeHandler}
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog