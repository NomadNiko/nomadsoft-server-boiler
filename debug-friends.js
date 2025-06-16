const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function debugFriends() {
  try {
    // Login as an existing user
    const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'friendstest@example.com',
      password: 'Test123!'
    });
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    
    console.log('User ID:', userId);
    console.log('Current friends:', loginResponse.data.user.friends);
    
    // Try to add a specific friend ID (using another existing user)
    const friend2Response = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'friend2@example.com',
      password: 'Test123!'
    });
    
    const friendId = friend2Response.data.user.id;
    console.log('Friend ID to add:', friendId);
    
    // Add friend with debug
    console.log('\nAttempting to add friend...');
    const addResponse = await axios.post(`${API_BASE}/social/friends`, {
      friendId: friendId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Add friend response:', JSON.stringify(addResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data);
  }
}

debugFriends();