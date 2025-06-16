const mongoose = require('mongoose');

const uri = "mongodb+srv://nomadniko:123QWEasd@cluster0.vf9ss.mongodb.net/nomadsoft-rn-server?retryWrites=true&w=majority&appName=Cluster0";

async function checkPostInDB() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Get the most recent post
    const posts = await mongoose.connection.db.collection('postschemaclasses')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log(`\n📋 Found ${posts.length} posts in database:`);
    
    posts.forEach((post, idx) => {
      console.log(`\nPost ${idx + 1}:`);
      console.log(`  ID: ${post._id}`);
      console.log(`  Name: ${post.name}`);
      console.log(`  Content: ${post.content}`);
      console.log(`  Images field: ${JSON.stringify(post.images)}`);
      console.log(`  Images type: ${typeof post.images}`);
      console.log(`  Images length: ${post.images?.length || 'N/A'}`);
      console.log(`  User: ${post.user}`);
      console.log(`  Created: ${post.createdAt}`);
    });
    
    // Also check the files collection to see what files exist
    console.log('\n📁 Files in database:');
    const files = await mongoose.connection.db.collection('fileschemaclasses')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    files.forEach((file, idx) => {
      console.log(`File ${idx + 1}: ${file._id} - ${file.path}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Connection closed');
  }
}

checkPostInDB();