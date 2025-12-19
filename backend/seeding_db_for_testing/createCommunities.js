// const { databaseConnection } = require('./managers/databaseConnection');
// const { createCommunity } = require('./managers/communityManager');
// const { getUsers } = require('./managers/userManager');

// async function createCommunities() {
//     try {
//         await databaseConnection();
//         console.log('Creating communities...');

//         // Get all users to use as moderators/members
//         const users = await getUsers();
//         if (users.length === 0) {
//             console.log('No users found. Please create some users first.');
//             return;
//         }

//         const communities = [
//             {
//                 name: 'anime',
//                 description: 'Discuss anime, manga, and Japanese animation',
//                 profilePicture: 'https://example.com/anime.jpg',
//                 coverPicture: 'https://example.com/anime-cover.jpg',
//                 members: [users[0]._id],
//                 moderators: [users[0]._id]
//             },
//             {
//                 name: 'technology',
//                 description: 'Latest tech news, gadgets, and innovations',
//                 profilePicture: 'https://example.com/tech.jpg',
//                 coverPicture: 'https://example.com/tech-cover.jpg',
//                 members: [users[0]._id],
//                 moderators: [users[0]._id]
//             },
//             {
//                 name: 'blender',
//                 description: '3D modeling, animation, and Blender tutorials',
//                 profilePicture: 'https://example.com/blender.jpg',
//                 coverPicture: 'https://example.com/blender-cover.jpg',
//                 members: [users[0]._id],
//                 moderators: [users[0]._id]
//             }
//         ];

//         for (const comm of communities) {
//             const newComm = await createCommunity(comm);
//             console.log(`Created community: ${newComm.name}`);
//         }

//         console.log('Finished creating communities.');
//     } catch (error) {
//         console.error('Error creating communities:', error);
//     } finally {
//         process.exit();
//     }
// }

// createCommunities();