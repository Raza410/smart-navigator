import React, { useEffect, useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosInstance from '../../APIs/axiosInstance';

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
  "Acadamic block 2": 4,
  "Acadamic Block 3": 4,
  Library: 5,
  "Medical Center": 5,
  "Student Services Center": 3,
  Mosque: 6,
  "R & D LaB": 5,
  "N Block": 4,
  Canteen: 2,
  "Faculity block 1": 5,
  "faculity block 2": 6,
  "Physics Block": 5,
  Store: 3,
  SSBC: 4,
  "Staff Canteen": 2,
  "Students Canteen": 3,
  SportsComplex: 3,
  "Arts Building": 1,
  "Sports Complex": 2,
};


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

  const numberOfSlides = slidesPerFolder[normalizedBuildingName] || 0; 
  for (let i = 1; i <= numberOfSlides; i++) {
    const imagePath = `/images/${folderName}/image${i}.jpg`;

    if (imagePath) {
      imagePaths.push(imagePath); 
    }
  }

  return imagePaths.filter((path) => path); 
};

export default function Sidebar({ selectedBuilding, onClose }) {
  const [imagePaths, setImagePaths] = useState([]);
  const [departments, setDepartments] = useState([]);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (selectedBuilding.building_name || selectedBuilding.name) {
      const buildingName =
        selectedBuilding.building_name || selectedBuilding.name;
      fetchImagesForBuilding(buildingName); 
      fetchDepartments(buildingName); 
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
      setImagePaths([]); 
    }
  };


  const fetchDepartments = async (buildingName) => {
    try {
      const response = await axiosInstance.get(`/departments`, {
        params: { buildingName },
      });
      const data = response.data;
      console.log("Departments fetched:", data);
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const settings =
  imagePaths.length > 1
    ? {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,         
        autoplaySpeed: 2000,    
        speed: 1000,             
      }
    : {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      };


  const validDepartments = departments.filter(
    (department) => department.departments
  );

  return (
    <div
  className="fixed w-11/12 md:max-h-[calc(100vh-80px)] max-h-[56vh] overflow-y-auto bg-white rounded-md shadow-lg 
    left-1/2 md:left-6 transform md:translate-x-0 -translate-x-1/2 md:top-1 top-72 md:max-w-96 md:inset-y-0 md:mt-24 "
  ref={sidebarRef}
>

      <div className="px-4 py-2">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="">
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
                    alt={`Single image for ${selectedBuilding.building_name || selectedBuilding.name}`}
                    className="w-full h-full bg-cover rounded-lg"
                    style={{ minHeight: "250px" }}
                  />
                ) : (
                  <Slider {...settings}>
                    {imagePaths.map((imagePath, index) =>
                      imagePath ? ( 
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



