"use client"
import { Tabbar, Text } from "@telegram-apps/telegram-ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-regular-svg-icons';
import { useActivePage } from "../ActivePageContext";
import { faMoneyBill, faPerson } from "@fortawesome/free-solid-svg-icons";


const Tab = () => {

    const { activePage, updateActivePage } = useActivePage();

    return (

        <>

            <Tabbar style={{ background: 'red', border: '2px solid red', display: 'grid', margin: '0rem', placeItems: 'center', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <Tabbar.Item onClick={() => updateActivePage(1)}>
                    <div className='flex flex-col'>

                        <FontAwesomeIcon icon={faPerson} style={{ color: activePage === 1 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '1.2rem' }} />
                        <Text weight="3" style={{ color: activePage === 1 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '0.82rem' }}>User</Text>
                    </div>
                </Tabbar.Item>
                <Tabbar.Item onClick={() => updateActivePage(2)}>
                    <div className='flex flex-col'>

                        <FontAwesomeIcon icon={faMoneyBill} style={{ color: activePage === 2 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '1.2rem' }} />
                        <Text weight="3" style={{ color: activePage === 2 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '0.82rem' }}>Deposit</Text>
                    </div>
                </Tabbar.Item>

                <Tabbar.Item onClick={() => updateActivePage(3)}>
                    <div className='flex flex-col'>

                        <FontAwesomeIcon icon={faClock} style={{ color: activePage === 3 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '1.2rem' }} />
                        <Text weight="3" style={{ color: activePage === 3 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '0.82rem' }}>Order</Text>
                    </div>
                </Tabbar.Item>
                <Tabbar.Item onClick={() => updateActivePage(4)}>
                    <div className='flex flex-col'>

                        <FontAwesomeIcon icon={faUser} style={{ color: activePage === 4 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '1.2rem' }} />
                        <Text weight="3" style={{ color: activePage === 4 ? 'var(--tgui--link_color)' : 'var(--tgui--subtitle_text_color)', fontSize: '0.82rem' }}>Account</Text>
                    </div>
                </Tabbar.Item>
            </Tabbar>


        </>
    );
}

export default Tab;