"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBill, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState, useCallback } from "react";
import { Avatar, Input } from '@telegram-apps/telegram-ui'; // Adjust as necessary
import { useUser } from "../UserContext";

const Smm = () => {
    const [showDetail, setShowDetail] = useState(0);
    const [showBox, setShowBox] = useState(0);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageTo, setMessageTo] = useState('');
    const [message, setMessage] = useState('');
    const [messageId, setMessageId] = useState('');
    const [idSearchQuery, setIdSearchQuery] = useState("");
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [searchClicked, setSearchClicked] = useState(false);
    const [bala, setBala] = useState(null);
    const { userData } = useUser();

    const fetchUser = useCallback(async (id) => {

        try {
            const { data, error } = await supabase
                .from("users")
                .select('*')
                .eq('father', id);
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, []);

    useEffect(() => {
        //   // Load the Telegram Web App JavaScript SDK
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js?2";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const Telegram = window.Telegram;

            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.expand() // Get the app version
                const { user } = Telegram.WebApp.initDataUnsafe;
                fetchUser(user.id);
            }
        }
    }, [fetchUser]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter((item) =>
        item.id.toString().toLowerCase().includes(idSearchQuery.toLowerCase()) &&
        (item.name?.toLowerCase() || "").includes(nameSearchQuery.toLowerCase())
    );

    const sendMessage = () => {
        //   // Load the Telegram Web App JavaScript SDK
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js?2";
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
            const Telegram = window.Telegram;

            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.expand() // Get the app version
                const { user } = Telegram.WebApp.initDataUnsafe;

                try {
                    const { error } = await supabase
                        .from('adminmessage')
                        .insert([
                            {
                                seen: true,
                                message: message,
                                for: messageId,
                                father: user.id,
                                from: "Admin",
                            }
                        ]);
                    if (error) throw error;
                    setIsModalOpen(false);

                } catch (error) {
                    console.error("Error sending message:", error.message);
                }
            }
        }
    };

    const updateBalance = async () => {
        setBala(null);
        try {
            const { error } = await supabase
                .from('users')
                .update({ balance: bala })
                .eq("id", messageId);
            if (error) throw error;
            setShowBox(0);

        } catch (error) {
            console.error("Error updating balance:", error.message);
        }
    };

    useEffect(() => {
        //   // Load the Telegram Web App JavaScript SDK
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js?2";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const Telegram = window.Telegram;

            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.expand() // Get the app version
                const { user } = Telegram.WebApp.initDataUnsafe;

                const subscribeToChanges = () => {
                    const channel = supabase
                        .channel('users')
                        .on("postgres_changes", { event: "INSERT", schema: "public", table: "users", filter: `father=eq.${user.id}` }, (payload) => {
                            setUsers((prevData) => [...prevData, payload.new]);
                        })
                        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users", filter: `father=eq.${user.id}` }, (payload) => {

                            setUsers((prevData) => {
                                // Update the balance if the user ID matches
                                return prevData.map((item) =>
                                    item.id === payload.new.id
                                        ? { ...item, balance: payload.new.balance }  // Update the balance
                                        : item  // Keep the rest unchanged
                                );
                            });


                        })
                        .subscribe();

                    return () => {
                        supabase.removeChannel(channel);
                    };
                };

                subscribeToChanges();
            }
        }
    }, []);

    return (
        <>
            <div className="grid place-content-end pr-12 w-screen p-3 ">
                {!searchClicked ? (
                    <FontAwesomeIcon onClick={() => setSearchClicked(true)} icon={faSearch} style={{ margin: 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" />
                ) : (
                    <FontAwesomeIcon onClick={() => setSearchClicked(false)} icon={faClose} style={{ margin: 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" />
                )}
            </div>
            {searchClicked && (
                <div>
                    <div className="mb-0">
                        <Input
                            header="search by ID"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Search by ID..."
                            value={idSearchQuery}
                            onChange={(e) => setIdSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            header="search by Name"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Search by Name..."
                            value={nameSearchQuery}
                            onChange={(e) => setNameSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className="w-full overflow-auto" style={{ height: '29rem' }}>
                <ul className="overflow-hidden">
                    {filteredUsers.map((items, index) => (

                        <li key={index} className="block p-2" style={{ borderTop: '1px solid var(--tgui--header_bg_color)', borderBottom: '1px solid var(--tgui--header_bg_color)' }}>
                            <div className="flex">
                                <div className="p-2 block w-2/12">
                                    <div className="relative w-fit">
                                        <Avatar size={48} src={items.profile} />
                                    </div>
                                    <div className="m-1" style={{ fontSize: '0.8rem', lineHeight: '1' }}>
                                        <strong>{items.name}</strong>
                                    </div>
                                    <div className="m-1" style={{ fontSize: '0.5rem', lineHeight: '1' }}>{items.id}</div>
                                </div>
                                <div className="flex gap-1 my-auto w-full place-content-center">
                                    {items.username && (
                                        <button
                                            onClick={() => {
                                                const script = document.createElement("script");
                                                script.src = "https://telegram.org/js/telegram-web-app.js?2";
                                                script.async = true;
                                                document.body.appendChild(script);

                                                script.onload = () => {
                                                    const Telegram = window.Telegram;
                                                    if (Telegram && Telegram.WebApp) {
                                                        Telegram.WebApp.close();
                                                        const chatLink = `https://t.me/${items.username}`;
                                                        Telegram.WebApp.openLink(chatLink);
                                                    }
                                                };
                                            }}
                                            style={{ fontSize: '0.8rem' }}
                                            className="p-1 flex flex-wrap flex-col place-content-center h-fit w-fit px-4"
                                        >
                                            <FontAwesomeIcon className="mx-auto text-2xl mb-1" icon={faTelegram} />
                                            chat
                                        </button>
                                    )}
                                    <button
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            setMessageId(items.id);
                                            setMessageTo(items.name);
                                        }}
                                        className="p-1 flex flex-wrap flex-col place-content-center h-fit w-fit px-4"
                                    >
                                        <FontAwesomeIcon className="text-2xl mx-auto mb-1" icon={faComment} />
                                        message
                                    </button>
                                    <button
                                        style={{
                                            fontSize: '0.8REM',
                                            background: showBox === items.id ? 'var(--tgui--accent_text_color)' : ''
                                        }}
                                        className="p-1 h-fit flex flex-wrap flex-col place-content-center w-fit px-4"
                                        onClick={() => {
                                            setShowBox((prev) => (prev === items.id ? 0 : items.id));
                                            setShowDetail(0);
                                            setMessageId(items.id);
                                        }}
                                    >
                                        <FontAwesomeIcon className="text-2xl mx-auto mb-1" icon={faMoneyBill} />
                                        update
                                    </button>
                                    <button
                                        style={{
                                            fontSize: '0.8rem',
                                            background: showDetail === items.id ? 'var(--tgui--accent_text_color)' : ''
                                        }}
                                        className="p-1 h-fit flex flex-wrap flex-col place-content-center w-fit px-4"
                                        onClick={() => {
                                            setShowDetail((prev) => (prev === items.id ? 0 : items.id));
                                            setShowBox(0);
                                        }}
                                    >
                                        <FontAwesomeIcon className="text-2xl mx-auto mb-1" icon={faSortDown} />
                                        Detail
                                    </button>
                                </div>
                            </div>
                            {showDetail === items.id && (
                                <div style={{ background: 'var(--tgui--subtitle_text_color)', color: 'var(--tgui--button_text_color)' }} className="modal-pop ml-auto w-full rounded-lg m-2 p-2 inline-block">
                                    <p>Balance: {items.balance}</p>
                                    <p>Phone: {items.phone}</p>
                                    <p>username: @{items.username}</p>
                                </div>
                            )}
                            {showBox === items.id && (
                                <div className="flex modal-pop">
                                    <input
                                        type="number"
                                        placeholder={items.balance}
                                        onChange={(e) => setBala(Number(e.target.value))}
                                        value={bala}
                                        className="bg-gray-100 w-11/12 m-2 p-1"
                                    />
                                    <button className="px-4 h-fit bg-gray-100 py-2 my-auto" onClick={updateBalance}>update</button>
                                </div>
                            )}
                        </li>

                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <div
                    style={{ background: 'rgba(0, 0, 0,0.4)' }}
                    className="fixed modal-pops grid content-center inset-0 bg-opacity-75 z-50"
                >
                    <div style={{ height: 'auto', background: 'var(--tgui--bg_color)' }} className="mx-auto my-auto modal-pop relative p-6 rounded-lg w-11/12">
                        <div
                            onClick={closeModal}
                            className="absolute right-8 text-gray-500 px-4 py-3 mx-auto rounded-md"
                        >
                            <FontAwesomeIcon icon={faClose} style={{ margin: 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-bold mb-4">Message to {messageTo}</h2>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="p-2 bg-gray-100 m-6 w-10/12"
                        />
                        <button
                            onClick={sendMessage}
                            style={{ background: 'var(--tgui--button_color)', color: 'var(--tgui--button_text_color)' }}
                            className="block px-4 h-fit rounded-lg py-2 my-auto"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Smm;