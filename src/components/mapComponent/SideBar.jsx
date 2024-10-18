import React, { useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const folderNames = {
  "Academic block 1": "Academic_block_1",
  "Acadamic block 2": "Academic_block_2",
  "Acadamic Block 3": "Academic_block_3",
  "Library": "library",
  "Medical Center": "Medical Center",
  "Student Services Center": "Student service center",
  "Mosque": "Mosque",
  "R&D Lab": "R&D Lab",
  "N Block": "N Block",
  "Library": "Library",
  "Canteen": "canteen",
  "Faculity block 1": "Faculity block 1",
  "faculity block 2": "faculty block 2",
  "Physics Block": "Physics Block",
  "Store": "Store",
  "SSBC": "SSBC",
  "Staff Canteen": "satff canteen",
  "Students Canteen": "Students_Canteen",
  "SportsComplex": "sports complex",
  "Arts Building": "arts_building",
  "Sports Complex": "sports_complex",
};

const loadImages = (buildingName) => {
  const imagePaths = [];
  const folderName = folderNames[buildingName];
  const imageNames = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
  ]; 

  imageNames.forEach((imageName) => {
    const imagePath = `/images/${folderName}/${imageName}`;
    imagePaths.push(imagePath);
  });

  return imagePaths;
};

export default function Sidebar({ selectedBuilding, onClose }) {
  const [imagePaths, setImagePaths] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sidebarHeight, setSidebarHeight] = useState(384);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (selectedBuilding.building_name || selectedBuilding.name) {
      const buildingName = selectedBuilding.building_name || selectedBuilding.name;
      console.log("Selected building:", buildingName);
      fetchImagesForBuilding(buildingName);
      fetchDepartments(buildingName); 
    }
  }, [selectedBuilding]);

  const fetchImagesForBuilding = (buildingName) => {
    try {
      console.log(`Fetching images for building: ${buildingName}`);
      const images = loadImages(buildingName); 
      setImagePaths(images); 
    } catch (error) {
      console.error(`Error loading images for building "${buildingName}":`, error);
      setImagePaths([]); 
    }
  };

  const fetchDepartments = async (buildingName) => {
    try {
      console.log(`Fetching departments for building: ${buildingName}`);
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

  const handleTouchStart = (e) => {
    sidebarRef.current.startY = e.touches[0].clientY;
    sidebarRef.current.startHeight = sidebarHeight;
  };

  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const heightDifference = sidebarRef.current.startY - touchY;
    const newHeight = Math.min(
      Math.max(sidebarRef.current.startHeight + heightDifference, 200),
      window.innerHeight
    );
    setSidebarHeight(newHeight);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000, 
  };

  return (
    <div
    className="absolute right-0 z-50 w-11/12 min-h-screen mr-6 overflow-y-auto bg-white rounded-md shadow-lg mt-80 md:mt-24 top-16 md:inset-y-0 md:max-w-96"


      style={{
        height: window.innerWidth >= 768 ? "100vh" : `${sidebarHeight}px`,
      }}
      ref={sidebarRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="flex items-center justify-center w-full py-2 cursor-pointer">
        <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="mb-4 text-2xl font-semibold text-gray-600">
            {selectedBuilding.building_name || selectedBuilding.name}
          </h2>
          <div className="mb-3 overflow-hidden rounded-lg" style={{ height: '250px' }}>
  {imagePaths.length === 0 ? (
    <p>No images available for this building.</p>
  ) : (
    <>
      {imagePaths.length === 1 ? (
        <img
          src={imagePaths[0]} 
          alt={`Single image for ${selectedBuilding.building_name || selectedBuilding.name}`}
          className="object-contain w-full h-full rounded-lg" 
          style={{ maxHeight: '250px' }} 
        />
      ) : (
        <Slider {...settings}>
          {imagePaths.map((imagePath, index) => (
            <div key={index} className="image-slide">
              <img
                src={imagePath} 
                alt={`Slide ${index}`}
                className="object-contain w-full h-full rounded-lg" 
                style={{ minHeight: '250px' }} 
              />
            </div>
          ))}
        </Slider>
      )}
    </>
  )}
</div>

          {departments.length > 0 && (
            <div className="p-4 mt-2 rounded-lg shadow-lg">
              <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-600">
                Departments in this Building
              </h3>
              <div>
                {departments.map((department) => (
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
