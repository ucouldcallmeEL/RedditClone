const { databaseConnection } = require('../managers/databaseConnection');
const { createCommunity, getCommunityByName } = require('../managers/communityManager');

async function addMoreCommunities() {
  try {
    await databaseConnection();
    console.log('Connected — adding communities...');

    const communities = [
      {
        name: 'gaming',
        description: 'All about video games, consoles, and PC gaming.',
        profilePicture: 'https://via.placeholder.com/80?text=gaming',
        coverPicture: 'https://via.placeholder.com/900x200?text=gaming+cover'
      },
      {
        name: 'movies',
        description: 'Discussion of films, trailers, and movie news.',
        profilePicture: 'https://via.placeholder.com/80?text=movies',
        coverPicture: 'https://via.placeholder.com/900x200?text=movies+cover'
      },
      {
        name: 'science',
        description: 'News and discussions about science and discoveries.',
        profilePicture: 'https://via.placeholder.com/80?text=science',
        coverPicture: 'https://via.placeholder.com/900x200?text=science+cover'
      },
      {
        name: 'programming',
        description: 'Coding questions, resources, and programming discussions.',
        profilePicture: 'https://via.placeholder.com/80?text=programming',
        coverPicture: 'https://via.placeholder.com/900x200?text=programming+cover'
      },
      {
        name: 'books',
        description: 'Book recommendations, reviews, and reading lists.',
        profilePicture: 'https://via.placeholder.com/80?text=books',
        coverPicture: 'https://via.placeholder.com/900x200?text=books+cover'
      }
    ];

    for (const comm of communities) {
      const existing = await getCommunityByName(comm.name);
      if (existing) {
        console.log(`Skipping existing community: ${comm.name}`);
        continue;
      }

      const created = await createCommunity({
        name: comm.name,
        description: comm.description,
        profilePicture: comm.profilePicture,
        coverPicture: comm.coverPicture,
        members: [],
        moderators: []
      });
      console.log(`Created community: ${created.name}`);
    }

    console.log('Finished adding communities.');
  } catch (err) {
    console.error('Error adding communities:', err);
  } finally {
    process.exit();
  }
}

addMoreCommunities();
