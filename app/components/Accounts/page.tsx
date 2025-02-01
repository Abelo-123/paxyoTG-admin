"use client"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/app/lib/supabaseClient"
import { Button, Input, Select } from "@telegram-apps/telegram-ui"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useUser } from '../UserContext';
import axios from "axios";
import MyLoader from "../Loader/page";
import Swal from "sweetalert2";

const Accounts = () => {

    const { setUserData, userData } = useUser()
    const [modalA, setModalA] = useState(false)
    const [modalB, setModalB] = useState(false)
    const [modalC, setModalC] = useState(false)
    const [modalD, setModalD] = useState(false)
    const [modalE, setModalE] = useState(false)
    const [modalF, setModalF] = useState(false)
    const [modalG, setModalG] = useState(false)
    const [modalH, setModalH] = useState(false)
    const [modalI, setModalI] = useState(false)
    const [modalj, setModalj] = useState(false)
    const [modalww, setModalww] = useState(false)
    const [modalee, setModalee] = useState(false)
    const [modalii, setModalii] = useState(false)

    const [modalff, setModalff] = useState(false)


    const [all, setAll] = useState(null)
    const [indi, setIndi] = useState(null)
    const [adminMessageFor, setAdminMessageFor] = useState(null)
    const [adminMessageFor2, setAdminMessageFor2] = useState(null)
    const [adminMessage, setAdminMessage] = useState(null)
    const [rate, setRate] = useState('')
    const [allrate, setallRate] = useState('')
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [services, setService] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [iframe1Visible, setIframe1Visible] = useState(false);
    const [iframe2Visible, setIframe2Visible] = useState(false);
    const [iframe31Visible, setIframe31Visible] = useState(false);
    const [iframe32Visible, setIframe32Visible] = useState(false);
    const [iframe33Visible, setIframe33Visible] = useState(false);
    const [iframe34Visible, setIframe34Visible] = useState(false);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [tb, setTb] = useState('')
    const [tg, setTg] = useState('')
    const [but, setBut] = useState(true)
    const [depo, setDepo] = useState([])
    const [again, setAgain] = useState(true);
    const [depob, setDepob] = useState([])
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [depoo, setDepoo] = useState([])
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [loadingb, setLoaderb] = useState(false)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [amount, setAmount] = useState(null)
    const [bank, setBank] = useState(null)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [loader, etLoader] = useState(false)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [acc, setAcc] = useState(null)
    const [accountname, setAccountname] = useState('')
    const [withdrawls, setWithdrawldata] = useState([])
    const [reports, setReports] = useState([])
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [withdrawlo, setWithdrawldatao] = useState([])
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [depositmin, setDeposit] = useState(null)
    const [mm, setMm] = useState(null)
    const [rr, setRr] = useState(null)
    const [loadingc, setLoadingc] = useState(false);


    const [oid, setOID] = useState(""); // Default to empty string

    const [reason, setReason] = useState<{ status: string; oid: string; report: string; date: string }[]>([]);

    const handleReport = () => {
        setReason((prevReason) => [
            ...prevReason,
            {
                status: "Pending",
                oid: oid,
                report: reason[0]?.report || "",  // Ensure it's accessing a valid value
                date: new Date().toISOString(),
            },
        ]);

        setModalff(false);
    };


    const sendAdminMessage = async () => {
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

                if (!adminMessageFor && !adminMessageFor2 && all == "admin") { //all admin

                    const { error: findErrorB } = await supabase.from('adminmessage').update({ message: adminMessage, seen: null }).eq('to', 'Admin').eq('father', user.id); // Update all rows where `did` is greater than 0
                    if (findErrorB) {
                        console.error(findErrorB.message)
                    } else {
                        window.alert("sending all admin")
                        setAdminMessageFor('')
                        setAdminMessageFor2('')
                        setAdminMessage('')
                        setAll('')
                    }

                } else if (!adminMessageFor && adminMessageFor2) { //specific user
                    const { error } = await supabase
                        .from('users')
                        .select('id')
                        .eq("father", adminMessageFor2)
                        .single()



                    if (error) {
                        alert(error);
                    } else {
                        const { error } = await supabase
                            .from('adminmessage')
                            .insert([
                                {
                                    message: adminMessage, // Replace with your dynamic value if needed
                                    for: adminMessageFor2, // Replace with the desired value for the "for" column
                                    from: "Admin",
                                    father: userData.userId,
                                }
                            ]);

                        if (error) {
                            console.error("Error inserting into adminmessage:", error);
                        } else {
                            const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).eq('for', adminMessageFor).eq('father', user.id).gt('id', 0); // Update all rows where `did` is greater than 0
                            if (findErrorB) {
                                console.error(findErrorB.message)
                            } else {
                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Message sent to user.',
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                    customClass: {
                                        popup: 'swal2-popup',    // Apply the custom class to the popup
                                        title: 'swal2-title',    // Apply the custom class to the title
                                        confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                                        cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                                    }
                                });
                                setIndi(null)
                                setAdminMessageFor('')
                                setAdminMessageFor2('')
                                setAdminMessage('')
                                setAll('')
                            }
                        }
                    }
                } else if (adminMessageFor && !adminMessageFor2) { //specici admin
                    const { error } = await supabase
                        .from('adminmessage')
                        .insert([
                            {
                                message: adminMessage, // Replace with the desired value for the "for" column
                                from: "Admin", // Replace with the desired value for the "from" column
                                to: adminMessageFor,
                                seen: true,
                                father: user.id
                            }
                        ]);

                    if (error) {
                        console.error("Error inserting into adminmessage:", error);
                    } else {
                        window.alert("sendind specific admin")
                        setAdminMessageFor('')
                        setAdminMessageFor2('')
                        setAdminMessage('')
                        setAll('')
                    }
                } else if (!adminMessageFor && !adminMessageFor2 && all == "user") { //all use
                    const { error: findErrorB } = await supabase.from('adminmessage').update({ message: adminMessage, seen: null }).eq('father', user.id).eq('for', 'all'); // Update all rows where `did` is greater than 0
                    if (findErrorB) {
                        console.error(findErrorB.message)
                    } else {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Message sent to all users',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            customClass: {
                                popup: 'swal2-popup',    // Apply the custom class to the popup
                                title: 'swal2-title',    // Apply the custom class to the title
                                confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                                cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                            }
                        });
                        setIndi(null)
                        setAdminMessageFor('')
                        setAdminMessageFor2('')
                        setAdminMessage('')
                        setAll('')
                        setModalA(false)
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
                        const { error: findErrorB } = await supabase.from('adminmessage').update({ seen: true }).eq('father', 779060335).eq('for', 'all').gt('id', 0); // Update all rows where `did` is greater than 0
                        if (findErrorB) {
                            console.error(findErrorB.message)
                        } else {
                            Swal.fire({
                                title: 'Success!',
                                text: 'Message sent to all users.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                customClass: {
                                    popup: 'swal2-popup',    // Apply the custom class to the popup
                                    title: 'swal2-title',    // Apply the custom class to the title
                                    confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                                    cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                                }
                            });
                            setAdminMessageFor('')
                            setAdminMessageFor2('')
                            setAdminMessage('')
                            setAll('')
                        }
                    }
                }


            }
        }

    }
    const updateRate = async () => {
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

                const { error: findErrorC } = await supabase.from('panel').update({ value: parseInt(rate) }).eq('owner', user.id).eq('key', 'rate'); // Update all rows where `did` is greater than 0
                if (findErrorC) {
                    console.error(findErrorC.message)
                } else {
                    setModalB(false)
                    Swal.fire({
                        title: 'Success!',
                        text: 'Rate updated.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-popup',    // Apply the custom class to the popup
                            title: 'swal2-title',    // Apply the custom class to the title
                            confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                            cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                        }
                    });
                }
            }
        }
    }
    const updateAllRate = async () => {
        const { error: findErrorC } = await supabase.from('panel').update({ allrate: parseInt(allrate) }); // Update all rows where `did` is greater than 0
        if (findErrorC) {
            console.error(findErrorC.message)
        } else {
            setallRate('')

            console.log("updated")
        }
    }

    useEffect(() => {
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
                const deposit = async () => {

                    // Fetch the initial data (orders) from Supabase or any other source
                    const { data: depositForEach, error } = await supabase
                        .from("admin_deposit")
                        .select("*")
                        .eq('admin', userData.userId)

                    if (error) {
                        console.log(error);
                    } else {
                        setDepo(depositForEach)

                        const { data: depositForAdmin, error } = await supabase
                            .from("admin_deposit")
                            .select("*")

                        if (error) {
                            console.log(error);
                        } else {
                            setDepoo(depositForAdmin)
                            const { data: withdrawlForEach, error } = await supabase
                                .from("admin_withdrawl")
                                .select("*")
                                .eq('for', user.id)

                            if (error) {
                                console.log(error);
                            } else {
                                setWithdrawldata(withdrawlForEach)
                                const { data: withdrawlForAdmin, error } = await supabase
                                    .from("admin_withdrawl")
                                    .select("*")

                                if (error) {
                                    console.log(error);
                                } else {
                                    setWithdrawldatao(withdrawlForAdmin)
                                    const { data: amountForEach, error } = await supabase
                                        .from("admin_amount")
                                        .select("*")
                                        .eq('father', user.id)

                                    if (error) {
                                        console.log(error);
                                    } else {
                                        setDepob(amountForEach)

                                        const { data: panelDisable, error } = await supabase
                                            .from("panel")
                                            .select("bigvalue")
                                            .eq('owner', user.id)


                                        if (error) {
                                            console.log(error);
                                        } else {
                                            setUserData((prevNotification) => ({
                                                ...prevNotification, // Spread the previous state
                                                recentDisabled: panelDisable[2].bigvalue, // Fallback to `false` if undefined
                                            }));

                                            const { data: mindepo, error } = await supabase
                                                .from("panel")
                                                .select("minmax")
                                                .eq('owner', user.id)


                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log(mindepo[2].minmax)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                deposit();
            }
        }
    }, [])

    const filteredList = useMemo(() => {
        const disabledArray = new Set(String(userData.recentDisabled || "").split(","));

        const filtered = services
            .filter((item) => {
                const isNotDisabled = !disabledArray.has(String(item.service));
                const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(item.service).toLowerCase().includes(searchQuery.toLowerCase());
                return isNotDisabled && matchesSearch;
            })
            .sort((a, b) => {
                // Check for exact match first
                const aExact = String(a.service) === searchQuery || a.name.toLowerCase() === searchQuery.toLowerCase();
                const bExact = String(b.service) === searchQuery || b.name.toLowerCase() === searchQuery.toLowerCase();

                if (aExact && !bExact) return -1; // Move `a` to the top
                if (!aExact && bExact) return 1; // Move `b` to the top
                return 0; // Otherwise, keep order
            });

        return filtered;
    }, [services, userData.recentDisabled, searchQuery]); // Dependencies


    useEffect(() => {
        const fetchServices = async () => {

            try {
                const response = await axios.get('/api/smm/fetchService');

                setService(response.data.response); // Store all services
                // Initially, show all services
            } catch (error) {
                console.error('Error fetching services:', error);
            }


        };

        fetchServices();
    }, []);

    useEffect(() => {
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

                supabase
                    .channel("panl_channel")
                    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "panel" }, (payload) => {
                        //console.log("New order inserted:", payload.new);
                        // Add the new order to the state
                        if (payload.new.owner === userData.userId && payload.new.key === 'disabled') {
                            setUserData((prevNotification) => ({
                                ...prevNotification, // Spread the previous state
                                recentDisabled: [...prevNotification.recentDisabled, payload.new.bigvalue], // Append new value to the array

                                // Update the `deposit` field
                            }));
                        }

                        //console.log(payload.new)
                    })
                    .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_withdrawl" }, (payload) => {
                        //console.log("New order inserted:", payload.new);
                        // Add the new order to the state

                        if (payload.new.for === user.id) {

                            setWithdrawldatao((prevWith) => (
                                [...prevWith, { status: payload.new.status, date: payload.new.date, wid: payload.new.wid, for: payload.new.for, bank: payload.new.bank, a_name: payload.new.a_name, a_no: payload.new.a_no, amount: payload.new.amount }]

                            ))
                        }


                        //console.log(payload.new)
                    })
                    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "admin_withdrawl" }, (payload) => {
                        //console.log("New order inserted:", payload.new);
                        // Add the new order to the state
                        if (payload.new.for == user.id) {
                            setWithdrawldata((prevWith) =>
                                prevWith.map((item) =>
                                    item.wid === payload.new.wid
                                        ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                                        : item // Keep the other items unchanged
                                )
                            );
                            setWithdrawldatao((prevWith) =>
                                prevWith.map((item) =>
                                    item.wid === payload.new.wid
                                        ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                                        : item // Keep the other items unchanged
                                )
                            );
                        }

                        //console.log(payload.new)
                    })
                    // .on("postgres_changes", { event: "UPDATE", schema: "public", table: "admin_withdrawl" }, (payload) => {
                    //     //console.log("New order inserted:", payload.new);
                    //     // Add the new order to the state
                    //     if (payload.new.for == 6528707984) {
                    //         setWithdrawldata((prevWith) =>
                    //             prevWith.map((item) =>
                    //                 item.wid === payload.new.wid
                    //                     ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
                    //                     : item // Keep the other items unchanged
                    //             )
                    //         );
                    //     }

                    //     //console.log(payload.new)
                    // })





                    .subscribe();
            }
        }
    }, [])

    const getServiceName = (serviceId) => {
        const foundService = services.find((s) => s.service === serviceId); // Match by serviceId
        return foundService ? foundService.name : "Unknown Service"; // Return name or fallback
    };

    const handleEnable = async (id) => {
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

                setLoadingIndexb(id);
                try {
                    // Fetch the current 'bigvalue' data from the 'panel' table
                    const { data, error } = await supabase
                        .from('panel')
                        .select('bigvalue')
                        .eq('key', 'disabled')
                        .eq('owner', user.id)// Filter based on the 'father' or any other condition
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
                        .eq('owner', user.id)// Filter by correct row


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
                } finally {
                    setLoadingIndexb(null); // Re-enable button after operation
                }
            }
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase()); // Update search term
    };

    const handleDisable = async (id) => {
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

                setLoadingIndex(id);
                try {
                    // Update local state immediately for a better UI experience
                    setUserData((prevUserData) => ({
                        ...prevUserData,
                        recentDisabled: `${prevUserData.recentDisabled},${id}`,
                    }));

                    const updatedValue = userData.recentDisabled
                        ? `${userData.recentDisabled},${id}`
                        : id;

                    // Update the database
                    const { error: updateError } = await supabase
                        .from("panel")
                        .update({ bigvalue: updatedValue })
                        .eq("owner", user.id)
                        .eq("key", "disabled");

                    if (updateError) throw updateError;

                    console.log("Updated successfully:", updatedValue);
                } catch (error) {
                    console.error("Error updating bigvalue:", error.message);
                } finally {
                    setLoadingIndex(null); // Re-enable button after operation
                }
            }
        }
    };
    const generateIframeSrc1 = () => 'https://paxyo.com/chapa.html?amount=1';
    const generateIframeSrc2 = () => `https://paxyo.com/chapa.html?amount=1`;
    const generateIframeSrc31 = () => `https://paxyo.com/chapa.html?amount=10`;
    const generateIframeSrc32 = () => `https://paxyo.com/chapa.html?amount=500`;
    const generateIframeSrc33 = () => `https://paxyo.com/chapa.html?amount=2500`;
    const generateIframeSrc34 = () => `https://paxyo.com/chapa.html?amount=5000`;

    const [loadingIndex, setLoadingIndex] = useState(null); // Track which button is loading
    const [loadingIndexb, setLoadingIndexb] = useState(null); // Track which button is loading


    const send = async (mess) => {
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

                const { error } = await supabase.from('admin_deposit').insert([
                    { tid: mess, amount: 3000, admin: user.id }
                ]);
                if (error) {
                    console.error(error.message)
                } else {
                    // setModalE(false)

                    setDepo((prevData) => [...prevData, {
                        status: "Pending",
                        date: new Date().toISOString(),
                        tid: mess,
                        amount: 3000
                    }]);
                }
            }
        }
    }
    const sendb = async (mess, am) => {
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

                const { error } = await supabase.from('admin_amount').insert([
                    { tid: mess, amount: am, father: user.id }
                ]);
                if (error) {
                    console.error(error.message)
                } else {
                    // setModalE(false)
                    const { data, error } = await supabase.from('users')
                        .select('a_balance')
                        .eq('id', user.id)
                        .single()


                    if (!error) {
                        const news = data.a_balance + am
                        const { error } = await supabase.from('users')
                            .update({ 'a_balance': news })
                            .eq('id', user.id)

                        if (error) {
                            console.log(error.message)
                        } else {
                            setDepob((prevData) => [...prevData, {
                                status: "Done",
                                date: new Date().toISOString(),
                                tid: mess,
                                amount: am
                            }]);
                        }
                    }
                }
            }
        }
    }


    useEffect(() => {
        const handleIframeMessage = (event, iframeId) => {
            if (event.origin !== 'https://paxyo.com') return;

            const { type, message } = event.data;

            if (iframeId === 'iframe1') {
                // Handle messages for iframe1
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '1!',
                        text: 'Payment.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    send(message);
                    setModalee(false)
                    setIframe1Visible(false);
                }


            } else if (type === 'payment-failure' || type === 'payment-closed') {
                //console.error(message); // Handle failure or closed event
                // setChapa(false)
                setTg(message)
                // Hide container and show iframe
                setIframe1Visible(false);
                setModalee(false)
                setAgain(true);
                setBut(true)
                // Hide iframe on failure or closed event

            } else if (type === 'payment-closed') {
                //setChapa(false)
                setTg(message)
                setAgain(true);
                setBut(true)
                setModalee(false)
                //  console.log(message); // e.g., "Payment popup closed."
                setIframe1Visible(false);

                // Hide iframe on close

            }
            else if (iframeId === 'iframe2') {
                // Handle messages for iframe2
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '2!',
                        text: 'Pay.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    sendb(message, 1);
                    setIframe2Visible(false);
                } else if (type === 'payment-failure' || type === 'payment-closed') {
                    //console.error(message); // Handle failure or closed event
                    // setChapa(false)
                    setTb(message)
                    // Hide container and show iframe
                    setIframe2Visible(false);


                    // Hide iframe on failure or closed event

                } else if (type === 'payment-closed') {
                    //setChapa(false)
                    setTb(message)
                    //  console.log(message); // e.g., "Payment popup closed."
                    setIframe2Visible(false);

                    // Hide iframe on close

                }
            }
            else if (iframeId === 'iframe31') {
                // Handle messages for iframe2
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '10!',
                        text: 'Pay.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    sendb(message, 10);
                    setIframe31Visible(false);
                } else if (type === 'payment-failure' || type === 'payment-closed') {
                    //console.error(message); // Handle failure or closed event
                    // setChapa(false)
                    setTb(message)
                    // Hide container and show iframe
                    setIframe31Visible(false);


                    // Hide iframe on failure or closed event

                } else if (type === 'payment-closed') {
                    //setChapa(false)
                    setTb(message)
                    //  console.log(message); // e.g., "Payment popup closed."
                    setIframe31Visible(false);

                    // Hide iframe on close

                }
            } else if (iframeId === 'iframe32') {
                // Handle messages for iframe2
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '500!',
                        text: 'Pay.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    sendb(message, 500);
                    setIframe32Visible(false);
                } else if (type === 'payment-failure' || type === 'payment-closed') {
                    //console.error(message); // Handle failure or closed event
                    // setChapa(false)
                    setTb(message)
                    // Hide container and show iframe
                    setIframe32Visible(false);


                    // Hide iframe on failure or closed event

                } else if (type === 'payment-closed') {
                    //setChapa(false)
                    setTb(message)
                    //  console.log(message); // e.g., "Payment popup closed."
                    setIframe32Visible(false);

                    // Hide iframe on close

                }
            } else if (iframeId === 'iframe33') {
                // Handle messages for iframe2
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '2500!',
                        text: 'Pay.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    sendb(message, 2500);
                    setIframe33Visible(false);
                } else if (type === 'payment-failure' || type === 'payment-closed') {
                    //console.error(message); // Handle failure or closed event
                    // setChapa(false)
                    setTb(message)
                    // Hide container and show iframe
                    setIframe33Visible(false);


                    // Hide iframe on failure or closed event

                } else if (type === 'payment-closed') {
                    //setChapa(false)
                    setTb(message)
                    //  console.log(message); // e.g., "Payment popup closed."
                    setIframe33Visible(false);

                    // Hide iframe on close

                }
            } else if (iframeId === 'iframe34') {
                // Handle messages for iframe2
                if (type === 'payment-success') {
                    Swal.fire({
                        title: '5000!',
                        text: 'Pay.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    sendb(message, 5000);
                    setIframe34Visible(false);
                } else if (type === 'payment-failure' || type === 'payment-closed') {
                    //console.error(message); // Handle failure or closed event
                    // setChapa(false)
                    setTb(message)
                    // Hide container and show iframe
                    setIframe34Visible(false);


                    // Hide iframe on failure or closed event

                } else if (type === 'payment-closed') {
                    //setChapa(false)
                    setTb(message)
                    //  console.log(message); // e.g., "Payment popup closed."
                    setIframe34Visible(false);

                    // Hide iframe on close

                }
            }
        };

        const handleMessage = (event) => {
            // Identify the iframe source
            if (event.source === (document.getElementById('iframe1') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe1');
            } else if (event.source === (document.getElementById('iframe2') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe2');
            }
            else if (event.source === (document.getElementById('iframe31') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe31');
            } else if (event.source === (document.getElementById('iframe32') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe32');
            } else if (event.source === (document.getElementById('iframe33') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe33');
            } else if (event.source === (document.getElementById('iframe34') as HTMLIFrameElement)?.contentWindow) {
                handleIframeMessage(event, 'iframe34');
            }
        };

        // Add the event listener
        window.addEventListener('message', handleMessage);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const addWithdrawl = async () => {
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

                const wid = Math.floor(10000 + Math.random() * 90000); // generates a 5-digit random number

                const { error: setError } = await supabase
                    .from('admin_withdrawl')
                    .insert([{
                        for: user.id,
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
                    setModalww(false)
                    setModalF(false)
                    Swal.fire({
                        title: 'Success!',
                        text: 'withdrawl success.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-popup',    // Apply the custom class to the popup
                            title: 'swal2-title',    // Apply the custom class to the title
                            confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                            cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                        }
                    });
                }
            }
        }
    }

    const updateDeposit = async () => {
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

                const { error: findErrorB } = await supabase.from('panel').update({ minmax: depositmin }).eq('owner', user.id).eq('key', 'minmax'); // Update all rows where `did` is greater than 0
                if (findErrorB) {
                    console.error(findErrorB.message)
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Minimum Deposit updated.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal2-popup',    // Apply the custom class to the popup
                            title: 'swal2-title',    // Apply the custom class to the title
                            confirmButton: 'swal2-confirm', // Apply the custom class to the confirm button
                            cancelButton: 'swal2-cancel' // Apply the custom class to the cancel button
                        }
                    });
                    setModalG(false)
                }
            }
        }
    }

    // const sendDeposit = async (id) => {
    //     const { error: findErrorB } = await supabase.from('admin_withdrawl').update({ status: 'Sent' }).eq('wid', id); // Update all rows where `did` is greater than 0
    //     if (findErrorB) {
    //         console.error(findErrorB.message)
    //     } else {
    //         setWithdrawldata((prevWith) =>
    //             prevWith.map((item) =>
    //                 item.wid === id
    //                     ? { ...item, status: 'Sent' } // Update status to 'sent' if wid matches id
    //                     : item // Keep the other items unchanged
    //             )
    //         );

    //     }
    // }

    const openModal = () => {
        setLoadingc(true); // Show the spinner
        setModalC(true);

        // Simulate a short delay (you can remove this if unnecessary)
    };




    return (
        <>
            <div className="grid  gap-2 grid-row-2  px-12 w-full p-2">
                <div className="p-2 h-fit   ">
                    <Button onClick={() => setModalA(true)} className="w-full">Message</Button>
                </div>
                <div className="p-2 h-fit ">
                    <Button onClick={async () => {
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

                                setModalB(true)
                                const { data: fetchRate, error } = await supabase
                                    .from("panel")
                                    .select("value")
                                    .eq('owner', user.id)
                                    .eq('key', 'rate')


                                if (error) {
                                    console.log(error);
                                } else {
                                    setRr(fetchRate[0].value)
                                }
                            }
                        }
                    }} className="w-full">Rate</Button>
                </div>
                <div className="p-2 h-fit  ">
                    <Button onClick={openModal} className="w-full">Disable</Button>
                    <Button onClick={() => setModalD(true)} className="w-full mt-2">Enable</Button>
                </div>
                <div className="p-2 h-fit ">
                    <Button onClick={() => {
                        setTg('')
                        setModalE(true)
                    }} className="w-full">Deposit M</Button>
                </div>
                <div className="p-2 h-fit ">
                    <Button onClick={() => {
                        setTb('')
                        setModalI(true)
                    }} className="w-full">Deposit</Button>
                </div>
                <div className="p-2 h-fit  ">
                    <Button onClick={() => setModalF(true)} className="w-full">Withdrawl</Button>
                </div>
                <div className="p-2 h-fit ">
                    <Button onClick={async () => {
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

                                setModalG(true)
                                const { data: fetchMinmax, error } = await supabase
                                    .from("panel")
                                    .select("minmax")
                                    .eq('owner', user.id)


                                if (error) {
                                    console.log(error);
                                } else {
                                    const validMinmax = fetchMinmax
                                        .map(item => item.minmax)
                                        .filter(value => value !== null && !isNaN(value)); // Ensure it's numeric

                                    if (validMinmax.length > 0) {
                                        setMm(validMinmax[0]); // Set the first valid number
                                    }
                                }
                            }
                        }
                    }} className="w-full">Minimum Deposit</Button>
                </div>
                {/* <div className="p-2 h-fit ">
                    <Button onClick={async () => {

                        setModalj(true)
                        const { data: fetchMinmax, error } = await supabase
                            .from("admin_report")
                            .select("*")
                            .eq('owner', 6528707984)


                        if (error) {
                            console.log(error);
                        } else {
                            setReports(fetchMinmax)
                        }
                    }} className="w-full">report</Button>
                </div> */}
            </div>
            {modalA && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setIndi(null)
                        setModalA(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setIndi(null)
                                setModalA(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className="amount-container">



                            <label>
                                <input
                                    type="checkbox"
                                    checked={all === "user"} // Checks the checkbox if 'all' is set to 'user'
                                    onChange={(e) => {
                                        const value = e.target.checked ? "user" : "";
                                        setAll(value); // Set 'user' if checked, otherwise empty
                                        setIndi(value); // Update indi state as well
                                    }}
                                />
                                All Users
                            </label>

                            {!indi && (<Input
                                header="UserID"
                                type="number"
                                className="w-full"
                                placeholder="Enter user's id"
                                onChange={(e) => setAdminMessageFor2(e.target.value)}
                                value={adminMessageFor2}
                            />)}

                            {/* {!indi && (<Input
                                header="AdminID"
                                type="number"
                                className="w-full"
                                placeholder="Enter admin's id"
                                value={adminMessageFor}
                                onChange={(e) => setAdminMessageFor(e.target.value)}
                            />)} */}


                            <Input
                                header="Message"
                                type="text"
                                className="w-full"
                                value={adminMessage}
                                placeholder="Enter message"
                                onChange={(e) => setAdminMessage(e.target.value)}
                            />

                            {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}
                            <Button

                                onClick={sendAdminMessage}
                                className="w-full p-4"
                            // disabled={parseInt(aamount) <= userData.deposit || aamount === ''}
                            // style={{ display: but ? 'block' : 'none', marginTop: '10px', padding: '10px', backgroundColor: parseInt(aamount) >= userData.deposit ? 'var(--tgui--button_color)' : 'gray', color: 'white' }}
                            >
                                {/* {(ag && again) ? "Try Again" : "Continue"} */}
                                Send
                            </Button>


                        </div>
                    </div>
                </div>
            )}
            {modalB && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setIndi(null)
                        setModalB(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setIndi(null)
                                setModalB(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className="amount-container">


                            <Input
                                header="Rate"
                                type="number"
                                className="w-full"
                                onChange={(e) => setRate(e.target.value)}
                                value={rate}
                                placeholder={rr}
                            />

                            {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}
                            <Button

                                onClick={updateRate}
                                className="w-full p-4"
                            // disabled={parseInt(aamount) <= userData.deposit || aamount === ''}
                            // style={{ display: but ? 'block' : 'none', marginTop: '10px', padding: '10px', backgroundColor: parseInt(aamount) >= userData.deposit ? 'var(--tgui--button_color)' : 'gray', color: 'white' }}
                            >
                                {/* {(ag && again) ? "Try Again" : "Continue"} */}
                                Send
                            </Button>


                        </div>
                    </div>
                </div>
            )}
            {loadingc && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <FontAwesomeIcon icon={faRefresh} className="text-white animate-spin text-white text-4xl" />
                </div>
            )}
            {modalC && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setModalC(false)
                        setLoadingc(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop h-auto lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {

                                setLoadingc(false)
                                setModalC(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div style={{ height: '42rem' }} className="amount-container">

                            <Input
                                header="Search"
                                type="text"
                                placeholder="Search by name or service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />

                            <ul className="scrollable" style={{ height: '80%', overflowY: 'scroll', overflowX: 'hidden' }} >
                                {loading ? (
                                    <li className="p-2 text-gray-500">Loading...</li>
                                ) : (
                                    filteredList.map((items, index) => (
                                        <li key={index}>
                                            <div style={{ borderBottom: "1px solid black" }} className="w-full p-2">
                                                {items.service} {items.name}
                                                <Button
                                                    className="px-6 p-2 ml-4 text-white"
                                                    onClick={() => {
                                                        handleDisable(items.service);
                                                        setLoadingIndex(index); // Set loading state when clicked
                                                    }}
                                                    disabled={loadingIndex === index} // Disable only the clicked button
                                                >
                                                    {loadingIndex === index ? (
                                                        <span className="flex items-center">
                                                            <FontAwesomeIcon icon={faRefresh} className="animate-spin mr-2" /> Wait...
                                                        </span>
                                                    ) : (
                                                        "Disable"
                                                    )}
                                                </Button>
                                            </div>
                                        </li>
                                    ))
                                )}

                            </ul>


                        </div>
                    </div>
                </div>
            )}
            {modalD && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setModalD(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {

                                setModalD(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div style={{ height: '42rem' }} className="amount-container">

                            <Input
                                header="Search"
                                type="text"
                                placeholder="Search by name or service..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            />

                            <ul className="scrollable" style={{ height: '80%', overflowY: 'scroll', overflowX: 'hidden' }} >
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
                                            <div className="w-full p-2 ">

                                                <div
                                                    style={{ borderBottom: '1px solid black' }}
                                                    className="w-full p-2"
                                                >
                                                    {serviceId} - {getServiceName(serviceId)}



                                                    <Button
                                                        className="px-6 p-2 ml-4 text-white"
                                                        onClick={() => {
                                                            handleEnable(serviceId)
                                                            setLoadingIndexb(serviceId); // Set loading state when clicked
                                                        }}
                                                        disabled={loadingIndexb === index} // Disable only the clicked button
                                                    >
                                                        {loadingIndexb === serviceId ? (
                                                            <span className="flex items-center">
                                                                <FontAwesomeIcon icon={faRefresh} className="animate-spin mr-2" /> Wait...
                                                            </span>
                                                        ) : (
                                                            "Enable"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                            </ul>


                        </div>
                    </div>
                </div>
            )}
            {modalE && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setIndi(null)
                        setModalE(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setIndi(null)
                                setModalE(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className="amount-container">



                            <Button onClick={() => setModalee(true)} className="w-full">Deposit</Button>
                            {loadingb && <MyLoader />}
                            <div style={{ overflow: 'auto' }} className="scrollable amount-container">

                                {!loadingb &&
                                    <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                                        <thead>
                                            <tr>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                status
                                            </th> */}
                                                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                    tid
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                    date
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className=" ">
                                            {depo.map((items, index) => (
                                                <tr key={index}>
                                                    {/* <td className="px-6 py-4 text-sm">{items.status}</td> */}
                                                    <td className="px-6 py-4 text-sm ">{items.tid}</td>

                                                    <td className="px-6 py-4 text-sm ">{items.amount}</td>
                                                    <td className="px-6 py-4 text-sm ">{items.date}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                            <br />


                        </div>
                    </div>
                </div>
            )}
            {modalF && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => setModalF(false)}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => setModalF(false)}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>
                        <p className="mb-4">Enter the amount you want to deposit:</p>

                        <Button onClick={() => setModalww(true)} className="w-full">WITHDRAWL</Button>
                        <div style={{ overflow: 'auto' }} className="scrollable amount-container">

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


                        </div>
                        <br />


                    </div>
                </div>
            )}
            {modalww && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setModalww(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setModalww(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

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
                            type="number"
                            className="w-full"
                            placeholder="Enter acc"
                            value={acc}

                            onChange={(e) => setAcc(Number(e.target.value))}
                        />

                        <Input
                            header="Amount"
                            type="number"
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
                </div>
            )}

            {modalee && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {
                        setBut(true)
                        setModalee(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setBut(true)
                                setModalee(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <Input
                            header="Amount"
                            type="number"
                            className="w-full"

                            value="3000"
                            disabled={true}
                        />

                        {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}

                        <Button
                            onClick={() => {

                                setBut(false)
                                setLoading(true)

                                setIframe1Visible(true)
                                setLoading(true)
                            }}
                            className="w-full p-4"

                            style={{ display: but ? 'block' : 'none', marginTop: '10px', padding: '10px' }}
                        >
                            {(tg && again) ? "Try Again" : "Continue"}
                        </Button>
                        <br />
                        {tg}
                        <br />
                        {loading && <MyLoader />}
                        {iframe1Visible && (
                            <iframe
                                id="iframe1"
                                src={generateIframeSrc1()}
                                width="100%"
                                height="310rem"
                                onLoad={() => setLoading(false)}
                                title="Iframe 1"
                                frameBorder="0"
                            />
                        )}
                    </div>
                </div>
            )}
            {modalG && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setModalG(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setModalG(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className="amount-container">


                            <Input
                                header="Minimum"
                                type="number"
                                className="w-full"
                                onChange={(e) => setDeposit(e.target.value)} value={depositmin}
                                placeholder={mm}
                            />

                            {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}
                            <Button

                                onClick={updateDeposit}
                                className="w-full p-4"
                            // disabled={parseInt(aamount) <= userData.deposit || aamount === ''}
                            // style={{ display: but ? 'block' : 'none', marginTop: '10px', padding: '10px', backgroundColor: parseInt(aamount) >= userData.deposit ? 'var(--tgui--button_color)' : 'gray', color: 'white' }}
                            >
                                {/* {(ag && again) ? "Try Again" : "Continue"} */}
                                Set
                            </Button>


                        </div>
                    </div>
                </div>
            )}
            {modalH && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {

                        setModalH(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setModalH(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className="amount-container">


                            <Input
                                header="Rate"
                                type="number"
                                className="w-full"
                                onChange={(e) => setallRate(e.target.value)}
                                value={rate}
                                placeholder="Enter rate"
                            />

                            {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}
                            <Button

                                onClick={updateAllRate}
                                className="w-full p-4"
                            // disabled={parseInt(aamount) <= userData.deposit || aamount === ''}
                            // style={{ display: but ? 'block' : 'none', marginTop: '10px', padding: '10px', backgroundColor: parseInt(aamount) >= userData.deposit ? 'var(--tgui--button_color)' : 'gray', color: 'white' }}
                            >
                                {/* {(ag && again) ? "Try Again" : "Continue"} */}
                                Send
                            </Button>


                        </div>
                    </div>
                </div>
            )}
            {modalI && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {
                        setIframe31Visible(false)
                        setIframe32Visible(false)
                        setIframe33Visible(false)
                        setIframe34Visible(false)
                        setModalI(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setIframe31Visible(false)
                                setIframe32Visible(false)
                                setIframe33Visible(false)
                                setIframe34Visible(false)
                                setModalI(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>

                        <div className=" amount-container">


                            <div className="flex ">

                                <Button

                                    onClick={() => {

                                        setIframe34Visible(false)
                                        setIframe32Visible(false)
                                        setIframe33Visible(false)
                                        setIframe31Visible(true)
                                        setLoading(true)
                                    }}
                                    className="w-full p-1"

                                >
                                    10
                                </Button>
                                <Button

                                    onClick={() => {

                                        setIframe31Visible(false)
                                        setIframe34Visible(false)
                                        setIframe33Visible(false)
                                        setIframe32Visible(true)
                                        setLoading(true)
                                    }}
                                    className="w-full p-1"

                                >
                                    500
                                </Button>
                                <Button

                                    onClick={() => {

                                        setIframe31Visible(false)
                                        setIframe32Visible(false)
                                        setIframe34Visible(false)
                                        setIframe33Visible(true)
                                        setLoading(true)
                                    }}
                                    className="w-full p-1"

                                >
                                    2500
                                </Button>
                                <Button

                                    onClick={() => {
                                        setIframe31Visible(false)
                                        setIframe32Visible(false)
                                        setIframe33Visible(false)
                                        setIframe34Visible(true)
                                        setLoading(true)
                                    }}
                                    className="w-full p-1"

                                >
                                    5000
                                </Button>
                            </div>
                            <br />
                            {tb}

                            {loading && <MyLoader />}
                            {iframe2Visible && (
                                <iframe
                                    id="iframe2"
                                    src={generateIframeSrc2()}
                                    width="100%"
                                    height="310rem"
                                    onLoad={() => setLoading(false)}
                                    title="Iframe 2"
                                    frameBorder="0"
                                />
                            )}
                            {iframe31Visible && (
                                <iframe
                                    id="iframe31"
                                    src={generateIframeSrc31()}
                                    width="100%"
                                    height="310rem"
                                    onLoad={() => setLoading(false)}
                                    title="Iframe 2"
                                    frameBorder="0"
                                />
                            )}
                            {iframe32Visible && (
                                <iframe
                                    id="iframe32"
                                    src={generateIframeSrc32()}
                                    width="100%"
                                    height="310rem"
                                    onLoad={() => setLoading(false)}
                                    title="Iframe 2"
                                    frameBorder="0"
                                />
                            )}
                            {iframe33Visible && (
                                <iframe
                                    id="iframe33"
                                    src={generateIframeSrc33()}
                                    width="100%"
                                    height="310rem"
                                    onLoad={() => setLoading(false)}
                                    title="Iframe 2"
                                    frameBorder="0"
                                />
                            )}
                            {iframe34Visible && (
                                <iframe
                                    id="iframe34"
                                    src={generateIframeSrc34()}
                                    width="100%"
                                    height="310rem"
                                    onLoad={() => setLoading(false)}
                                    title="Iframe 2"
                                    frameBorder="0"
                                />
                            )}
                            {loadingb && <MyLoader />}
                            <div style={{ overflow: 'auto' }} className="scrollable amount-container">

                                {!loadingb &&
                                    <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                                        <thead>
                                            <tr>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                status
                                            </th> */}
                                                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                    tid
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                    date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className=" ">
                                            {depob.map((items, index) => (
                                                <tr key={index}>
                                                    {/* <td className="px-6 py-4 text-sm">{items.status}</td> */}
                                                    <td className="px-6 py-4 text-sm ">{items.tid}</td>

                                                    <td className="px-6 py-4 text-sm ">{items.amount}</td>
                                                    <td className="px-6 py-4 text-sm ">{items.date}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                            <br />


                        </div>
                    </div>
                </div >
            )}
            {
                modalii && (
                    <div
                        className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                        onClick={() => {

                            setModalii(false)
                        }}
                    >
                        <div
                            className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                            onClick={(e) => e.stopPropagation()}
                            style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                        // Prevent clicking inside the modal from closing it
                        >
                            <div

                                className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                                onClick={() => {
                                    setModalii(false)
                                }}
                            >
                                <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                            </div>
                            <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>


                            {/* <strong style={{ color: 'red' }}>
                                {aamount !== '' && parseInt(aamount) <= userData.deposit && `The Minimum Deposit Amount is ${userData.deposit}`}
                            </strong> */}

                        </div>
                    </div>
                )
            }
            {modalj && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => setModalj(false)}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => setModalj(false)}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>
                        <p className="mb-4">Enter the amount you want to deposit:</p>

                        <Button onClick={() => setModalff(true)} className="w-full">Report</Button>
                        <div className="amount-container">

                            {!loader &&
                                <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                id
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">report</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                date
                                            </th>


                                        </tr>
                                    </thead>
                                    <tbody className=" ">
                                        {reports?.map((items, index) => (

                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm">{items.id}</td>
                                                <td className="px-6 py-4 text-sm ">{items.status}</td>
                                                <td className="px-6 py-4 text-sm ">{items.report}</td>
                                                <td className="px-6 py-4 text-sm ">{items.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }


                        </div>
                        <br />


                    </div>
                </div>
            )}
            {modalff && (
                <div
                    className="fixed  modal-pops inset-0  h-screen bg-black bg-opacity-75 grid content-center z-50"
                    onClick={() => {
                        setBut(true)
                        setModalff(false)
                    }}
                >
                    <div
                        className="bg-white mx-auto modal-pop lg:w-4/12 p-8 rounded-lg relative w-96"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 'width': '90%', background: 'var(--tgui--bg_color)' }}
                    // Prevent clicking inside the modal from closing it
                    >
                        <div

                            className=" text-gray-500 absolute m-2 right-4 top-2 px-4 py-3 rounded-md"
                            onClick={() => {
                                setBut(true)
                                setModalff(false)
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-semibold mb-4">Make Deposit</h2>
                        <Select
                            header="Report"
                            value={reason.length > 0 ? reason[0]?.report || "" : ""}
                            onChange={(e) => setReason([{ status: "Pending", oid: oid || "", report: e.target.value, date: new Date().toISOString() }])}
                        >
                            <option value="">Select an option</option>
                            <option value="Refer">Refer</option>
                            <option value="Cancelled">Cancelled</option>
                        </Select>


                        <Input
                            header="Order ID"
                            type="text"
                            className="w-full"
                            placeholder="account name"
                            value={oid || ""} // Ensure value is always a string
                            onChange={(e) => setOID(e.target.value)}
                        />

                        <br />
                        <Button onClick={handleReport} className="w-full">Report</Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Accounts;