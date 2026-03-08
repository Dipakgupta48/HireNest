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
import { useSelector } from 'react-redux'

const UpdateProfileDialog = ({ open, setOpen }) => {

    const { user } = useSelector(store => store.auth)

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

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(input)
        setOpen(false)
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

                    <div>
                        <Label>Resume</Label>
                        <Input
                            type="file"
                            onChange={fileChangeHandler}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Update
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog