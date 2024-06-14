import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { FaSignInAlt } from 'react-icons/fa';
import { Button, Menu } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { menuBarItems } from '../../utils/menuBarItems';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import useUserInfo, { setUserInfo } from '../../hooks/useUserInfo';

function LoginButton() {
  const { logout, authToken } = useContext(AuthContext);
  const userInfo = useUserInfo();
  const isAuthenticated = !!authToken && authToken !== 'no token';

  useEffect(() => {
    if (isAuthenticated) {
      const localUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      // setUserData(userInfo);
      setUserInfo(localUserInfo);
    }
  }, [isAuthenticated, authToken]);

  if (isAuthenticated) {
    const userRole = userInfo?.role;

    // Remove organization route for non-super admin users
    let filteredMenuBarItems =
      userRole === 'super admin'
        ? menuBarItems
        : menuBarItems.filter(
            (route) =>
              route.to !== '/organization' && route.to !== '/activity-log'
          );
    // Only include usermanagement for admin or super admin
    if (userRole !== 'admin' && userRole !== 'super admin') {
      filteredMenuBarItems = filteredMenuBarItems.filter(
        (route) => route.to !== '/usermanagement'
      );
    }
    console.log('userInfo : ', userInfo);
    return (
      <div className="flex items-center mr-2">
        {/* User's name and profile image */}
        {userInfo && (
          <Menu shadow="md" width={200} position="bottom-end">
            {userInfo.firstname && userInfo.lastname && (
              <div className="flex flex-col items-end text-white m-1 mx-2">
                <h6 className="text-sm">
                  {userInfo.firstname + ' ' + userInfo.lastname}
                </h6>
                <p className="text-[10px]">{userInfo.organization.name}</p>
              </div>
            )}
            <Menu.Target>
              <div className="h-9 w-9 flex justify-center items-center cursor-pointer shadow-lg rounded-full bg-white border-black border">
                {userInfo?.profileImage ? (
                  <img
                    src={userInfo?.profileImage}
                    alt="User"
                    className="w-9 h-9 rounded-full border object-cover"
                  />
                ) : (
                  <CgProfile className="text-gray-100 text-2xl" />
                )}
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              {filteredMenuBarItems.map((item, index) => (
                <Link to={item.to} key={index}>
                  <Menu.Item
                    leftSection={item.icon}
                    onClick={item.label === 'Logout' ? logout : undefined}
                  >
                    {item.label}
                  </Menu.Item>
                </Link>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    );
  } else {
    return (
      <Link to="/login">
        <Button
          style={{
            color: 'black',
            backgroundColor: 'white',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderStyle: 'solid',
            borderWidth: '1px',
          }}
        >
          <FaSignInAlt />
          <span style={{ marginLeft: '0.5rem' }}>Log In</span>
        </Button>
      </Link>
    );
  }
}

export default LoginButton;
