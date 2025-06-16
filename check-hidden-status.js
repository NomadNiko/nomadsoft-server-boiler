const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function checkAndHideUser() {
  try {
    // Login as the hidden test user
    const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'hiddentest1@example.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log(`User: ${user.username} (${user.id})`);
    
    // Check current status
    const statusResponse = await axios.get(`${API_BASE}/hidden-users/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`Current hidden status: ${statusResponse.data.isHidden}`);
    
    if (!statusResponse.data.isHidden) {
      // Hide the user
      console.log('Hiding user...');
      const hideResponse = await axios.post(`${API_BASE}/hidden-users/hide`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Hide response: ${hideResponse.data.isHidden}`);
      
      // Verify posts are now filtered
      console.log('\nChecking All Posts to verify filtering...');
      const allPosts = await axios.get(`${API_BASE}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const hiddenUserPosts = allPosts.data.filter(p => p.user.id === user.id);
      console.log(`Posts from hidden user visible: ${hiddenUserPosts.length}`);
      
      if (hiddenUserPosts.length > 0) {
        console.log('WARNING: Hidden user posts are still visible!');
      } else {
        console.log('✅ Hidden user posts are properly filtered out');
      }
    } else {
      console.log('User is already hidden');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data);
  }
}

checkAndHideUser();