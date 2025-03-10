const BASE_URL = 'https://your-backend-api-url.com/api';

// Fungsi untuk mengambil daftar obat
export const getMedications = async () => {
  try {
    const response = await fetch(`${BASE_URL}/medications`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

// Fungsi untuk menambahkan obat baru
export const addMedication = async (medication) => {
  try {
    const response = await fetch(`${BASE_URL}/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

// Fungsi untuk mengupdate obat
export const updateMedication = async (id, medication) => {
  try {
    const response = await fetch(`${BASE_URL}/medications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

// Fungsi untuk menghapus obat
export const deleteMedication = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/medications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};