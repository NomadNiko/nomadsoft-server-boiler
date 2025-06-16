const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function testPublicFriendsCount() {
  console.log('🔢 Testing Public Friends Count API...\n');
  
  try {
    // First, get a user with friends
    const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'friendstest@example.com',
      password: 'Test123!'
    });
    
    const userWithFriends = loginResponse.data.user;
    console.log(`User with friends: ${userWithFriends.username} (${userWithFriends.id})`);
    console.log(`Friends array: ${userWithFriends.friends?.join(', ') || 'none'}\n`);
    
    // Test the public endpoint (no authentication needed)
    console.log('1. Testing public friends count endpoint (no auth required)...');
    
    const publicResponse = await axios.get(`${API_BASE}/public/users/${userWithFriends.id}/friends-count`);
    console.log(`✅ Public API response:`, publicResponse.data);
    
    // Test with a user that has no friends
    console.log('\n2. Testing with a user that has no friends...');
    const noFriendsLogin = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'hiddentest2@example.com',
      password: 'Test123!'
    });
    
    const noFriendsUser = noFriendsLogin.data.user;
    const noFriendsResponse = await axios.get(`${API_BASE}/public/users/${noFriendsUser.id}/friends-count`);
    console.log(`✅ User ${noFriendsUser.username}: `, noFriendsResponse.data);
    
    // Test with invalid user ID
    console.log('\n3. Testing with invalid user ID...');
    const invalidResponse = await axios.get(`${API_BASE}/public/users/invaliduserid123/friends-count`);
    console.log(`✅ Invalid user ID response:`, invalidResponse.data);
    
    // Verify no authentication is required
    console.log('\n4. Verifying no authentication required...');
    const unauthResponse = await axios.get(`${API_BASE}/public/users/${userWithFriends.id}/friends-count`, {
      // No Authorization header
    });
    console.log(`✅ Unauthenticated request successful:`, unauthResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testPublicFriendsCount();