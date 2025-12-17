// const { databaseConnection } = require('../managers/databaseConnection');
// const { createPost } = require('../managers/postManager');
// const { getCommunityByName } = require('../managers/communityManager');
// const { getUsers } = require('../managers/userManager');

// async function addPostsToCommunities() {
//     try {
//         await databaseConnection();
//         console.log('Adding posts to communities...');

//         // Get all users to use as authors
//         const users = await getUsers();
//         if (users.length === 0) {
//             console.log('No users found. Please create some users first.');
//             return;
//         }

//         // Communities to add posts to
//         const communityNames = ['anime', 'technology', 'blender'];

//         for (const communityName of communityNames) {
//             const community = await getCommunityByName(communityName);
//             if (!community) {
//                 console.log(`Community '${communityName}' not found. Skipping.`);
//                 continue;
//             }

//             console.log(`Adding posts to community: ${communityName}`);

//             // Sample posts for each community
//             let samplePosts = [];

//             if (communityName === 'anime') {
//                 samplePosts = [
//                     {
//                         title: 'Best Anime of 2024',
//                         content: 'What are your top picks for anime this year? My favorites include Demon Slayer and Attack on Titan.',
//                         author: users[0]._id
//                     },
//                     {
//                         title: 'Anime Recommendations for Beginners',
//                         content: 'If you\'re new to anime, start with Studio Ghibli films or Naruto. They\'re great entry points!',
//                         author: users[1] ? users[1]._id : users[0]._id
//                     },
//                     {
//                         title: 'Upcoming Anime Seasons',
//                         content: 'Excited for the winter season! Which shows are you most looking forward to?',
//                         author: users[2] ? users[2]._id : users[0]._id
//                     }
//                 ];
//             } else if (communityName === 'technology') {
//                 samplePosts = [
//                     {
//                         title: 'Latest AI Developments',
//                         content: 'AI is advancing rapidly. What are your thoughts on the recent breakthroughs in machine learning?',
//                         author: users[0]._id
//                     },
//                     {
//                         title: 'Best Programming Languages to Learn in 2025',
//                         content: 'Python, JavaScript, and Rust seem to be the top choices. What do you recommend?',
//                         author: users[1] ? users[1]._id : users[0]._id
//                     },
//                     {
//                         title: 'Future of Web Development',
//                         content: 'With frameworks like Next.js and Svelte, web dev is evolving fast. What trends are you seeing?',
//                         author: users[2] ? users[2]._id : users[0]._id
//                     }
//                 ];
//             } else if (communityName === 'blender') {
//                 samplePosts = [
//                     {
//                         title: 'Blender Tips for Beginners',
//                         content: 'Learning Blender can be tough. Here are some tips: start with basic shapes and practice modeling.',
//                         author: users[0]._id
//                     },
//                     {
//                         title: 'Amazing Blender Renders',
//                         content: 'Share your best renders! I just finished a sci-fi scene that I\'m proud of.',
//                         author: users[1] ? users[1]._id : users[0]._id
//                     },
//                     {
//                         title: 'Blender vs Other 3D Software',
//                         content: 'Blender is free and powerful. How does it compare to Maya or 3ds Max in your experience?',
//                         author: users[2] ? users[2]._id : users[0]._id
//                     }
//                 ];
//             }

//             // Create posts and add to community
//             for (const postData of samplePosts) {
//                 const newPost = await createPost(postData);
//                 community.posts.push(newPost._id);
//                 console.log(`Added post: ${newPost.title}`);
//             }

//             await community.save();
//             console.log(`Updated community ${communityName} with new posts.`);
//         }

//         console.log('Finished adding posts to communities.');
//     } catch (error) {
//         console.error('Error adding posts:', error);
//     } finally {
//         process.exit();
//     }
// }

// addPostsToCommunities();