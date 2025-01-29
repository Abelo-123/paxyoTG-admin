"use client";
import { useEffect } from "react";
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot } from '@telegram-apps/telegram-ui';// Adjust as necessary
import '@telegram-apps/telegram-ui/dist/styles.css';
import Deposit from "./components/Deposit/page";
import Smm from "./components/User/page";
import Orders from './components/Orders/page';
import Accounts from './components/Accounts/page';
import React from "react";
import { useUser } from "./components/UserContext";
import { supabase } from "./lib/supabaseClient";
import { useNot } from "./components/StatusContext";
import { useActivePage } from './components/ActivePageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from "@telegram-apps/telegram-ui";
import MyLoader from "./components/Loader/page";
import { faRotateBackward } from "@fortawesome/free-solid-svg-icons";


const Telegram = () => {
  const { activePage } = useActivePage();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { setUserData, userData } = useUser();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { useNotification, setNotification } = useNot();
  // useEffect(() => {
  //   // Load the Telegram Web App JavaScript SDK
  //   const script = document.createElement("script");
  //   script.src = "https://telegram.org/js/telegram-web-app.js?2";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     const Telegram = window.Telegram;

  //     if (window.Telegram && window.Telegram.WebApp) {
  //       Telegram.WebApp.expand() // Get the app version
  //       const { user } = Telegram.WebApp.initDataUnsafe;
  //       setUserData((prevNotification) => ({
  //         ...prevNotification,
  //         username: user.username,
  //         firstName: user.first_name,
  //         lastName: user.last_name,
  //         userId: user.id,
  //         profile: user.photo_url,
  //         father: user.first_name
  //       }));
  //     }

  //   };



  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  useEffect(() => {
    const checkNot = async () => {
      const { data } = await supabase
        .from('adminmessage')
        .select('message')
        .eq('to', 6187538792)
        .eq('father', 6528707984)
        .eq('seen', true)

      if (data.length > 1) {
        setNotification((prevNotification) => ({
          ...prevNotification,
          notificationLight: true,
        }));

      } else {
        //console.log("no data")
      }
    }
    checkNot()


    //status, trId  ,amount, date

    const channel = supabase
      .channel('adminmessage')
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "adminmessage" }, (payload) => {
        //console.log("New order inserted:", payload.new);
        // Add the new order to the state
        if ((Number(payload.new.for) === userData.userId || Number(payload.new.to) === userData.userId) && payload.new.seen === true) {
          // console.log("New admin message for to=100:", payload.new);

          // Update state or notify the user
          setNotification((prevNotification) => ({
            ...prevNotification,
            notificationLight: true,
          }));

          // Optionally display a user-friendly toast
          //showToast(`New message: ${payload.new.message}`);
        }
        if (Number(payload.new.father) === 6528707984 && Number(payload.new.for) === 6187538792 && payload.new.seen === true) {
          // console.log("New admin message for to=100:", payload.new);

          // Update state or notify the user
          setNotification((prevNotification) => ({
            ...prevNotification,
            notificationLight: true,
          }));

          // Optionally display a user-friendly toast
          //showToast(`New message: ${payload.new.message}`);
        }
        // if (payload.new.seen === true) {
        //   setNotification((prevNotification) => ({
        //     ...prevNotification, // Spread the previous state
        //     notificationLight: true
        //     // Update the `deposit` field
        //   }));
        //   //  console.log(payload.new)
        // }

      })
      .subscribe();


    return () => {
      channel.unsubscribe();
    };
  }, [])


  return (
    <>

      <AppRoot>

        <div className='w-screen' >
          {
            useNotification.notificationModal && (
              <div style={{
                zIndex: 900, background: 'var(--tgui--section_bg_color)'
              }} className=" modal-popp fixed inset-0 top-0 bottom-0 w-screen ">

                {useNotification.notificationLoader && <MyLoader style={{ marginTop: '2rem' }} />}
                <div style={{ height: '85%' }} className='mt-2 '>
                  <div className="  w-screen " >
                    {

                      !useNotification.notifcationLoader && useNotification.notificationData && useNotification.notificationData.map((items, index) => (

                        <li key={index} className="flex w-11/12 p-3 mx-auto" style={{ borderTop: '2px solid black' }}>
                          <div className="block w-full px-2">
                            <div className="text-right ml-auto"> {items.from}</div>
                            <div className="text ml-2"> {items.message}</div>
                          </div>
                        </li>

                      ))

                    }
                  </div>
                </div>
                <div className='absolute  w-full grid place-content-center bottom-4'>
                  < div onClick={() => {
                    setNotification((prevNotification) => ({
                      ...prevNotification, // Spread the previous state
                      notificationModal: false,
                      notificationData: [],
                      notificationLoader: true,
                      // Update the `deposit` field
                    }));
                  }} className="p-3 ">
                    <FontAwesomeIcon icon={faRotateBackward} style={{ 'margin': 'auto auto', color: "var(--tgui--section_header_text_color)" }} size="2x" />
                    <Text style={{ display: 'inline', margin: 'auto 0.5rem', fontWeight: '700', color: 'var(--tgui--section_header_text_color)' }}>Back</Text>
                  </div>
                </div>
              </div >
            )
          }
          <div
            id="1"
            className={`w-screen ${activePage === 1 ? '' : 'hidden'}`}>
            <Smm />
          </div>
          <div
            id="2"
            className={`w-screen ${activePage === 2 ? '' : 'hidden  '} `}><Deposit />
          </div>
          <div
            id="3"
            className={`w-screen ${activePage === 3 ? '' : 'hidden  '} `}><Orders />
          </div>

          <div
            id="4"
            className={`w-screen ${activePage === 4 ? '' : 'hidden  '} `}><Accounts />
          </div>
          {/* <div
            id="5"
            className={`w-screen ${activePage === 5 ? '' : 'hidden  '} `}><Account />
          </div> */}

        </div>

      </AppRoot>
    </>
  );
};



export default Telegram;