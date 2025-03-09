// medApiHelper.js
import axios from 'axios';

const BASE_URL = 'https://your-backend-api-url.com/api';

export const getMedications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/medications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

export const addMedication = async (medication) => {
  try {
    const response = await axios.post(`${BASE_URL}/medications`, medication);
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

export const updateMedication = async (id, medication) => {
  try {
    const response = await axios.put(`${BASE_URL}/medications/${id}`, medication);
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

export const deleteMedication = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/medications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};