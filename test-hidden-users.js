const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

const testUser1 = {
  email: 'hiddentest1@example.com',
  password: 'Test123!',
  firstName: 'Hidden',
  lastName: 'User1',
  username: 'hiddenuser1'
};

const testUser2 = {
  email: 'hiddentest2@example.com',
  password: 'Test123!',
  firstName: 'Visible',
  lastName: 'User2',
  username: 'visibleuser2'
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

async function testHiddenUsers() {
  console.log('🔒 Testing Hidden Users functionality...\n');
  
  try {
    // Create and login two users
    const user1Auth = await createAndLoginUser(testUser1);
    const user2Auth = await createAndLoginUser(testUser2);
    
    console.log(`✅ User 1 (to be hidden): ${user1Auth.user.id} - ${user1Auth.user.username}`);
    console.log(`✅ User 2 (stays visible): ${user2Auth.user.id} - ${user2Auth.user.username}\n`);
    
    // Create posts from both users
    console.log('1. Creating posts from both users...');
    
    const post1 = await axios.post(`${API_BASE}/posts`, {
      name: 'Post from Hidden User',
      content: 'This post should be hidden from All Posts when user is hidden'
    }, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    
    const post2 = await axios.post(`${API_BASE}/posts`, {
      name: 'Post from Visible User',
      content: 'This post should always be visible in All Posts'
    }, {
      headers: { Authorization: `Bearer ${user2Auth.token}` }
    });
    
    console.log(`✅ Created post 1 (hidden user): ${post1.data.id}`);
    console.log(`✅ Created post 2 (visible user): ${post2.data.id}\n`);
    
    // Check initial All Posts (should show both)
    console.log('2. Checking All Posts before hiding user...');
    const allPosts1 = await axios.get(`${API_BASE}/posts`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   Total posts: ${allPosts1.data.length}`);
    
    const visibleAuthors = allPosts1.data.map(p => `${p.user.username} (${p.user.id})`);
    console.log(`   Post authors: ${visibleAuthors.join(', ')}\n`);
    
    // Check hidden status (should be false initially)
    console.log('3. Checking initial hidden status...');
    const status1 = await axios.get(`${API_BASE}/hidden-users/status`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   User 1 hidden status: ${status1.data.isHidden}\n`);
    
    // Hide user 1
    console.log('4. Hiding user 1 from All Posts...');
    const hideResponse = await axios.post(`${API_BASE}/hidden-users/hide`, {}, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   Hide response: ${hideResponse.data.isHidden}\n`);
    
    // Check All Posts after hiding (should only show user 2's post)
    console.log('5. Checking All Posts after hiding user 1...');
    const allPosts2 = await axios.get(`${API_BASE}/posts`, {
      headers: { Authorization: `Bearer ${user2Auth.token}` }
    });
    console.log(`   Total posts: ${allPosts2.data.length}`);
    
    const visibleAuthors2 = allPosts2.data.map(p => `${p.user.username} (${p.user.id})`);
    console.log(`   Post authors: ${visibleAuthors2.join(', ')}\n`);
    
    // Verify user 1's post is not in the list
    const user1PostVisible = allPosts2.data.some(p => p.user.id === user1Auth.user.id);
    console.log(`   User 1's post visible: ${user1PostVisible}`);
    
    const user2PostVisible = allPosts2.data.some(p => p.user.id === user2Auth.user.id);
    console.log(`   User 2's post visible: ${user2PostVisible}\n`);
    
    // Check hidden status again (should be true now)
    console.log('6. Checking hidden status after hiding...');
    const status2 = await axios.get(`${API_BASE}/hidden-users/status`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   User 1 hidden status: ${status2.data.isHidden}\n`);
    
    // Unhide user 1
    console.log('7. Unhiding user 1...');
    const unhideResponse = await axios.delete(`${API_BASE}/hidden-users/hide`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   Unhide response: ${unhideResponse.data.isHidden}\n`);
    
    // Check All Posts after unhiding (should show both posts again)
    console.log('8. Checking All Posts after unhiding user 1...');
    const allPosts3 = await axios.get(`${API_BASE}/posts`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   Total posts: ${allPosts3.data.length}`);
    
    const visibleAuthors3 = allPosts3.data.map(p => `${p.user.username} (${p.user.id})`);
    console.log(`   Post authors: ${visibleAuthors3.join(', ')}\n`);
    
    // Final hidden status check (should be false)
    console.log('9. Final hidden status check...');
    const status3 = await axios.get(`${API_BASE}/hidden-users/status`, {
      headers: { Authorization: `Bearer ${user1Auth.token}` }
    });
    console.log(`   User 1 hidden status: ${status3.data.isHidden}\n`);
    
    console.log('🎉 Hidden Users functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testHiddenUsers();