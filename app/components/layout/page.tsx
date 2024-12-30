"use client"
import { Avatar, Text } from "@telegram-apps/telegram-ui";
import { useUser } from '../UserContext'; // Adjust the path as necessary
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
const Lays = () => {
    //const [notificationModal, seeNotificationModal] = useState(false)
    const { userData } = useUser();
    //const [notificationMessage, setNotificationMessage] = useState([])

    const [balance, setBalance] = useState(0.0)




    useEffect(() => {
        const fetchBalance = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('balance')
                .eq('id', userData.userId)
                .single(); // Get a single row

            if (error) {
                console.error('Error fetching initial balance:', error);
            } else {
                setBalance(data.balance); // Set initial balance
            }
        }
        fetchBalance()
        supabase
            .channel(`users:id=eq.${userData.userId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userData.userId}` }, (payload) => {
                setBalance((payload.new as { balance: number }).balance); // Update balance on real-time changes

            })
            .subscribe();
    }, [])



    return (<>
        <div className="flex ">
            <div className="flex w-full " style={{ 'paddingTop': '20px', 'paddingLeft': '20px' }}>
                <div className='flex'>
                    <Avatar size={48} src={userData.profile}
                    />

                    <div className='flex flex-col justify-space-around mt-auto  ml-3'>
                        <Text weight="2">{userData.firstName} {userData.lastName}</Text>
                        <Text weight="3" style={{ 'fontSize': '13px' }}>Balance: {balance ? balance : "Loading"}</Text>
                    </div>
                </div>

            </div>

        </div>

    </>);
}

export default Lays;