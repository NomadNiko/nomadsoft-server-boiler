const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function addTestFriend() {
  try {
    // Login as friendstest user
    const user1Login = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'friendstest@example.com',
      password: 'Test123!'
    });
    
    const user1 = user1Login.data.user;
    const token1 = user1Login.data.token;
    
    // Login as friend2
    const user2Login = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'friend2@example.com',
      password: 'Test123!'
    });
    
    const user2 = user2Login.data.user;
    
    console.log(`Adding ${user2.username} as friend to ${user1.username}...`);
    
    // Add friend
    await axios.post(`${API_BASE}/social/friends`, {
      friendId: user2.id
    }, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    
    console.log('✅ Friend added successfully');
    
    // Check public friends count
    const publicResponse = await axios.get(`${API_BASE}/public/users/${user1.id}/friends-count`);
    console.log(`\nPublic friends count for ${user1.username}:`, publicResponse.data);
    
  } catch (error) {
    if (error.response?.data?.message?.includes('already friends')) {
      console.log('Users are already friends');
    } else {
      console.error('Error:', error.response?.data || error.message);
    }
  }
}

addTestFriend();