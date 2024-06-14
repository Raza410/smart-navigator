import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Map from './pages/Map.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';


const router = createBrowserRouter ([
  {
    path: "/",
    element: <Map />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <MantineProvider>

    <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
)
