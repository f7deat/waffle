"use client";

import { Drawer } from "antd";
import { useState } from "react";

const Start: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <div className="h-12 flex items-center justify-center bg-slate-900 text-white w-12 hover:text-blue-500" onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5" fill="currentColor">
                    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                </svg>
            </div>
            <Drawer open={open} onClose={() => setOpen(false)} placement="left" title="ALL">

            </Drawer>
        </>
    )
}

export default Start;