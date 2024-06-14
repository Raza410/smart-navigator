import { Burger, Transition } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
// import { navItems } from '../../utils/navItems';
import { Link, useLocation, useNavigation } from 'react-router-dom';
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
          style={{ zIndex: 1, position: 'relative', ...transitionStyles }}
          className="bg-gradient-to-bl from-[#0B9CEC] shadow-md to-[#540c87] mt-6 mr-3 ml-5 p-3 flex items-center rounded-[12px] transition-transform duration-300 h-[63px] w-[97%] "
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
          <Link to="/">
            <h1 className="text-white text-2xl font-black italic mx-2.5">
              CUI
            </h1>
          </Link>
          <div className="flex items-center space-x-1.5 gap-8">
            <NavItemsOrSearchBar />
          </div>
          <div className="ml-auto flex mr-2 items-center">
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
    <div className='flex-1 flex relative'>
      <Transition
        mounted={showGeoSearch}
        transition="scale"
        duration={500}
        exitDuration={500}
      >
        {(transitionStyles) => (
          <div style={{ ...transitionStyles }}>
            <GeoSearch />
          </div>
        )}
      </Transition>
      {/* <Transition
        mounted={showNavLinks}
        transition="slide-left"
        duration={500}
        exitDuration={500}
      >
        {(transitionStyles) => (
          <div style={{ ...transitionStyles }}>
            Assuming navItems is defined elsewhere
            {navItems.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="truncate text-white mx-4 focus:border-b-2 active:border-b-2 focus:border-gray-300 active:border-gray-200 py-[2px] hover:text-gray-200"
              >
                {item.text}
              </Link>
            ))}
          </div>
        )}
      </Transition> */}
    </div>
  );
};