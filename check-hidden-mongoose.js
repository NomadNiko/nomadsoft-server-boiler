const mongoose = require('mongoose');
require('dotenv').config();

async function checkHiddenCollection() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    
    const db = mongoose.connection.db;
    
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
    const hiddenUserIds = hiddenUsers.map(hu => hu.user.toString());
    
    if (hiddenUserIds.length > 0) {
      const allPosts = await db.collection('postschemaclasses').find({}).toArray();
      const postsFromHiddenUsers = allPosts.filter(post => 
        hiddenUserIds.includes(post.user.toString())
      );
      
      console.log(`\nTotal posts in DB: ${allPosts.length}`);
      console.log(`Posts from hidden users: ${postsFromHiddenUsers.length}`);
      
      postsFromHiddenUsers.forEach(post => {
        console.log(`  - "${post.name}" by user ${post.user}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkHiddenCollection();