"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBill, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Avatar, Input } from '@telegram-apps/telegram-ui';// Adjust as necessary

const Smm = () => {

    const [showDetail, setShowDetail] = useState(0)
    const [showBox, setShowBox] = useState(0)
    const [users, setUsers] = useState([])
    const [isModalOpenn, setIsModalOpenn] = useState(false)
    const [messageTo, setMessageTo] = useState('')
    const [message, setMessage] = useState('')
    const [messageid, setMessageId] = useState('')
    const [idSearchQuery, setIdSearchQuery] = useState("");
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [searchClicked, setsearchClicked] = useState(false)

    useEffect(() => {
        // Load the Telegram Web App JavaScript SDK


        const fetchUser = async () => {
            const { data, error } = await supabase
                .from("users")
                .select('*'); // Pass 100 as a string
            if (error) {
                console.error(error)
            } else {
                setUsers(data)

            }


        }
        fetchUser()

    }, []);


    const closeModall = () => {
        setIsModalOpenn(false);
    };



    const filteredUsers = users.filter((item) =>
        item.id.toString().toLowerCase().includes(idSearchQuery.toLowerCase()) &&
        (item.name?.toLowerCase() || "").includes(nameSearchQuery.toLowerCase())
    );

    const sendMessage = async () => {
        const { error } = await supabase
            .from('adminmessage')
            .insert([
                {
                    seen: true,
                    message: message, // Replace with your dynamic value if needed
                    for: messageid, // Replace with the desired value for the "for" column
                    from: "Admin", // Replace with the desired value for the "from" column
                }
            ]);
        if (error) {
            console.error(error.message)
        } else {
            setIsModalOpenn(false)
        }
    }

    useEffect(() => {
        const auth = async () => {

            // Subscribe to real-time changes
            supabase
                .channel(`users`)
                .on("postgres_changes", { event: "INSERT", schema: "public", table: "users" }, (payload) => {
                    //console.log("New order inserted:", payload.new);
                    // Add the new order to the state
                    //console.log(payload.new)
                    setUsers((prevData) => {

                        return [...prevData, payload.new];
                    });

                })
                .subscribe();
        };

        auth();
    }, []);
    return (
        <>

            <div className="grid place-content-start pr-12 w-screen p-3 ">
                {!searchClicked && <FontAwesomeIcon onClick={() => setsearchClicked(true)} icon={faSearch} style={{ 'margin': 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" /> || <FontAwesomeIcon onClick={() => setsearchClicked(false)} icon={faClose} style={{ 'margin': 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" />}
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
            <ul>

                {filteredUsers.map((items, index) => (
                    <li key={index} className="block p-2 " style={{ borderTop: '1px solid var(--tgui--header_bg_color)', borderBottom: '1px solid var(--tgui--header_bg_color)' }}>
                        <div className="flex">
                            <div className="p-2 block w-2/12  ">
                                <div className="relative w-fit">
                                    <Avatar
                                        size={48}

                                        src={items.profile}
                                    />


                                </div>

                                <div className="m-1" style={{ fontSize: '0.8rem', lineHeight: '1' }}>
                                    <strong>{items.name}</strong></div>
                                <div className="m-1" style={{ fontSize: '0.5rem', lineHeight: '1' }}>{items.id}</div>
                            </div>
                            <div className="flex gap-1 my-auto w-full  place-content-center ">
                                {items.username && (
                                    <>
                                        <button onClick={() => {
                                            const script = document.createElement("script");
                                            script.src = "https://telegram.org/js/telegram-web-app.js?2";
                                            script.async = true;
                                            document.body.appendChild(script);

                                            script.onload = async () => {
                                                const Telegram = window.Telegram;

                                                if (window.Telegram && window.Telegram.WebApp) {
                                                    Telegram.WebApp.close()
                                                    const username = items.username; // Replace with the username of the Telegram account you wish to open
                                                    const chatLink = `https://t.me/${username}`;

                                                    // WebApp.openLink(chatLink)
                                                    Telegram.WebApp.openTelegramLink(chatLink)
                                                }
                                            }
                                        }}
                                            style={{ fontSize: '0.8rem' }}
                                            className=" p-1 flex flex-wrap flex-col place-content-center h-fit w-fit px-4  ">
                                            <FontAwesomeIcon className=" mx-auto text-2xl mb-1" icon={faTelegram} />
                                            chat</button>
                                    </>
                                )}
                                <button style={{ fontSize: '0.8rem' }} onClick={() => {
                                    setIsModalOpenn(true)
                                    setMessageId(items.id)
                                    setMessageTo(items.name)
                                }} className="p-1 flex flex-wrap flex-col place-content-center  h-fit w-fit px-4   ">
                                    <FontAwesomeIcon className="text-2xl  mx-auto mb-1" icon={faComment} />

                                    message</button>
                                <button style={{
                                    fontSize: '0.8REM',
                                    background: showBox === items.id ? 'var(--tgui--accent_text_color)' : ''
                                }} className="p-1 h-fit flex flex-wrap flex-col place-content-center  w-fit px-4  " onClick={() => {
                                    setShowBox((prev) => (prev === items.id ? 0 : items.id))
                                    setShowDetail(0)
                                }}> <FontAwesomeIcon className="text-2xl  mx-auto mb-1" icon={faMoneyBill} />
                                    update

                                </button>
                                <button style={{
                                    fontSize: '0.8rem',
                                    background: showDetail === items.id ? 'var(--tgui--accent_text_color)' : ''
                                }} className="p-1 h-fit flex flex-wrap flex-col place-content-center   w-fit  px-4" onClick={() => {
                                    setShowDetail((prev) => (prev === items.id ? 0 : items.id))
                                    setShowBox(0)
                                }} // Toggle logic
                                > <FontAwesomeIcon className="text-2xl  mx-auto mb-1" icon={faSortDown} />

                                    Detail

                                </button>

                            </div>
                        </div>
                        {showDetail == items.id && (
                            <div style={{ background: 'var(--tgui--subtitle_text_color)', color: 'var(--tgui--button_text_color)' }} className="modal-pop ml-auto w-full rounded-lg m-2 p-2 inline-block">
                                <p>Balance: {items.balance}</p>
                                <p>Phone: {items.phone}</p>
                                <p>username: @{items.username}</p>
                            </div>
                        )}
                        {showBox == items.id && (
                            <div className="flex modal-pop">
                                <input type="text" className="bg-gray-100 w-11/12 m-2 p-1" />
                                <button className=" px-4 h-fit bg-gray-100 py-2 my-auto">update</button>
                            </div>
                        )}
                    </li>
                ))
                }

            </ul>

            {isModalOpenn && (
                <div
                    style={{ background: 'var(--tgui--secondary_bg_color)' }}
                    className="fixed  modal-pops grid content-center inset-0  bg-opacity-75 grid content-center z-50"
                >
                    <div style={{ height: 'auto', background: 'var(--tgui--bg_color)' }} className="mx-auto my-auto modal-pop relative  p-6 rounded-lg w-11/12">
                        <div
                            onClick={() => closeModall()}

                            className=" absolute right-8 text-gray-500 px-4 py-3 mx-auto rounded-md"
                        >
                            <FontAwesomeIcon icon={faClose} style={{ 'margin': 'auto auto' }} size="2x" />
                        </div>
                        <h2 style={{ color: 'var(--tgui--section_header_text_color)' }} className="text-xl font-bold mb-4">Message to {messageTo}</h2>

                        <textarea

                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="p-2 bg-gray-100 m-6 w-10/12"
                        />

                        <button onClick={() => {

                            sendMessage()
                        }} style={{ background: 'var(--tgui--button_color', color: 'var(--tgui--button_text_color)' }} className="block px-4 h-fit rounded-lg py-2 my-auto">Send</button>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Smm;