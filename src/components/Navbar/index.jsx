import { Burger, Transition } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
// import { navItems } from '../../utils/navItems';
import { Link, useLocation, useNavigation } from 'react-router-dom';
import CUILogo from '../../../public/assets/COMSATS-University-logo.png'
// import LoginButton from './LoginButton';
import GeoSearch from '../mapComponent/GeoSearch';

const noNavbar = [
  '/signupverify',
  '/verification',
  '/newpassword',
  '/forgotpassword',
  '/signup',
  '/login',
  '/add-password'
];

export default () => {

  const { pathname } = useLocation();
  // const [opened, { toggle, close }] = useDisclosure(true);
  const [include, setInclude] = useState(false);

  useEffect(() => {
    if (pathname === '/map') {
      // if (!opened) toggle();
      // setSidebarState(true);
    } else {
      close();
      // setSidebarState(false);
    }
    noNavbar.includes(window.location.pathname)
      ? setInclude(false)
      : setInclude(true);
  }, [pathname]);



  return (
    <Transition mounted={include} transition="slide-down" duration={500}>
      {(transitionStyles) => (
        <div
          style={{ zIndex: 1, position: 'relative' }}
          className="bg-gradient-to-bl from-[#0B9CEC] shadow-md to-[#540c87] mt-6 mr-3 ml-5 p-5 flex items-center rounded-[12px] transition-transform duration-300 h-[63px] w-[97%] search-bar"
        >
          {/* {pathname === '/' && ( */}
          <Burger
            // opened={opened}
            // onClick={() => {
            //   toggle();
            //   // setSidebarState(!opened)
            // }}
            aria-label="Toggle navigation"
            style={{ border: 'none', outline: 'none' }}
            color="#FFFFFF"
            size="20"
          />
          {/* )} */}
          <div className='w-16 h-auto'>
            <img
              src={CUILogo}
              alt="University Logo"
              className="h-auto px-1 md:w-20 md:h-auto"
            />          </div>
          {/* <Link to="/">
            <h1 className="text-white text-2xl font-black italic mx-2.5">
              CUI
            </h1>
          </Link> */}
          <div className="flex items-center space-x-1.5 gap-8">
            <NavItemsOrSearchBar />
          </div>
          <div className="flex items-center ml-auto mr-2">
            {/* <UploadProgress /> */}
            {/* <LoginButton /> */}
          </div>
        </div>

      )}
    </Transition>
  );
}


const NavItemsOrSearchBar = () => {
  const { pathname } = useLocation();
  const [showGeoSearch, setShowGeoSearch] = useState(false);
  const [showNavLinks, setShowNavLinks] = useState(true);

  useEffect(() => {
    if (pathname === '/') {
      setShowNavLinks(false);
      setTimeout(() => setShowGeoSearch(true), 600); // delay for the exit transition of NavLinks
    } else {
      setShowGeoSearch(false);
      setTimeout(() => setShowNavLinks(true), 600); // delay for the exit transition of GeoSearch
    }
  }, [pathname]);

  return (
    <div className='relative flex flex-1'>
      <Transition
        mounted={showGeoSearch}
        transition="scale"
        duration={500}
        exitDuration={500}
      >
        {(transitionStyles) => (
          <div >
            <GeoSearch />
          </div>
        )}
      </Transition>
    </div>
  );
};