"use client"
import { Input, Section } from "@telegram-apps/telegram-ui";
import MyLoader from "../Loader/page";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useUser } from '../UserContext';

const Orders = () => {
    
        const { setUserData } = useUser()
    const [loader, setLoader] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [searchClicked, setsearchClicked] = useState(false)
  //  const { userData } = useUser();
    const [data, setData] = useState([]); // Adjust the type based on your data structure
    const [totalDeposited, setTotalDeposited] = useState(0);
    const [totalDeposited30, setTotalDeposited30] = useState(0);
    const [allday, setAllday] = useState(0);
    const [profit, setProfit] = useState(null);
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
}, []);

async function getDepositedAmount() {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?2";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      const Telegram = window.Telegram;

      if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.expand() // Get the app version
        const { user } = Telegram.WebApp.initDataUnsafe;


            const { data, error } = await supabase
            .from('deposit')
            .select('amount')
            .eq('father', user.id)
            .gte('created', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            const { data: data30, error: error30 } = await supabase
            .from('deposit')
            .select('amount')
            .eq('father', user.id)
            .gte('created', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

            const { data: dataall, error: errorall } = await supabase
            .from('deposit')
            .select('amount')
            .eq('father', user.id)

            const { data: dataWithdrawl, error: errorWithdrawl } = await supabase
            .from('admin_withdrawl')
            .select('amount')
            .eq('for', user.id)
            .eq('status', 'Sent')

            if (error || error30 || errorall || errorWithdrawl) {
            console.error('Error fetching deposit data:', error || error30);
            return;
            }

            // Ensure data is not null before reducing
            const total24Hours = data ? data.reduce((sum, row) => sum + Number(row.amount), 0) : 0;
            const total30Days = data30 ? data30.reduce((sum, row) => sum + Number(row.amount), 0) : 0;
            const total = dataall ? dataall.reduce((sum, row) => sum + Number(row.amount), 0) : 0;
            const totalwithdrawl = dataWithdrawl ? dataWithdrawl.reduce((sum, row) => sum + Number(row.amount), 0) : 0;

            setTotalDeposited(total24Hours);
            setTotalDeposited30(total30Days);
            setAllday(total);
            setProfit(Number(Number(total) - Number(totalwithdrawl)))
            setUserData((prevData) => ({ ...prevData, profit: Number(Number(total) - Number(totalwithdrawl)) }));
        }}
    }


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?2";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const Telegram = window.Telegram;

      if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.expand() // Get the app version
        const { user } = Telegram.WebApp.initDataUnsafe;

    getDepositedAmount(); // Initial fetch

    // Real-time subscription
    const subscription = supabase
      .channel('realtime:deposit')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deposit', filter: `father=eq.${user.id}` },
        async (payload) => {
          console.log('New deposit added:', payload.new);
          await getDepositedAmount(); // Recalculate when new data is inserted
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'admin_withdrawl', filter: `for=eq.${user.id}` },
        async (payload) => {
          console.log('New deposit added:', payload.new);
          await getDepositedAmount(); // Recalculate when new data is inserted
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe(); // Cleanup subscription when unmounting
    };
    }}
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
             <div style={{color: 'white'}}> total: {totalDeposited} 30: {totalDeposited30} all: {allday} availabe: {profit}</div> 
            <Section  header={(
                    <>
                        <div className="tgui-c3e2e598bd70eee6 tgui-080a44e6ac3f4d27 tgui-d0251b46536ac046 tgui-809f1f8a3f64154d tgui-266b6ffdbad2b90e tgui-8f63cd31b2513281 tgui-9c200683b316fde6">Deposit history
                            <div style={{ fontSize: '12px' }} className="ml-auto inline w-fit text-white font-mono pl-4">24hrs: 101ETB  Monthly: 1000ETB </div>
                        </div>

                    </>
                )} style={{ color: 'white',backgroundColor: 'var(--tgui--secondary_bg_color)' }}>
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
};

export default Orders;