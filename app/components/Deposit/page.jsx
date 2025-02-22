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
  //  const { userData } = useUser();
    const [data, setData] = useState([]); // Adjust the type based on your data structure
    const [totalDeposited, setTotalDeposited] = useState(0);
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

        const auth = async () => {
            setLoader(true)
            // Fetch the initial data (orders) from Supabase or any other source
            const { data: initialData, error } = await supabase
                .from("deposit")
                .select("*")
                .eq('father', user.id);
            if (error) {
                console.log(error);
            } else {
                console.log(initialData)
                setData(initialData); // Set the initial data
                setLoader(false)

            }


            const channel = supabase
            .channel("deposit_channelb")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "deposit",filter: `father=eq.${user.id}` }, (payload) => {
                //console.log("New order inserted:", payload.new);
              //  if(payload.new.father === userData.userId){
                // Add the new order to the state
                setData((prevData) => [payload.new, ...prevData]);
                
            })



            .subscribe();

        // Cleanup the subscription on component unmount
        return () => {
            channel.unsubscribe();
        };

        };

        
          

        auth(); 
    }
}// Call the auth function when the component is mounted
async function getDepositedAmount() {
    const { data, error } = await supabase
      .from('deposit')
      .select('amount')
      .eq('father', 6187538792)
      .gte('created', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
    if (error) {
      console.error('Error fetching deposit data:', error);
      return;
    }
  
    // Calculate total deposited amount
    const totalDeposited = data.reduce((sum, row) => sum + Number(row.amount), 0);
    setTotalDeposited(totalDeposited);
    
  }
  getDepositedAmount();

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
            <Section  header={(
                    <>
                        <div className="tgui-c3e2e598bd70eee6 tgui-080a44e6ac3f4d27 tgui-d0251b46536ac046 tgui-809f1f8a3f64154d tgui-266b6ffdbad2b90e tgui-8f63cd31b2513281 tgui-9c200683b316fde6">Deposit history
                            <div style={{ fontSize: '12px' }} className="ml-auto inline w-fit text-white font-mono pl-4">24hrs: 101ETB  Monthly: 1000ETB </div>
                        </div>

                    </>
                )} style={{ color: 'white',backgroundColor: 'var(--tgui--secondary_bg_color)' }}>
                <div style={{ width: "100%"}} className=" mx-auto">
                    {loader && <MyLoader />}
                    total: {totalDeposited}
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