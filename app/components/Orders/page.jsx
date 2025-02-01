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
                .from("orders")
                .select("*")
                .eq('father', 6528707984);
            if (error) {
                console.log(error);
            } else {
                setData(initialData); // Set the initial data
                setLoader(false)

            }
            const channel = supabase
            .channel("deposit_channewerlccb")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders",  filter: "father=eq.6528707984"}, (payload) => {
                //console.log("New order inserted:", payload.new);
              //  if(payload.new.father === 6528707984){
                // Add the new order to the state
                setData((prevData) => [payload.new, ...prevData]);
                
            })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: "father=eq.6528707984" }, (payload) => {
                //console.log("Order updated:", payload.new.status, "for oid", payload.new.oid);
                // if (payload.new.uid == 5928771903) {
                // Find the updated order in the current state
                setData((prevData) =>
                    prevData.map((item) =>
                        item.oid === payload.new.oid
                            ? { ...item, status: payload.new.status, start_count: payload.new.start_from, remains: payload.new.remains } // Update the status in the state
                            : item
                    )
                );

                // If the updated order's status is not "Completed", call fetchOrderStatus
                

            })



            .subscribe();

        // Cleanup the subscription on component unmount
        return () => {
            channel.unsubscribe();
        };
        };

        auth(); // Call the auth function whethe component is mounted
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = data.filter((item) =>
        item.oid?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
            <Section header="Orders"style={{color: 'black',backgroundColor: 'var(--tgui--section_header_background_color)'}} >
                <div style={{ width: "100%" }} className=" mx-auto">
                    {loader && <MyLoader />}
                    <div style={{ borderRadius: "10px" }} className="scrollabler w-full overflow-x-auto">
                        <ul>
                            {!loader &&
                                <table style={{ width: "100%" }} className="   rounded-lg shadow-md">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                Starting From
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Remains</th>

                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Link</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                                Charge (ETB)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((items, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm ">{items.status}</td>
                                                <td className="px-6 py-4 text-sm ">{items.oid}</td>
                                                <td className="px-6 py-4 text-sm ">{items.start_count}</td>
                                                <td className="px-6 py-4 text-sm ">{items.remains}</td>
                                                <td className="px-6 py-4 text-sm ">{items.quantity}</td>
                                                <td className="px-6 py-4 text-sm">{items.link}</td>
                                                <td className="px-6 py-4 text-sm ">{items.charge}</td>
                                                <td className="px-6 py-4 text-sm ">{items.service}</td>
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