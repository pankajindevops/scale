"use client";
import { useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import useAppStore from '@/store/appStore';
import CreateEvent from "./createTeamcharter";

export default function teamcharterDrawer() {
    const { isTeamcharterDrawer, updateIsTeamcharterDrawer } = useAppStore();
    const [isOpenEvent, setIsOpenEvent] = useState(false);

    useEffect(() => {
        if (isTeamcharterDrawer) {
            setIsOpenEvent(true);
        } else {
            setIsOpenEvent(false);
        }
    }, [isTeamcharterDrawer])


    const toggleDrawer = () => (e) => {
        if (e.key === 'Escape') {
            updateIsTeamcharterDrawer(false);
        }
    };

    return (
        <>
            <Drawer
                anchor='right'
                open={isOpenEvent}
                onClose={toggleDrawer()}
                PaperProps={{
                    sx: { width: "47%" },
                }}
            >
                <CreateEvent />
            </Drawer>
        </>
    )
}