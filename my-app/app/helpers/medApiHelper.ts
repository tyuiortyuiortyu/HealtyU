import { ApiHelper } from '../helpers/ApiHelper';

const BASE_URL = 'http://127.0.0.1:8000/api/MedReminder'; // Sesuai dengan route API

export const getMedications = async () => {
  try {
    return await ApiHelper.request(BASE_URL, 'GET'); // GET tidak perlu body
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

export const addMedication = async (medication) => {
  try {
    return await ApiHelper.request(BASE_URL, 'POST', medication);
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

export const updateMedication = async (id, medication) => {
  try {
    return await ApiHelper.request(`${BASE_URL}/update/${id}`, 'POST', medication);
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

export const deleteMedication = async (id) => {
  try {
    return await ApiHelper.request(`${BASE_URL}/${id}`, 'DELETE'); // Sesuai dengan API
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};
