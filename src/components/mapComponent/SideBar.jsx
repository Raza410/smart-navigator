import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ selectedBuilding, onClose }) {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (selectedBuilding.building_name) {
            fetchDepartments(selectedBuilding.building_name);
        } else {
            fetchDepartments(selectedBuilding.name);
        }
    }, [selectedBuilding]);

    const fetchDepartments = async (building_name) => {
        try {
            const response = await fetch(`http://localhost:3001/departments?buildingName=${building_name}`);
            const data = await response.json();
            setDepartments(data); // Assuming the API returns an array of department objects
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 max-w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-600 focus:outline-none">
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="mt-4">
                    {selectedBuilding.building_name ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">{selectedBuilding.building_name}</h2>
                            {selectedBuilding.cui_building && selectedBuilding.cui_building.imagespath && (
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3">
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
                            <h2 className="text-xl font-bold mb-2">{selectedBuilding.name}</h2>
                            {selectedBuilding.imagespath && (
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3 building-image">
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
                        <div className="shadow-lg rounded-lg p-4 mt-2">
                            <h3 className="text-gray-600 text-xl font-semibold mb-2 mt-4">Departments in this Building</h3>
                            <div>
                                {departments.map(department => (
                                    <p key={department.id} className="text-gray-600 border border-gray-300 p-2 mb-2 rounded">
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
