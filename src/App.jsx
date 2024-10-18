

import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {

  return (
    <>
      <MantineProvider >

      <div className="flex flex-col bg-[#f3f4f6] h-[100vh]">
        <AppRoutes />
      </div>

      </MantineProvider>  
    </>
  )
}

export default App
