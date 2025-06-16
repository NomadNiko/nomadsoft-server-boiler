const axios = require('axios');

const API_BASE = 'http://localhost:16990/api/v1';

// Test user credentials
const testUser = {
  email: 'aloha@ixplor.app',
  password: 'Test123!' // You may need to adjust this
};

async function debugPostCreation() {
  console.log('\n🔍 Debugging post creation with images...\n');
  
  try {
    // Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/email/login`, testUser);
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Upload a file first
    console.log('\n2. Uploading a file...');
    const fileResponse = await axios.post(`${API_BASE}/files/upload`, {
      fileName: 'debug-test.jpg',
      fileSize: 1024
    }, { headers: { Authorization: `Bearer ${authToken}` } });
    
    const fileId = fileResponse.data.file.id;
    console.log(`✅ File uploaded - ID: ${fileId}`);
    console.log(`   File path: ${fileResponse.data.file.path}`);
    
    // Create a post with this image
    console.log('\n3. Creating post with image...');
    const postData = {
      name: 'Debug Test Post',
      content: 'Testing image association',
      images: [{ id: fileId }]
    };
    
    console.log('   Post data being sent:', JSON.stringify(postData, null, 2));
    
    const postResponse = await axios.post(`${API_BASE}/posts`, postData, { 
      headers: { Authorization: `Bearer ${authToken}` } 
    });
    
    console.log('✅ Post created');
    console.log('   Post response:', JSON.stringify(postResponse.data, null, 2));
    
    // Get the specific post to see if images are there
    console.log('\n4. Retrieving specific post...');
    const getPostResponse = await axios.get(`${API_BASE}/posts/${postResponse.data.id}`, { 
      headers: { Authorization: `Bearer ${authToken}` } 
    });
    
    console.log('   Retrieved post:', JSON.stringify(getPostResponse.data, null, 2));
    
    // Check all posts to see if images appear
    console.log('\n5. Checking all posts...');
    const allPostsResponse = await axios.get(`${API_BASE}/posts`, { 
      headers: { Authorization: `Bearer ${authToken}` } 
    });
    
    console.log(`   Found ${allPostsResponse.data.length} total posts`);
    const ourPost = allPostsResponse.data.find(p => p.id === postResponse.data.id);
    if (ourPost) {
      console.log('   Our post in list:', JSON.stringify(ourPost, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('   Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugPostCreation();