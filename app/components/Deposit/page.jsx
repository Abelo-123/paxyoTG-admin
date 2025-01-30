"use client"
import { Input, Section } from "@telegram-apps/telegram-ui";
import MyLoader from "../Loader/page";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";

const Orders = () => {
    const [loader, setLoader] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [searchClicked, setsearchClicked] = useState(false)

    const [data, setData] = useState([]); // Adjust the type based on your data structure

    useEffect(() => {
        const auth = async () => {
            setLoader(true)
            // Fetch the initial data (orders) from Supabase or any other source
            const { data: initialData, error } = await supabase
                .from("deposit")
                .select("*")
                .eq('father', 6528707984);
            if (error) {
                console.log(error);
            } else {
                console.log(initialData)
                setData(initialData); // Set the initial data
                setLoader(false)

            }


            const channel = supabase
            .channel("deposit_channelb")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "deposit",filter: `father=eq.6528707984` }, (payload) => {
                //console.log("New order inserted:", payload.new);
              //  if(payload.new.father === 6528707984){
                // Add the new order to the state
                setData((prevData) => [payload.new, ...prevData]);
                
            })



            .subscribe();

        // Cleanup the subscription on component unmount
        return () => {
            channel.unsubscribe();
        };

        };

        
          

        auth(); // Call the auth function when the component is mounted
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = data.filter((item) =>
        item.did?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="grid place-content-end pr-12 w-screen p-3 ">
                {!searchClicked && <FontAwesomeIcon onClick={() => setsearchClicked(true)} icon={faSearch} style={{ 'margin': 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" /> || <FontAwesomeIcon onClick={() => setsearchClicked(false)} icon={faClose} style={{ 'margin': 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" />}
            </div>
            {searchClicked && (<div className="mb-4">
                <Input
                    type="text"
                    header="Search by DID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full"
                />
            </div>
            )}
            <Section header="Deposit" style={{ color: 'white',backgroundColor: 'var(--tgui--secondary_bg_color)' }}>
                <div style={{ width: "100%"}} className=" mx-auto">
                    {loader && <MyLoader />}
                    <div style={{ borderRadius: "10px" }} className="scrollabler w-full overflow-x-auto">
                        <ul>
                            {!loader &&
                                <table style={{ width: "100%" }} className="  rounded-lg shadow-md">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                did
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                uid
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">transaction</th>

                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className=" ">
                                        {filteredData.map((items, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm ">{items.did}</td>
                                                <td className="px-6 py-4 text-sm ">{items.amount}</td>
                                                <td className="px-6 py-4 text-sm ">{items.uid}</td>
                                                <td className="px-6 py-4 text-sm ">{items.transaction}</td>
                                                <td className="px-6 py-4 text-sm ">{items.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                        </ul>


                    </div>
                </div>
            </Section>
        </>
    );
}

export default Orders;