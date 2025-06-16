const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

const testUser = {
  email: 'friendstest@example.com',
  password: 'Test123!',
  firstName: 'Friends',
  lastName: 'Test',
  username: 'friendstest'
};

async function createAndLoginUser(userData) {
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, userData);
    return {
      token: loginResponse.data.token,
      user: loginResponse.data.user
    };
  } catch (error) {
    if (error.response?.status === 422) {
      await axios.post(`${API_BASE}/auth/email/register`, userData);
      const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, userData);
      return {
        token: loginResponse.data.token,
        user: loginResponse.data.user
      };
    } else {
      throw error;
    }
  }
}

async function testFriendsList() {
  console.log('\n👥 Testing friends list functionality...\n');
  
  try {
    const userAuth = await createAndLoginUser(testUser);
    console.log(`✅ User logged in: ${userAuth.user.id}`);
    
    // Check current auth/me response
    console.log('\n1. Checking auth/me response...');
    const meResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${userAuth.token}` }
    });
    
    console.log('✅ Auth/me response:');
    console.log('   Friends field:', meResponse.data.friends);
    console.log('   Friends type:', typeof meResponse.data.friends);
    console.log('   Friends length:', meResponse.data.friends?.length);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFriendsList();