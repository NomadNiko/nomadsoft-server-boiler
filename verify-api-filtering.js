const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

async function verifyAPIFiltering() {
  try {
    // First, get the hidden user's info
    const hiddenUserLogin = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'hiddentest1@example.com',
      password: 'Test123!'
    });
    
    const hiddenUserId = hiddenUserLogin.data.user.id;
    const hiddenUsername = hiddenUserLogin.data.user.username;
    
    console.log(`Hidden user: ${hiddenUsername} (${hiddenUserId})`);
    
    // Now login as a different user to check the All Posts API
    const viewerLogin = await axios.post(`${API_BASE}/auth/email/login`, {
      email: 'hiddentest2@example.com',
      password: 'Test123!'
    });
    
    const viewerToken = viewerLogin.data.token;
    console.log(`Viewer user: ${viewerLogin.data.user.username} (${viewerLogin.data.user.id})\n`);
    
    // Get all posts from the API
    console.log('Fetching all posts from API...');
    const response = await axios.get(`${API_BASE}/posts`, {
      headers: { Authorization: `Bearer ${viewerToken}` }
    });
    
    console.log(`Total posts returned: ${response.data.length}`);
    
    // Check if any posts from hidden user are present
    const hiddenUserPosts = response.data.filter(post => post.user.id === hiddenUserId);
    
    if (hiddenUserPosts.length > 0) {
      console.log(`\n❌ ERROR: Found ${hiddenUserPosts.length} posts from hidden user!`);
      hiddenUserPosts.forEach(post => {
        console.log(`  - Post: "${post.name}" by ${post.user.username}`);
      });
    } else {
      console.log('✅ No posts from hidden user found - filtering is working correctly');
    }
    
    // List all post authors to see what's being returned
    console.log('\nAll post authors in response:');
    const authors = [...new Set(response.data.map(p => `${p.user.username} (${p.user.id})`))];
    authors.forEach(author => console.log(`  - ${author}`));
    
    // Double-check the hidden user's status
    console.log('\nDouble-checking hidden user status...');
    const statusCheck = await axios.get(`${API_BASE}/hidden-users/status`, {
      headers: { Authorization: `Bearer ${hiddenUserLogin.data.token}` }
    });
    console.log(`Hidden user status: ${statusCheck.data.isHidden}`);
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

verifyAPIFiltering();