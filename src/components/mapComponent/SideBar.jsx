import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ selectedBuilding, onClose }) {
    const [departments, setDepartments] = useState([]);
    const [sidebarHeight, setSidebarHeight] = useState(384); // Initial height for mobile screens
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (selectedBuilding.building_name) {
            fetchDepartments(selectedBuilding.building_name);
        } else {
            fetchDepartments(selectedBuilding.name);
        }
    }, [selectedBuilding]);

    const fetchDepartments = async (building_name) => {
        try {
            const response = await fetch(`http://localhost:3002/departments?buildingName=${building_name}`);
            const data = await response.json();
            setDepartments(data); // Assuming the API returns an array of department objects
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleTouchStart = (e) => {
        sidebarRef.current.startY = e.touches[0].clientY;
        sidebarRef.current.startHeight = sidebarHeight;
    };

    const handleTouchMove = (e) => {
        const touchY = e.touches[0].clientY;
        const heightDifference = sidebarRef.current.startY - touchY;
        const newHeight = Math.min(Math.max(sidebarRef.current.startHeight + heightDifference, 200), window.innerHeight);
        setSidebarHeight(newHeight);
    };

    return (
        <div
            className="fixed bottom-0 right-0 z-50 overflow-y-auto bg-white shadow-lg md:inset-y-0 md:w-full md:max-w-96"
            style={{ height: window.innerWidth >= 768 ? '100vh' : `${sidebarHeight}px` }} // Full height on desktop screens
            ref={sidebarRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="flex items-center justify-center w-full py-2 cursor-pointer">
                <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
            </div>
            <div className="p-6">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-600 focus:outline-none">
                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="mt-4">
                    {selectedBuilding.building_name ? (
                        <>
                            <h2 className="mb-2 text-xl font-bold">{selectedBuilding.building_name}</h2>
                            {selectedBuilding.cui_building && selectedBuilding.cui_building.imagespath && (
                                <div className="mb-3 overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                                    <img
                                        src={`/${selectedBuilding.cui_building.imagespath}`}
                                        alt={selectedBuilding.building_name}
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="mb-2 text-xl font-bold">{selectedBuilding.name}</h2>
                            {selectedBuilding.imagespath && (
                                <div className="mb-3 overflow-hidden rounded-lg aspect-w-16 aspect-h-9 building-image">
                                    <img
                                        src={`/${selectedBuilding.imagespath}`}
                                        alt={selectedBuilding.name}
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {departments.length > 0 && (
                        <div className="p-4 mt-2 rounded-lg shadow-lg">
                            <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-600">Departments in this Building</h3>
                            <div>
                                {departments.map(department => (
                                    <p key={department.id} className="p-2 mb-2 text-gray-600 border border-gray-300 rounded">
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
