"use client"
import React, { useEffect, useState } from 'react'
import ChatApp from '@/Components/Messages/ChatApp'
import dynamic from 'next/dynamic.js'
import PushNotificationLayout from '../firebaseNotification/PushNotificationLayout.jsx'
const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })

const Messages = () => {
    const [notificationData, setNotificationData] = useState(null);

    const handleNotificationReceived = (data) => {
        setNotificationData(data);
    };
    useEffect(() => { }, [notificationData])
    return (
        <PushNotificationLayout onNotificationReceived={handleNotificationReceived}>
            <VerticleLayout>
                <ChatApp notificationData={notificationData} />
            </VerticleLayout>
        </PushNotificationLayout>
    )
}

export default Messages
