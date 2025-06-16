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
    // Create two users
    const user1Auth = await createAndLoginUser(testUser);
    console.log(`✅ User 1 logged in: ${user1Auth.user.id}`);
    
    const user2Auth = await createAndLoginUser({
      email: 'friend2@example.com',
      password: 'Test123!',
      firstName: 'Friend',
      lastName: 'Two',
      username: 'friend2'
    });
    console.log(`✅ User 2 logged in: ${user2Auth.user.id}`);
    
    // Check current auth/me response (should have empty friends)
    console.log('\n1. Checking auth/me response before adding friends...');
    const meResponse1 = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    console.log('✅ Auth/me response:');
    console.log('   Friends field:', meResponse1.data.friends);
    console.log('   Friends length:', meResponse1.data.friends?.length);
    
    // Test GET /social/friends endpoint (should be empty)
    console.log('\n2. Testing GET /social/friends (empty)...');
    const friendsResponse1 = await axios.get(`${API_BASE}/social/friends`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    console.log('✅ Friends list response:', friendsResponse1.data);
    console.log('   Friends count:', friendsResponse1.data.length);
    
    // Add user2 as friend
    console.log('\n3. Adding friend...');
    await axios.post(`${API_BASE}/social/friends`, {
      friendId: user2Auth.user.id
    }, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    console.log('✅ Friend added');
    
    // Check auth/me response after adding friend
    console.log('\n4. Checking auth/me response after adding friend...');
    const meResponse2 = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    console.log('✅ Updated auth/me response:');
    console.log('   Friends field:', meResponse2.data.friends);
    console.log('   Friends length:', meResponse2.data.friends?.length);
    
    // Test GET /social/friends endpoint (should have user details)
    console.log('\n5. Testing GET /social/friends (with friend)...');
    const friendsResponse2 = await axios.get(`${API_BASE}/social/friends`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    console.log('✅ Friends list response:');
    console.log('   Friends count:', friendsResponse2.data.length);
    if (friendsResponse2.data.length > 0) {
      const friend = friendsResponse2.data[0];
      console.log('   First friend:');
      console.log('     ID:', friend.id);
      console.log('     Username:', friend.username);
      console.log('     Name:', `${friend.firstName} ${friend.lastName}`);
      console.log('     Email:', friend.email);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFriendsList();