import React, { useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const folderNames = {
  "Academic block 1": "Academic_block_1",
  "Acadamic block 2": "Acadamic block 2",
  "Acadamic Block 3": "Acadamic Block 3",
  Library: "Library",
  "Medical Center": "Medical_Center",
  "Student Services Center": "Student_service_center",
  Mosque: "Mosque",
  "R & D LaB": "R & D LaB",
  "N Block": "N Block",
  Canteen: "canteen",
  "Faculity block 1": "Faculity block 1",
  "faculity block 2": "faculity block 2",
  "Physics Block": "Physics Block",
  Store: "Store",
  SSBC: "SSBC",
  "Staff Canteen": "Staff Canteen",
  "Students Canteen": "Students_Canteen",
  SportsComplex: "sports_complex",
  "Arts Building": "arts_building",
  "Sports Complex": "sports_complex",
};

const slidesPerFolder = {
  "Academic block 1": 3, 
  "Acadamic block 2": 1,
  "Acadamic Block 3": 3,
  Library: 3,
  "Medical Center": 3,
  "Student Services Center": 3,
  Mosque: 5,
  "R & D LaB": 4,
  "N Block": 3,
  Canteen: 2,
  "Faculity block 1": 2,
  "faculity block 2": 2,
  "Physics Block": 3,
  Store: 3,
  SSBC: 3,
  "Staff Canteen": 2,
  "Students Canteen": 2,
  SportsComplex: 2,
  "Arts Building": 1,
  "Sports Complex": 2,
};

// Function to load images based on building name
const loadImages = (buildingName) => {
  const imagePaths = [];
  const normalizedBuildingName = buildingName.trim();
  const folderName = folderNames[normalizedBuildingName];
  
  if (folderName) {
    console.log(`Loading images from folder: ${folderName}`);
  } else {
    console.warn(`No folder found for building: ${buildingName}`);
    return imagePaths;
  }

  // Define image names to check based on slidesPerFolder
  const numberOfSlides = slidesPerFolder[normalizedBuildingName] || 0; // Default to 0 if not found
  for (let i = 1; i <= numberOfSlides; i++) {
    const imagePath = `/images/${folderName}/image${i}.jpg`;
    
    // Assuming images are present, push only if it's a valid path
    if (imagePath) {
      imagePaths.push(imagePath); // Add only valid paths to the list
    }
  }

  return imagePaths.filter((path) => path); // Filter out any empty paths
};

export default function Sidebar({ selectedBuilding, onClose }) {
  const [imagePaths, setImagePaths] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sidebarHeight, setSidebarHeight] = useState(384);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (selectedBuilding.building_name || selectedBuilding.name) {
      const buildingName =
        selectedBuilding.building_name || selectedBuilding.name;
      fetchImagesForBuilding(buildingName); // Fetch images
      fetchDepartments(buildingName); // Fetch departments
    }
  }, [selectedBuilding]);

  const fetchImagesForBuilding = (buildingName) => {
    try {
      const images = loadImages(buildingName);
      setImagePaths(images);
    } catch (error) {
      console.error(
        `Error loading images for building "${buildingName}":`,
        error
      );
      setImagePaths([]); // Clear image paths if an error occurs
    }
  };



  // Fetch departments based on the building name
  const fetchDepartments = async (buildingName) => {
    try {
      const response = await fetch(
        `http://localhost:3001/departments?buildingName=${buildingName}`
      );
      const data = await response.json();
      console.log("Departments fetched:", data);
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Handle touch start for mobile swipe to resize
  const handleTouchStart = (e) => {
    sidebarRef.current.startY = e.touches[0].clientY;
    sidebarRef.current.startHeight = sidebarHeight;
  };

  // Handle touch move to resize the sidebar height on mobile
  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const heightDifference = sidebarRef.current.startY - touchY;
    const newHeight = Math.min(
      Math.max(sidebarRef.current.startHeight + heightDifference, 200),
      window.innerHeight
    );
    setSidebarHeight(newHeight);
  };

  // Settings for image slider (slick-carousel)
  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   // speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 0,
  //   // autoplay: false,
  //   arrows: false,
  // };
  
  const settings =
    imagePaths.length > 1
      ? {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        }
      : {
          dots: false,
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 0,
          arrows: false,
        };


  // Filter out valid departments to display
  const validDepartments = departments.filter(
    (department) => department.departments
  );

  return (
    <div
      className="fixed z-50 w-9/12 md:max-h-[calc(100vh-80px)] overflow-y-auto bg-white rounded-md shadow-lg left-6 top-16 md:max-w-96 md:inset-y-0 md:mt-24 mb-2 mt-8 max-h-[calc(100vh-90px)]"
      ref={sidebarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt--3">
          <h2 className="mb-4 text-2xl font-semibold text-gray-600">
            {selectedBuilding.building_name || selectedBuilding.name}
          </h2>
          <div
            className="mb-3 overflow-hidden rounded-lg"
            style={{ height: "250px" }}
          >
            {imagePaths.length === 0 ? (
              <p>No images available for this building.</p>
            ) : (
              <>
                {imagePaths.length === 1 ? (
                  <img
                    src={imagePaths[0]}
                    alt={`Single image for ${
                      selectedBuilding.building_name || selectedBuilding.name
                    }`}
                    className="w-full h-full bg-cover rounded-lg"
                    style={{ minHeight: "250px" }}
                  />
                ) : (
                  <Slider {...settings}>
                    {imagePaths.map((imagePath, index) =>
                      imagePath ? ( // Ensure only valid image paths are shown
                        <div key={index} className="image-slide">
                          <img
                            src={imagePath}
                            alt={`Slide ${index}`}
                            className="w-full h-full bg-cover rounded-lg"
                            style={{ minHeight: "250px" }}
                          />
                        </div>
                      ) : null
                    )}
                  </Slider>
                )}
              </>
            )}
          </div>

          {validDepartments.length > 0 && (
            <div className="p-4 mt-2 rounded-lg shadow-lg">
              <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-600">
                Departments in this Building
              </h3>
              <div>
                {validDepartments.map((department) => (
                  <p
                    key={department.id}
                    className="p-2 mb-2 text-gray-600 border border-gray-300 rounded bg-slate-50"
                  >
                    {department.departments}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
