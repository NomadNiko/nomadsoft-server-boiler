const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkHiddenCollection() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('nomadsoft-rn-server');
    
    // Check hidden users collection
    const hiddenUsers = await db.collection('hiddenuserschemaclasses').find({}).toArray();
    console.log(`\nHidden users in database: ${hiddenUsers.length}`);
    
    if (hiddenUsers.length > 0) {
      console.log('\nHidden user records:');
      for (const hu of hiddenUsers) {
        console.log(`  - User ID: ${hu.user} (created: ${hu.createdAt})`);
      }
    }
    
    // Also check how many posts exist from hidden users
    const hiddenUserIds = hiddenUsers.map(hu => hu.user);
    
    if (hiddenUserIds.length > 0) {
      const postsFromHiddenUsers = await db.collection('postschemaclasses')
        .find({ user: { $in: hiddenUserIds } })
        .toArray();
      
      console.log(`\nPosts from hidden users: ${postsFromHiddenUsers.length}`);
      postsFromHiddenUsers.forEach(post => {
        console.log(`  - "${post.name}" by user ${post.user}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkHiddenCollection();