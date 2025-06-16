const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function simulateFrontendRequest() {
  try {
    // Test with different user tokens to see if filtering varies
    const users = [
      { email: 'hiddentest1@example.com', password: 'Test123!', name: 'Hidden User' },
      { email: 'hiddentest2@example.com', password: 'Test123!', name: 'Visible User' },
      { email: 'TonyTester@nomadiko.com', password: '1029384756', name: 'Tony Tester' }
    ];
    
    for (const user of users) {
      try {
        console.log(`\n========== Testing as ${user.name} ==========`);
        
        const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, {
          email: user.email,
          password: user.password
        });
        
        const token = loginResponse.data.token;
        const userId = loginResponse.data.user.id;
        
        console.log(`Logged in as: ${loginResponse.data.user.username || user.email} (${userId})`);
        
        // Make the exact same request the frontend would make
        const postsResponse = await axios.get(`${API_BASE}/posts`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`Posts received: ${postsResponse.data.length}`);
        
        // Check for hidden user posts
        const hiddenUserId = '684f97cbcd8b068181988437';
        const hiddenUserPosts = postsResponse.data.filter(p => p.user.id === hiddenUserId);
        
        if (hiddenUserPosts.length > 0) {
          console.log(`⚠️  Hidden user posts visible: ${hiddenUserPosts.length}`);
          hiddenUserPosts.forEach(p => {
            console.log(`   - "${p.name}" by ${p.user.username}`);
          });
        } else {
          console.log('✅ No hidden user posts visible');
        }
        
        // Also check with query parameters that the frontend might use
        console.log('\nTesting with pagination parameters...');
        const paginatedResponse = await axios.get(`${API_BASE}/posts?page=1&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`Paginated posts: ${paginatedResponse.data.length}`);
        
      } catch (loginError) {
        console.log(`Could not test with ${user.name}: ${loginError.response?.data?.message || loginError.message}`);
      }
    }
    
    // Also test without authentication (if allowed)
    console.log('\n========== Testing without authentication ==========');
    try {
      const unauthResponse = await axios.get(`${API_BASE}/posts`);
      console.log(`Unauthenticated posts: ${unauthResponse.data.length}`);
    } catch (error) {
      console.log(`Unauthenticated access: ${error.response?.status} ${error.response?.statusText}`);
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

simulateFrontendRequest();