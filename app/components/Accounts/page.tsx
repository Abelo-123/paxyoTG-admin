"use client"
import { useState } from "react"
import { supabase } from "@/app/lib/supabaseClient"

const Accounts = () => {
    const [adminMessage, setAdminMessage] = useState('')
    const [adminMessageFor, setAdminMessageFor] = useState('')

    const sendAdminMessage = async () => {
        if (adminMessageFor) {
            const { error } = await supabase
                .from('adminmessage')
                .insert([
                    {
                        message: adminMessage, // Replace with your dynamic value if needed
                        for: adminMessageFor, // Replace with the desired value for the "for" column
                        from: "Admin", // Replace with the desired value for the "from" column
                    }
                ]);

            if (error) {
                console.error("Error inserting into adminmessage:", error);
            } else {
                const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).gt('id', 0); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {
                    window.alert("inserted")
                }
            }
        } else {
            const { error } = await supabase
                .from('adminmessage')
                .update([
                    {
                        message: adminMessage, // Replace with your dynamic value if needed
                        for: "all", // Replace with the desired value for the "for" column
                        from: "Admin", // Replace with the desired value for the "from" column
                    }
                ])
                .eq('for', 'all');


            if (error) {
                console.error("Error inserting into adminmessage:", error);
            } else {
                const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).gt('id', 0); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {
                    window.alert("inserted")
                }
            }
        }

    }
    return (
        <>
            <div className="w-screen bg-red-100 p-1">
                <input type="text" placeholder="message" onChange={(e) => setAdminMessage(e.target.value)} value={adminMessage} />
                <input type="text" placeholder="id" onChange={(e) => setAdminMessageFor(e.target.value)} value={adminMessageFor} />
                <button onClick={sendAdminMessage}>send</button>
            </div>
        </>
    );
}

export default Accounts;