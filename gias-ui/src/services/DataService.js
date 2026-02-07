import axios from 'axios';
import API_URL from '@/services/config.js';

// Check Backend Connectivity
(async function checkBackendConnectivity() {
  try {
    const h = await axios.get(`${API_URL}/fetch_header`);
    console.log(h)
    // window.alert('Backend connectivity is successful.');
  } catch (error) {
    console.error('Error connecting to the backend:', error);
    window.alert('Error connecting to the backend. Please check the console for details.');
  }
})();

// Fetch header
export const fetchHeader = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch_header`);
    return response.data;
  } catch (error) {
    console.error('Error fetching header:', error);
    throw error;
  }
};

// Add title
export const addTitle = async (title) => {
  try {
    const response = await axios.post(`${API_URL}/add_title`, { title });
    return response.data;
  } catch (error) {
    console.error('Error adding title:', error);
    throw error;
  }
};

// Update title
export const updateTitle = async (old_title, new_title) => {
  try {
    const response = await axios.put(`${API_URL}/update_title`, { old_title, new_title });
    return response.data;
  } catch (error) {
    console.error('Error updating title:', error);
    throw error;
  }
};

// Delete title
export const deleteTitle = async (title) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_title`, { data: { title } });
    return response.data;
  } catch (error) {
    console.error('Error deleting title:', error);
    throw error;
  }
};

// Upload left icon
export const uploadLeftIcon = async (iconName, image) => {
  try {
    const response = await axios.post(`${API_URL}/upload_icon`, { icon_name: iconName, image, position: 'left' });
    return response.data;
  } catch (error) {
    console.error('Error uploading left icon:', error);
    throw error;
  }
};

// Delete left icon
export const deleteLeftIcon = async (iconName) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_icon/${iconName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting left icon:', error);
    throw error;
  }
};

// Upload right icon
export const uploadRightIcon = async (iconName, image) => {
  try {
    const response = await axios.post(`${API_URL}/upload_icon`, { icon_name: iconName, image, position: 'right' });
    return response.data;
  } catch (error) {
    console.error('Error uploading right icon:', error);
    throw error;
  }
};

// Delete right icon
export const deleteRightIcon = async (iconName) => {
  try {
    const response = await axios.delete(`${API_URL}/delete_icon/${iconName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting right icon:', error);
    throw error;
  }
};

// Fetch false alerts
export const fetchFalseAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/false_alerts`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching false alerts:', error);
    throw error;
  }
};

// Fetch maintenance
export const fetchMaintenance = async () => {
  try {
    const response = await axios.get(`${API_URL}/maintenance`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    throw error;
  }
};

// Fetch active
export const fetchActive = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching active:', error);
    throw error;
  }
};

// Fetch alerts and status options
export async function fetchAlertsAndStatusOptions() {
  try {
    const response = await axios.get(`${API_URL}/alerts`);
    return response.data; // { alerts: [...], status_options: [...] }
  } catch (error) {
    console.error('Error fetching alerts and status options:', error);
    throw error;
  }
}

// Perform search
export const performSearch = async (searchText) => {
  try {
    if (searchText) {
      const response = await axios.post(`${API_URL}/search`, { query: searchText });
      console.log(response.data[0]);
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

// Update alert status
export async function updateAlertStatus(alert_id, selected_status, alert_solution, alert_resolution, alert_remarks, start_time, end_time, updated_by, update_date) {
  try {
    const response = await axios.post(`${API_URL}/update`, {
      alert_id,
      selected_status,
      alert_solution,
      alert_resolution,
      alert_remarks,
      start_time,
      end_time,
      updated_by,
      update_date
    });
    return response.data;
  } catch (error) {
    console.error('Error updating alert status:', error);
    throw error;
  }
}

// Fetch system malfunctions
export async function fetchSystemMalfunctions() {
  try {
    const response = await axios.get(`${API_URL}/system_malfunction`);
    console.log(response.data);
    return response.data; // { system_malfunctions: [...] }
  } catch (error) {
    console.error('Error fetching system malfunctions:', error);
    throw error;
  }
}

// Fetch announcements
export async function fetchAnnouncements() {
  try {
    const response = await axios.get(`${API_URL}/announcements`);
    return response.data; // { announcements: [...] }
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
}

// Save announcement
export async function saveAnnouncement(announcement) {
  try {
    const response = await axios.post(`${API_URL}/announcements`, announcement);
    return response.data;
  } catch (error) {
    console.error('Error saving announcement:', error);
    throw error;
  }
}

// Get analytic report
export async function getAnalyticReport(alertType) {
  try {
    const response = await axios.get(`${API_URL}/analytic_report`, {
      params: { type: alertType }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

// Fetch all statuses
export async function getStatuses() {
  try {
    const response = await axios.get(`${API_URL}/status_master`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
}

// Save a new status
export async function saveStatus(status) {
  try {
    const response = await axios.post(`${API_URL}/status_master`, status);
    return response.data;
  } catch (error) {
    console.error('Error saving status:', error);
    throw error;
  }
}

// Update an existing status
export async function updateStatus(status) {
  try {
    const response = await axios.put(`${API_URL}/status_master/${status.code}`, status);
    return response.data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

// Delete a status
export async function deleteStatus(status) {
  try {
    const response = await axios.delete(`${API_URL}/status_master/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting status:', error);
    throw error;
  }
}

// Fetch alerts
export async function fetchAlerts() {
  try {
    const response = await axios.get(`${API_URL}/alert_history`);
    console.log(response.data);
    return response.data; // { alerts: [...], status_options: [...] }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
}

// Get alert sources
export async function getAlertSources() {
  try {
    const response = await axios.get(`${API_URL}/alert_sources`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
}

// Save alert source
export async function saveAlertSource(alertSource) {
  try {
    const response = await axios.post(`${API_URL}/alert_sources`, alertSource);
    return response.data;
  } catch (error) {
    console.error('Error saving sources:', error);
    throw error;
  }
}

// Update alert source
export async function updateAlertSource(alertSource) {
  try {
    const response = await axios.put(`${API_URL}/alert_sources/${alertSource.source}`, alertSource);
    return response.data;
  } catch (error) {
    console.error('Error updating sources:', error);
    throw error;
  }
}

// Delete alert source
export async function deleteAlertSource(alertSource) {
  try {
    const response = await axios.delete(`${API_URL}/alert_sources/${alertSource}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sources:', error);
    throw error;
  }
}