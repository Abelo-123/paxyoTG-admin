"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabaseClient"
import { useUser } from '../UserContext';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Select } from "@telegram-apps/telegram-ui";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import MyLoader from "../Loader/page";
import Swal from 'sweetalert2';

const John = () => {
    const [iframeKey, setIframeKey] = useState(0);
    const [adminMessage, setAdminMessage] = useState(null)
    const [adminMessageFor, setAdminMessageFor] = useState(null)
    const [adminMessageFor2, setAdminMessageFor2] = useState(null)
    const [all, setAll] = useState(null)
    const [indi, setIndi] = useState(null)
    const [rate, setRate] = useState('')
    const [service, setService] = useState([])
    const { setUserData, userData } = useUser();
    const [loader, setLoader] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [withdrawls, setWithdrawldata] = useState([])
    const [searchTerm, setSearchTerm] = useState(""); // State to track search input
    const [modalA, setModalA] = useState(false)
    const [amount, setAmount] = useState(null)
    const [bank, setBank] = useState(null)
    const [acc, setAcc] = useState(null)
    const [accountname, setAccountname] = useState('')
    const [depositmin, setDeposit] = useState(null)
    const [chapa, setChapa] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingb, setLoaderb] = useState(false)
    const [tg, setTg] = useState('')
    const [depo, setDepo] = useState([])
    const [depoo, setDepoo] = useState([])
    const [iframeVisible, setIframeVisible] = useState(false)
    //to specific user, to all user, to specific admin, to all admin

    useEffect(() => {

        // Load the Telegram Web App JavaScript SDK
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js?2";
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            const Telegram = window.Telegram;
            Telegram.WebApp.expand();
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.ready();

                const { user } = Telegram.WebApp.initDataUnsafe;

                const storageKey = `admindata_name_${user.id}`; // Unique key for each user (or mini-app)

                const userNameFromStorage = localStorage.getItem(storageKey);


                if (userNameFromStorage) {
                    //setAuthMsg(`User data already exists in localStorage: ${userNameFromStorage}`);
                    console.log('User data already exists in localStorage:', userNameFromStorage)
                    return; // Do not call the API if the data is already set
                } else {
                    if (user) {


                        try {


                            const { data: latestRow, error: fetchError } = await supabase
                                .from('panel')
                                .select('id')
                                .order('id', { ascending: false })
                                .limit(1); // Fetch only the latest row

                            if (fetchError) {
                                console.error('Error fetching latest row:', fetchError);
                                return;
                            }

                            const latestId = latestRow.length > 0 ? latestRow[0].id : 0; // Default to 0 if no rows exist

                            // Step 2: Insert new rows into the "panel" table
                            const newRows = [
                                {
                                    id: latestId + 1,
                                    value: '295',
                                    key: 'rate',
                                    father: userData.father,
                                    bigvalue: '1,9,4,6,3,,2,7,5,0',
                                    minmax: null,
                                    username: null,
                                    owner: user.id,
                                },
                                {
                                    id: latestId + 2,
                                    value: null,
                                    key: 'disabled',
                                    father: userData.father,
                                    bigvalue: '1,9,4,6,3,,2,7,5,0',
                                    minmax: null,
                                    username: null,
                                    owner: user.id,
                                },
                                {
                                    id: latestId + 3,
                                    value: null,
                                    key: 'minmax',
                                    father: userData.father,
                                    bigvalue: '1,9,4,6,3,,2,7,5,0',
                                    minmax: '2',
                                    username: null,
                                    owner: user.id,
                                },
                            ];

                            const { error: insertError } = await supabase
                                .from('panel')
                                .insert(newRows);


                            if (insertError) {
                                console.error('Error inserting data:', insertError);
                            } else {
                                const userName = user.username;

                                // Set user data in localStorage with a unique key
                                localStorage.setItem(storageKey, userName);
                                setUserData({
                                    username: user.username,
                                    firstName: user.first_name,
                                    lastName: user.last_name,
                                    userId: user.id,
                                    profile: user.photo_url,

                                });
                            }

                            // Store the name with a unique key
                            //const storedData = localStorage.getItem(`userdata_name_${user.id}`);

                            //setLs(`new set ${storedData}`)
                            // Use the name from the response
                        } catch (error) {
                            console.error("Error adding user:", error);
                        }
                    }
                }

            } else {
                console.error("Telegram Web App API not loaded");
            } // Adjust timeout as necessary


        };


        return () => {

            document.body.removeChild(script);

        };
    }, []);

    const sendAdminMessage = async () => {
        if (!adminMessageFor && !adminMessageFor2 && all == "admin") { //all admin

            const { error: findErrorB } = await supabase.from('adminmessage').update({ message: adminMessage, seen: null }).eq('to', 'Admin').gt('id', 0); // Update all rows where `did` is greater than 0
            if (findErrorB) {
                console.error(findErrorB.message)
            } else {
                window.alert("sending all admin")
                setAdminMessageFor('')
                setAdminMessageFor2('')
                setAdminMessage('')
                setAll('')
            }

        } else if (adminMessageFor && !adminMessageFor2) { //specific user
            const { error } = await supabase
                .from('adminmessage')
                .insert([
                    {
                        message: adminMessage, // Replace with your dynamic value if needed
                        for: adminMessageFor, // Replace with the desired value for the "for" column
                        from: "Admin",
                        father: userData.userId,
                    }
                ]);

            if (error) {
                console.error("Error inserting into adminmessage:", error);
            } else {
                const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).eq('for', adminMessageFor).eq('father', userData.Id).gt('id', 0); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {

                    setAdminMessageFor('')
                    setAdminMessageFor2('')
                    setAdminMessage('')
                    setAll('')
                }
            }
        } else if (!adminMessageFor && adminMessageFor2) { //specici admin
            const { error } = await supabase
                .from('adminmessage')
                .insert([
                    {
                        message: adminMessage, // Replace with the desired value for the "for" column
                        from: "Admin", // Replace with the desired value for the "from" column
                        to: adminMessageFor2,
                    }
                ]);

            if (error) {
                console.error("Error inserting into adminmessage:", error);
            } else {
                const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).eq('to', adminMessageFor2).gt('id', 0); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {
                    window.alert("sendind specific admin")
                    setAdminMessageFor('')
                    setAdminMessageFor2('')
                    setAdminMessage('')
                    setAll('')
                }
            }
        } else if (!adminMessageFor && !adminMessageFor2 && all == "user") { //all use
            const { error: findErrorB } = await supabase.from('adminmessage').update({ message: adminMessage, seen: null }).eq('father', userData.userId).eq('for', 'all').gt('id', 0); // Update all rows where `did` is greater than 0
            if (findErrorB) {
                console.error(findErrorB.message)
            } else {
                window.alert("sending all users")
                setAdminMessageFor('')
                setAdminMessageFor2('')
                setAdminMessage('')
                setAll('')
            }
        }
        else if (!adminMessageFor && !adminMessageFor2 && all == "adminuser") { //all user and admin
            const { error } = await supabase
                .from('adminmessage')
                .insert([
                    {
                        message: adminMessage, // Replace with your dynamic value if needed
                        for: 'all', // Replace with the desired value for the "for" column
                        from: "Admin",
                        father: userData.userId,
                        to: "Admin"
                    }
                ]);

            if (error) {
                console.error("Error inserting into adminmessage:", error);
            } else {
                const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).eq('father', userData.userId).eq('for', 'all').gt('id', 0); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {
                    window.alert("sending all users")
                    setAdminMessageFor('')
                    setAdminMessageFor2('')
                    setAdminMessage('')
                    setAll('')
                }
            }
        }




    }


    useEffect(() => {
        const fetchRate = async () => {

            const { data: setNotify, error: setError } = await supabase
                .from('panel')
                .select('value')
                .eq('father', userData.father)
                .eq('key', 'rate')
                .single()

            if (setError) {
                console.error('Error fetching initial balance:', setError)
            } else {
                setRate(setNotify.value)
                const { data, error: fetchError } = await supabase
                    .from('panel')
                    .select('bigvalue')
                    .eq('father', userData.firstName)
                    .eq('owner', userData.userId)
                    .eq('key', 'disabled')
                    .single(); // Assumes a single row or adjusts query if needed

                if (fetchError) {
                    console.log(fetchError.message)
                } else {
                    setUserData((prevNotification) => ({
                        ...prevNotification, // Spread the previous state
                        recentDisabled: [...prevNotification.recentDisabled, data.bigvalue], // Append new value to the array

                        // Update the `deposit` field
                    }));

                }
            }
        }
        const fetchMinMax = async () => {

            const { data, error: findErrorC } = await supabase
                .from("panel")
                .select('minmax')
                .eq('father', userData.father)
                .eq('key', 'minmax')// Pass 100 as a string
                .single()

            if (findErrorC) {
                console.log(findErrorC.message)
            } else {
                setDeposit(data.minmax)
            }


        }
        fetchRate();
        fetchMinMax();


        // Cleanup the subscription on component unmount

    }, [])

    useEffect(() => {
        supabase
            .channel("panel_channel")
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "panel" }, (payload) => {
                //console.log("New order inserted:", payload.new);
                // Add the new order to the state
                setUserData((prevNotification) => ({
                    ...prevNotification, // Spread the previous state
                    recentDisabled: [...prevNotification.recentDisabled, payload.new.bigvalue], // Append new value to the array

                    // Update the `deposit` field
                }));

                //console.log(payload.new)
            })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "admin_withdrawl" }, (payload) => {
                //console.log("New order inserted:", payload.new);
                // Add the new order to the state
                if (payload.new.for == userData.current) {
                    setWithdrawldata((prevWith) =>
                        prevWith.map((item) =>
                            item.wid === payload.new.wid
                                ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                                : item // Keep the other items unchanged
                        )
                    );
                }

                //console.log(payload.new)
            })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "admin_deposit" }, (payload) => {
                //console.log("New order inserted:", payload.new);
                // Add the new order to the state
                if (payload.new.father == userData.father) {
                    setDepo((prevWith) =>
                        prevWith.map((item) =>
                            item.wid === payload.new.wid
                                ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                                : item // Keep the other items unchanged
                        )
                    );
                    setDepoo((prevWith) =>
                        prevWith.map((item) =>
                            item.wid === payload.new.wid
                                ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                                : item // Keep the other items unchanged
                        )
                    );
                }

                //console.log(payload.new)
            })




            .subscribe();
    }, [])

    const updateRate = async () => {
        const { error: findErrorC } = await supabase.from('panel').update({ value: parseInt(rate) }).eq('father', userData.father).eq('key', 'rate'); // Update all rows where `did` is greater than 0
        if (findErrorC) {
            console.error(findErrorC.message)
        } else {
            console.log("updated")
        }
    }

    useEffect(() => {
        const fetchServices = async () => {

            try {
                const response = await axios.get('/api/smm/fetchService');
                console.log(response.data.response)
                setService(response.data.response); // Store all services
                // Initially, show all services
            } catch (error) {
                console.error('Error fetching services:', error);
            }


        };

        fetchServices();
    }, []);


    const filteredServices = service.filter(
        (items) =>
            items.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            items.service.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleDisable = async (id) => {
        try {
            // Fetch the current value of "bigvalue" from the "panel" table

            setUserData((prevNotification) => ({
                ...prevNotification, // Spread the previous state
                recentDisabled: [...prevNotification.recentDisabled, `${userData.recentDisabled},${id}`], // Append new value to the array

                // Update the `deposit` field
            }));
            let updatedValue = id;

            // Append the new value to the existing data if it exists
            if (userData.recentDisabled) {
                updatedValue = `${userData.recentDisabled},${id}`;
            }

            // Update the "bigvalue" column in the "panel" table
            const { error: updateError } = await supabase
                .from('panel')
                .update({ bigvalue: updatedValue })
                .eq('father', userData.firstName)
                .eq('owner', userData.userId)
                .eq('key', 'disabled')

            if (updateError) throw updateError;


            console.log('Updated successfully:', updatedValue);
        } catch (error) {
            console.error('Error updating bigvalue:', error.message);
        }
    }

    const getServiceName = (serviceId) => {
        const foundService = service.find((s) => s.service === serviceId); // Match by serviceId
        return foundService ? foundService.name : "Unknown Service"; // Return name or fallback
    };

    const handleEnable = async (id) => {

        try {
            // Fetch the current 'bigvalue' data from the 'panel' table
            const { data, error } = await supabase
                .from('panel')
                .select('bigvalue')
                .eq('key', 'disabled')
                .eq('father', userData.firstName)
                .eq('owner', userData.userId)// Filter based on the 'father' or any other condition
                .single();

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            // Split the bigvalue into an array
            let bigValueArray = String(data.bigvalue || "").split(",");

            // Filter out the ID from the array (if necessary)
            bigValueArray = bigValueArray.filter((item) => item !== id.toString());

            // Join the array back into a comma-separated string
            const updatedBigValue = bigValueArray.join(",");
            setUserData((prevNotification) => ({
                ...prevNotification, // Spread the previous state
                recentDisabled: updatedBigValue, // Remove the ID from the array
            }));
            // Update the 'bigvalue' column in the 'panel' table
            const { error: updateError } = await supabase
                .from('panel')
                .update({ bigvalue: updatedBigValue })
                .eq('father', userData.firstName)
                .eq('owner', userData.userId)// Filter by correct row

            if (updateError) {
                console.error('Error updating bigvalue:', updateError);
            } else {


                console.log('Bigvalue updated successfully');

                // Now update `recentDisabled` in the userData state
                setUserData((prevNotification) => {
                    // Split current recentDisabled and remove duplicates
                    const recentDisabledArray = [
                        ...new Set(String(prevNotification.recentDisabled || "").split(",")),
                        ...bigValueArray, // Add the updated bigValueArray
                    ];

                    // Join the array back into a string and update the state
                    return {
                        ...prevNotification,
                        recentDisabled: recentDisabledArray.join(","),
                    };
                });
            }
        } catch (error) {
            console.error('Error in handleEnable:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase()); // Update search term
    };

    useEffect(() => {
        const fetchWithdrawl = async () => {
            setLoader(true)
            const { data: setWithdrawl, error: setError } = await supabase
                .from('admin_withdrawl')
                .select('*')
                .eq('for', userData.current)

            if (setError) {
                console.error('Error fetching initial balance:', setError)
            } else {
                setLoader(false)
                setWithdrawldata(setWithdrawl)
            }
        }

        fetchWithdrawl()
        // console.log(userData.recentDisabled)
    }, [])

    const addWithdrawl = async () => {
        const wid = Math.floor(10000 + Math.random() * 90000); // generates a 5-digit random number

        const { error: setError } = await supabase
            .from('admin_withdrawl')
            .insert([{
                for: userData.current,
                bank: bank,
                a_name: accountname,
                a_no: acc,
                wid: wid,
                amount: amount
            }])


        if (setError) {
            console.error('Error fetching initial balance:', setError)
        } else {
            setWithdrawldata((prevWith) => (
                [...prevWith, { status: 'Pending', date: new Date().toISOString(), wid: wid, for: userData.current, bank: bank, a_name: accountname, a_no: acc, amount: amount }]

            ))
        }
    }

    const sendDeposit = async (id) => {
        const { error: findErrorB } = await supabase.from('admin_withdrawl').update({ status: 'Sent' }).eq('wid', id); // Update all rows where `did` is greater than 0
        if (findErrorB) {
            console.error(findErrorB.message)
        } else {
            setWithdrawldata((prevWith) =>
                prevWith.map((item) =>
                    item.wid === id
                        ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                        : item // Keep the other items unchanged
                )
            );

        }
    }

    const sendDeposita = async (id) => {
        const { error: findErrorB } = await supabase.from('admin_deposit').update({ status: 'Sent' }).eq('tid', id); // Update all rows where `did` is greater than 0
        if (findErrorB) {
            console.error(findErrorB.message)
        } else {
            setDepo((prevWith) =>
                prevWith.map((item) =>
                    item.tid === id
                        ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                        : item // Keep the other items unchanged
                )
            );
            setDepoo((prevWith) =>
                prevWith.map((item) =>
                    item.tid === id
                        ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                        : item // Keep the other items unchanged
                )
            );

        }
    }

    const updateDeposit = async () => {
        const { error: findErrorB } = await supabase.from('panel').update({ minmax: depositmin }).eq('father', userData.father).eq('key', 'minmax'); // Update all rows where `did` is greater than 0
        if (findErrorB) {
            console.error(findErrorB.message)
        } else {
            // alert("ola")
        }
    }
    const generateIframeSrc = () => {
        return `https://paxyo.com/chapa.html?amount=1`;

        // Return an empty string if the amount is not valid
    };
    const send = async (mess) => {

        const { error } = await supabase.from('admin_deposit').insert([
            { tid: mess, amount: 3000, status: 'Pending', father: userData.father }
        ]);
        if (error) {
            console.error(error.message)
        } else {
            setChapa(false)
            alert(mess)
            setDepo((prevData) => [...prevData, {
                status: "Pending",
                date: new Date().toISOString(),
                tid: mess,
                amount: 3000
            }]);
            setDepoo((prevData) => [...prevData, {
                status: "Pending",
                date: new Date().toISOString(),
                tid: mess,
                amount: 3000
            }]);
        }
    }

    useEffect(() => {

        const fetchDepo = async () => {
            setLoaderb(true)
            const { data: desposit, error: setError } = await supabase
                .from('admin_deposit')
                .select('*')
                .eq('father', userData.father)


            if (setError) {
                console.error('Error fetching initial balance:', setError)
            } else {
                setLoaderb(false)
                setDepoo(desposit)
                setDepo(desposit)
            }
        }
        fetchDepo()
    }, [])

    useEffect(() => {
        const handleMessage = (event) => {
            // Validate the origin to ensure the message is from the expected source
            if (event.origin !== 'https://paxyo.com') return;

            const { type, message } = event.data;

            // Handle different message types
            if (type === 'payment-success') {
                //console.log(message); // e.g., "Payment was successful!"
                setChapa(false)
                //setAgain(true); // Set to true to show the container
                setIframeVisible(false); // Make iframe visible again
                Swal.fire({
                    title: 'Success!',
                    text: 'The operation was successful.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-popup',    // Apply the custom class to the popup
                        title: 'swal2-title',    // Apply the custom class to the title
                        confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                        cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                    }
                });


                send(message);



            } else if (type === 'payment-failure' || type === 'payment-closed') {
                //console.error(message); // Handle failure or closed event
                // setChapa(false)
                setTg(message)
                // Hide container and show iframe
                setIframeVisible(false);


                // Hide iframe on failure or closed event

            } else if (type === 'payment-closed') {
                //setChapa(false)
                setTg(message)
                //  console.log(message); // e.g., "Payment popup closed."
                setIframeVisible(false);

                // Hide iframe on close

            }
        };

        // Add the message listener
        window.addEventListener('message', handleMessage);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <>

            <div className="block flex flex-col w-full bg-blue-100">
                <div className="bg-red-100 p-2">
                    <div className="flex flex-col">
                        <i>admin message</i>

                        all: <input type="text" placeholder="admin | user" onChange={(e) => {
                            setAll(e.target.value)
                            setIndi(e.target.value)
                        }} value={all} />
                        adminId: {!indi && (<input type="text" placeholder=" adminId " onChange={(e) => setAdminMessageFor2(e.target.value)} value={adminMessageFor2} />)}
                        message: <input type="text" placeholder="message" onChange={(e) => setAdminMessage(e.target.value)} value={adminMessage} />
                        userid: {!indi && (<input type="text" placeholder="userid" onChange={(e) => setAdminMessageFor(e.target.value)} value={adminMessageFor} />)}
                        <button className="bg-blue-200" onClick={sendAdminMessage}>send</button>
                    </div>
                </div>
                <div className="bg-red-100 block p-2">
                    <i> rate</i><br />
                    <input type="text" placeholder="userid" onChange={(e) => setRate(e.target.value)} value={rate} />
                    <button className="bg-blue-200" onClick={updateRate}>send</button>
                </div>
                <div style={{ height: '5rem', overflow: 'auto' }} className="bg-red-100 p-2">
                    <i>disable</i><br />
                    <input
                        type="text"
                        placeholder="Search by name or service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />

                    <ul>
                        {filteredServices
                            .filter((items) => {
                                const disabledArray = String(userData.recentDisabled || "").split(","); // Ensure it is a string
                                return !disabledArray.includes(String(items.service)); // Check if service is not in the array
                            })
                            .map((items, index) => (
                                <li key={index}>
                                    <div className="w-full p-2 bg-blue-100">
                                        {items.service} --{items.name}
                                        <button
                                            className="px-6 p-2 bg-blue-600 ml-4 text-white"
                                            onClick={() => handleDisable(items.service)}
                                        >
                                            disable
                                        </button>
                                    </div>
                                </li>
                            ))}

                    </ul>
                    <br />

                </div>
                <div style={{ height: '5rem', overflow: 'auto' }} className="bg-red-100 p-2">
                    <i>enable</i><br />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by service ID or name"
                        className="p-2 mb-4 border rounded"
                    />

                    {/* Displaying the filtered list */}
                    <ul>
                        {[...new Set(String(userData.recentDisabled || "").split(","))] // Remove duplicates
                            .filter((serviceId) => serviceId.length >= 2) // Filter by serviceId length >= 2
                            .filter((serviceId) => {
                                const serviceName = getServiceName(serviceId).toLowerCase(); // Get name and convert it to lowercase
                                const serviceIdString = serviceId.toString().toLowerCase(); // Ensure serviceId is a string and lowercase for case-insensitive search

                                return (
                                    serviceIdString.includes(searchTerm) || serviceName.includes(searchTerm) // Search by serviceId or name
                                );
                            })
                            .map((serviceId, index) => (
                                <li key={index}>
                                    <div className="w-full p-2 bg-blue-100">
                                        {serviceId} - {getServiceName(serviceId)}
                                        <button
                                            className="px-6 p-2 bg-blue-600 ml-4 text-white"
                                            onClick={() => handleEnable(serviceId)}
                                        >
                                            enable
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="bg-red-100 p-2">
                    <i>deposit min</i><br />
                    <input type="text" placeholder="min" onChange={(e) => setDeposit(e.target.value)} value={depositmin} />
                    <button className="bg-blue-200" onClick={updateDeposit}>send</button>
                </div>
                <div className="bg-red-100 p-2">
                    <i>deposit</i><br />
                    <button className="bg-blue-200" onClick={() => {
                        setChapa(true)
                        setTg('')
                    }
                    }>send</button>
                    {loadingb && <MyLoader />}
                    {!loadingb &&
                        <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        tid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">bank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">sccout number</th>

                                </tr>
                            </thead>
                            <tbody className=" ">
                                {depo.map((items, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm">{items.status}</td>
                                        <td className="px-6 py-4 text-sm ">{items.tid}</td>

                                        <td className="px-6 py-4 text-sm ">{items.date}</td>
                                        <td className="px-6 py-4 text-sm ">{items.amount}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    <br />
                    {!loadingb &&
                        <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        action
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        tid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">bank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">sccout number</th>

                                </tr>
                            </thead>
                            <tbody className=" ">
                                {depoo.map((items, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm">
                                            {items.status !== "Sent" && (
                                                <button onClick={() => sendDeposita(items.tid)}>add</button>
                                            )}

                                        </td>                                            <td className="px-6 py-4 text-sm">{items.status}</td>
                                        <td className="px-6 py-4 text-sm ">{items.tid}</td>

                                        <td className="px-6 py-4 text-sm ">{items.date}</td>
                                        <td className="px-6 py-4 text-sm ">{items.amount}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
                <div className="bg-red-100 p-4">
                    <i>withdrawl</i><br />
                    <button onClick={() => setModalA(true)}>open</button>
                    {modalA && (
                        <div
                            className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                            onClick={() => setModalA(false)}
                        >
                            <div
                                className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                                onClick={(e) => e.stopPropagation()}
                                style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                            // Prevent clicking inside the modal from closing it
                            >
                                <div

                                    className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                                    onClick={() => setModalA(false)}
                                >
                                    <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                                </div>
                                <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>
                                <p className="mb-4">Enter the amount you want to deposit:</p>

                                <div className="amount-container">
                                    <Select header="bank" value={bank} onChange={(e) => setBank(e.target.value)}>
                                        <option value="">Select an option</option>
                                        <option>CBE</option>
                                        <option>Telebirr</option>
                                    </Select>
                                    <Input
                                        header="account name"
                                        type="text"
                                        className="w-full"
                                        placeholder="account name"
                                        value={accountname}
                                        onChange={(e) => setAccountname(e.target.value)}

                                    />
                                    <Input
                                        header="acc no"
                                        type="text"
                                        className="w-full"
                                        placeholder="Enter acc"
                                        value={acc}

                                        onChange={(e) => setAcc(Number(e.target.value))}
                                    />

                                    <Input
                                        header="Amount"
                                        type="text"
                                        className="w-full"
                                        placeholder="Enter amount"
                                        value={amount}

                                        onChange={(e) => setAmount(Number(e.target.value))}
                                    />




                                    <Button
                                        onClick={addWithdrawl}
                                        className="w-full p-4"
                                        disabled={amount <= 1}
                                        style={{ marginTop: '10px', padding: '10px', backgroundColor: amount > 1 ? 'var(--tgui--button_color)' : 'gray', color: 'white' }}
                                    >
                                        Withdrawl
                                    </Button>


                                </div>
                                <br />


                            </div>
                        </div>
                    )}
                    {chapa && (
                        <div
                            className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                            onClick={() => setChapa(false)}
                        >
                            <div
                                className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                                onClick={(e) => e.stopPropagation()}
                                style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                            // Prevent clicking inside the modal from closing it
                            >
                                <div

                                    className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                                    onClick={() => setChapa(false)}
                                >
                                    <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                                </div>
                                <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>
                                <p className="mb-4">Enter the amount you want to deposit:</p>

                                <div className="amount-container">

                                    <Input
                                        header="Amount"
                                        type="text"
                                        className="w-full"
                                        placeholder="amount"
                                        value="30000"
                                        disabled={true}

                                    />



                                    <Button
                                        onClick={() => {
                                            setIframeKey((prevKey) => prevKey + 1)
                                            setIframeVisible(true)
                                            setLoading(true)
                                        }}
                                        className="w-full p-4"
                                        style={{ marginTop: '10px', padding: '10px', backgroundColor: 'var(--tgui--button_color)', color: 'white' }}
                                    >
                                        Withdrawl
                                    </Button>
                                    <br />
                                    {tg}
                                    <br />
                                    {loading && <MyLoader />}
                                    {iframeVisible && (
                                        <iframe
                                            key={iframeKey} // Use key to force iframe reload
                                            src={generateIframeSrc()} // Dynamically set iframe src
                                            width="100%"
                                            height="310rem"
                                            onLoad={() => {
                                                setLoading(false)
                                            }}
                                            title="Embedded HTML"
                                            frameBorder="0"
                                        />
                                    )}

                                </div>
                                <br />


                            </div>
                        </div>
                    )}
                    {!loader &&
                        <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        wid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">bank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        account name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">sccout number</th>

                                </tr>
                            </thead>
                            <tbody className=" ">
                                {withdrawls.map((items, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm">{items.status}</td>
                                        <td className="px-6 py-4 text-sm ">{items.wid}</td>

                                        <td className="px-6 py-4 text-sm ">{items.amount}</td>
                                        <td className="px-6 py-4 text-sm ">{items.date}</td>
                                        <td className="px-6 py-4 text-sm ">{items.bank}</td>
                                        <td className="px-6 py-4 text-sm ">{items.a_name}</td>
                                        <td className="px-6 py-4 text-sm ">{items.a_no}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    <i>admin withdrawl</i><br />
                    {!loader &&
                        <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        wid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">bank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                        account name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">sccout number</th>

                                </tr>
                            </thead>
                            <tbody className=" ">
                                {withdrawls.map((items, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm">
                                            {items.status !== "Sent" && (
                                                <button onClick={() => sendDeposit(items.wid)}>add</button>
                                            )}

                                        </td>
                                        <td className="px-6 py-4 text-sm">{items.status}</td>
                                        <td className="px-6 py-4 text-sm ">{items.wid}</td>

                                        <td className="px-6 py-4 text-sm ">{items.amount}</td>
                                        <td className="px-6 py-4 text-sm ">{items.date}</td>
                                        <td className="px-6 py-4 text-sm ">{items.bank}</td>
                                        <td className="px-6 py-4 text-sm ">{items.a_name}</td>
                                        <td className="px-6 py-4 text-sm ">{items.a_no}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>

            </div >
        </>
    );
}

export default John;