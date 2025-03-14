import { ApiHelper } from './ApiHelper';

const BASE_URL = 'http://192.168.50.141:8000/api/MedReminder'; // Sesuai dengan route API

export const getMedications = async () => {
  try {
    const response = await ApiHelper.request(BASE_URL, 'GET'); // GET tidak perlu body

    if (response.error_schema.error_code != "S001") {
        throw new Error(response.error_schema.message);
    }

    return response.output_schema;
  } catch (error) {
    console.error('Error fetching medications:', error);
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
    return await ApiHelper.request(`${BASE_URL}/update/${id}`, 'PUT', medication);
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