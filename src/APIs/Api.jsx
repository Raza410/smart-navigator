// src/api/Api.js
import axiosInstance from './axiosInstance';
// Mapbox access token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYWxpaGFpZGVyLTIyIiwiYSI6ImNtMTBqZ2I4NzBoYncybG9yMmQ0MjhpcW4ifQ.y9JQepAw0Fpoygv5W6QYWQ";

// Function to handle search
export const handleSearch = async (query) => {
  try {
    const response = await axiosInstance.get('/search', { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

// fetch route 

export const fetchRoute = async (start, end) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;

  try {
    const response = await axiosInstance.get(url); 
    const data = response.data; 
    console.log("Route data received:", data);
    return data; 
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error; 
  }
};

// Function to fetch departments based on building name
export const fetchDepartments = async (buildingName) => {
  try {
    const response = await axiosInstance.get('/departments', {
      params: { buildingName },
    });
    const data = response.data; // Extract data from response
    console.log("Departments fetched:", data);
    return data; // Return the data for further use
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

// Function to fetch Roads
export const fetchRoads = async () => {
  try {
    const response = await axiosInstance.get('/getroads');
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching roads data:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};

// Function to fetch buildings data
export const fetchBuildings = async () => {
  try {
    const response = await axiosInstance.get('/getbuildings');
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching buildings data:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};