// src/lib/api/profileApi.js
import { fetchWithAuth } from '$lib/api/auth';
import { auth } from '$lib/stores/auth.store';

export const profileApi = {
  // Get current user profile
  getProfile: async () => {
    return fetchWithAuth('/profile', {
      method: 'GET'
    });
  },
  
  // Create user profile
  createProfile: async (profileData) => {
    const response = await fetchWithAuth('/profile/user', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
    
    // Update user in auth store with profile data
    if (response) {
      auth.updateUser({ profile: response });
    }
    
    return response;
  },
  
  // Upload profile picture
  uploadProfilePicture: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', 'profile_picture');
    
    const response = await fetchWithAuth('/imageupload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set correct Content-Type for FormData
    });
    
    return response;
  }
};