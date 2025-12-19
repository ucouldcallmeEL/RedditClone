// const {
//     databaseConnection,
//     createUser,
//     createPost,
//     createComment,
//     createCommunity
// } = require('./DBmanager');

// async function seedDatabase() {
//     try {
//         await databaseConnection();
//         console.log('Seeding database...');

//         // Create sample users
//         const alice = await createUser({
//             name: 'Alice Johnson',
//             email: 'alice@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/alice.jpg',
//             coverPicture: 'https://example.com/alice-cover.jpg',
//             bio: 'Tech enthusiast and developer',
//             karma: 150
//         });
//         console.log('Created user:', alice.name);

//         const bob = await createUser({
//             name: 'Bob Smith',
//             email: 'bob@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/bob.jpg',
//             coverPicture: 'https://example.com/bob-cover.jpg',
//             bio: 'Gaming and programming lover',
//             karma: 200
//         });
//         console.log('Created user:', bob.name);

//         const charlie = await createUser({
//             name: 'Charlie Brown',
//             email: 'charlie@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/charlie.jpg',
//             coverPicture: 'https://example.com/charlie-cover.jpg',
//             bio: 'Software engineer and blogger',
//             karma: 100
//         });
//         console.log('Created user:', charlie.name);

//         const david = await createUser({
//             name: 'David Lee',
//             email: 'david@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/david.jpg',
//             coverPicture: 'https://example.com/david-cover.jpg',
//             bio: 'Data scientist and machine learning enthusiast',
//             karma: 180
//         });
//         console.log('Created user:', david.name);

//         const emma = await createUser({
//             name: 'Emma Wilson',
//             email: 'emma@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/emma.jpg',
//             coverPicture: 'https://example.com/emma-cover.jpg',
//             bio: 'UX designer and digital artist',
//             karma: 120
//         });
//         console.log('Created user:', emma.name);

//         const frank = await createUser({
//             name: 'Frank Garcia',
//             email: 'frank@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/frank.jpg',
//             coverPicture: 'https://example.com/frank-cover.jpg',
//             bio: 'Cybersecurity expert and ethical hacker',
//             karma: 250
//         });
//         console.log('Created user:', frank.name);

//         const grace = await createUser({
//             name: 'Grace Kim',
//             email: 'grace@example.com',
//             password: 'password123',
//             profilePicture: 'https://example.com/grace.jpg',
//             coverPicture: 'https://example.com/grace-cover.jpg',
//             bio: 'Environmental scientist and nature photographer',
//             karma: 90
//         });
//         console.log('Created user:', grace.name);

//         // Create sample communities
//         const techCommunity = await createCommunity({
//             name: 'Technology',
//             description: 'Discuss latest technology trends and innovations',
//             profilePicture: 'https://example.com/tech.jpg',
//             coverPicture: 'https://example.com/tech-cover.jpg',
//             members: [alice._id, bob._id],
//             moderators: [alice._id]
//         });
//         console.log('Created community:', techCommunity.name);

//         const gamingCommunity = await createCommunity({
//             name: 'Gaming',
//             description: 'Talk about video games, reviews, and gaming culture',
//             profilePicture: 'https://example.com/gaming.jpg',
//             coverPicture: 'https://example.com/gaming-cover.jpg',
//             members: [bob._id, charlie._id],
//             moderators: [bob._id]
//         });
//         console.log('Created community:', gamingCommunity.name);

//         const programmingCommunity = await createCommunity({
//             name: 'Programming',
//             description: 'Discuss programming languages, algorithms, and software development',
//             profilePicture: 'https://example.com/programming.jpg',
//             coverPicture: 'https://example.com/programming-cover.jpg',
//             members: [alice._id, charlie._id, david._id, frank._id],
//             moderators: [charlie._id]
//         });
//         console.log('Created community:', programmingCommunity.name);

//         const scienceCommunity = await createCommunity({
//             name: 'Science',
//             description: 'Share and discuss scientific discoveries, research, and theories',
//             profilePicture: 'https://example.com/science.jpg',
//             coverPicture: 'https://example.com/science-cover.jpg',
//             members: [david._id, grace._id, alice._id],
//             moderators: [david._id]
//         });
//         console.log('Created community:', scienceCommunity.name);

//         const designCommunity = await createCommunity({
//             name: 'Design',
//             description: 'Explore UI/UX design, graphic design, and creative processes',
//             profilePicture: 'https://example.com/design.jpg',
//             coverPicture: 'https://example.com/design-cover.jpg',
//             members: [emma._id, alice._id, charlie._id],
//             moderators: [emma._id]
//         });
//         console.log('Created community:', designCommunity.name);

//         const cybersecurityCommunity = await createCommunity({
//             name: 'Cybersecurity',
//             description: 'Discuss security threats, best practices, and ethical hacking',
//             profilePicture: 'https://example.com/cybersecurity.jpg',
//             coverPicture: 'https://example.com/cybersecurity-cover.jpg',
//             members: [frank._id, alice._id, bob._id],
//             moderators: [frank._id]
//         });
//         console.log('Created community:', cybersecurityCommunity.name);

//         // Create sample posts
//         const post1 = await createPost({
//             title: 'New AI Breakthrough in Natural Language Processing',
//             content: 'Exciting developments in AI! Researchers have achieved significant improvements in NLP models, leading to more accurate and context-aware language understanding.',
//             author: alice._id,
//             upvotes: 25,
//             downvotes: 2
//         });
//         console.log('Created post:', post1.title);

//         const post2 = await createPost({
//             title: 'Best Video Games of 2023',
//             content: 'Here are my top picks for the best games released in 2023. From action-packed adventures to immersive RPGs, the gaming industry delivered some amazing titles this year.',
//             author: bob._id,
//             upvotes: 45,
//             downvotes: 1
//         });
//         console.log('Created post:', post2.title);

//         const post3 = await createPost({
//             title: 'Essential Programming Tips for Beginners',
//             content: 'Starting your programming journey? Here are some crucial tips that helped me become a better developer. Focus on fundamentals, practice regularly, and never stop learning!',
//             author: charlie._id,
//             upvotes: 30,
//             downvotes: 0
//         });
//         console.log('Created post:', post3.title);

//         const post4 = await createPost({
//             title: 'Machine Learning in Healthcare: Revolutionizing Diagnostics',
//             content: 'Recent advancements in ML are transforming healthcare. From early disease detection to personalized treatment plans, AI is making a significant impact.',
//             author: david._id,
//             upvotes: 40,
//             downvotes: 3
//         });
//         console.log('Created post:', post4.title);

//         const post5 = await createPost({
//             title: 'The Future of User Interface Design',
//             content: 'As technology evolves, so does UI design. Discussing trends like voice interfaces, AR/VR integration, and minimalist approaches.',
//             author: emma._id,
//             upvotes: 22,
//             downvotes: 1
//         });
//         console.log('Created post:', post5.title);

//         const post6 = await createPost({
//             title: 'Common Cybersecurity Threats in 2024',
//             content: 'An overview of the most prevalent cyber threats this year, including phishing attacks, ransomware, and zero-day vulnerabilities.',
//             author: frank._id,
//             upvotes: 35,
//             downvotes: 2
//         });
//         console.log('Created post:', post6.title);

//         const post7 = await createPost({
//             title: 'Climate Change: Latest Research Findings',
//             content: 'New studies show alarming trends in global warming. Discussing the latest data and potential mitigation strategies.',
//             author: grace._id,
//             upvotes: 28,
//             downvotes: 4
//         });
//         console.log('Created post:', post7.title);

//         const post8 = await createPost({
//             title: 'React vs Vue: Choosing the Right Framework',
//             content: 'A comparison of two popular frontend frameworks. Pros, cons, and when to use each one.',
//             author: charlie._id,
//             upvotes: 50,
//             downvotes: 5
//         });
//         console.log('Created post:', post8.title);

//         const post9 = await createPost({
//             title: 'Quantum Computing Breakthroughs',
//             content: 'Exciting developments in quantum computing that could solve complex problems beyond classical computers.',
//             author: david._id,
//             upvotes: 18,
//             downvotes: 0
//         });
//         console.log('Created post:', post9.title);

//         const post10 = await createPost({
//             title: 'Color Theory in Digital Design',
//             content: 'Understanding color psychology and how to use it effectively in your designs.',
//             author: emma._id,
//             upvotes: 15,
//             downvotes: 1
//         });
//         console.log('Created post:', post10.title);

//         // Add posts to communities
//         techCommunity.posts.push(post1._id, post3._id);
//         await techCommunity.save();

//         gamingCommunity.posts.push(post2._id);
//         await gamingCommunity.save();

//         programmingCommunity.posts.push(post3._id, post8._id);
//         await programmingCommunity.save();

//         scienceCommunity.posts.push(post4._id, post9._id);
//         await scienceCommunity.save();

//         designCommunity.posts.push(post5._id, post10._id);
//         await designCommunity.save();

//         cybersecurityCommunity.posts.push(post6._id);
//         await cybersecurityCommunity.save();

//         // Add posts to users
//         alice.posts.push(post1._id);
//         await alice.save();

//         bob.posts.push(post2._id);
//         await bob.save();

//         charlie.posts.push(post3._id, post8._id);
//         await charlie.save();

//         david.posts.push(post4._id, post9._id);
//         await david.save();

//         emma.posts.push(post5._id, post10._id);
//         await emma.save();

//         frank.posts.push(post6._id);
//         await frank.save();

//         grace.posts.push(post7._id);
//         await grace.save();

//         // Create sample comments
//         const comment1 = await createComment({
//             content: 'This is fascinating! Do you have any specific examples of these NLP improvements?',
//             author: bob._id,
//             post: post1._id,
//             upvotes: 5,
//             downvotes: 0
//         });
//         console.log('Created comment on post1');

//         const comment2 = await createComment({
//             content: 'Great list! I completely agree with your top pick. The storytelling was exceptional.',
//             author: charlie._id,
//             post: post2._id,
//             upvotes: 8,
//             downvotes: 0
//         });
//         console.log('Created comment on post2');

//         const reply1 = await createComment({
//             content: 'Sure! For example, the new models can better understand context and sarcasm, which was a major limitation before.',
//             author: alice._id,
//             post: post1._id,
//             parentComment: comment1._id,
//             upvotes: 3,
//             downvotes: 0
//         });
//         console.log('Created reply to comment1');

//         const comment3 = await createComment({
//             content: 'Thanks for the tips! I\'m just starting out and this is really helpful.',
//             author: alice._id,
//             post: post3._id,
//             upvotes: 4,
//             downvotes: 0
//         });
//         console.log('Created comment on post3');

//         const comment4 = await createComment({
//             content: 'This is a game-changer for healthcare! What specific algorithms are being used?',
//             author: alice._id,
//             post: post4._id,
//             upvotes: 6,
//             downvotes: 0
//         });
//         console.log('Created comment on post4');

//         const comment5 = await createComment({
//             content: 'AR/VR integration is definitely the future. Excited to see more developments.',
//             author: charlie._id,
//             post: post5._id,
//             upvotes: 3,
//             downvotes: 0
//         });
//         console.log('Created comment on post5');

//         const comment6 = await createComment({
//             content: 'Great overview! How can individuals protect themselves from these threats?',
//             author: bob._id,
//             post: post6._id,
//             upvotes: 7,
//             downvotes: 0
//         });
//         console.log('Created comment on post6');

//         const comment7 = await createComment({
//             content: 'The data is concerning. We need more action on climate policies.',
//             author: frank._id,
//             post: post7._id,
//             upvotes: 5,
//             downvotes: 1
//         });
//         console.log('Created comment on post7');

//         const reply2 = await createComment({
//             content: 'Primarily convolutional neural networks and deep learning models for image analysis.',
//             author: david._id,
//             post: post4._id,
//             parentComment: comment4._id,
//             upvotes: 4,
//             downvotes: 0
//         });
//         console.log('Created reply to comment4');

//         const reply3 = await createComment({
//             content: 'Use strong passwords, enable 2FA, and stay updated on security patches.',
//             author: frank._id,
//             post: post6._id,
//             parentComment: comment6._id,
//             upvotes: 8,
//             downvotes: 0
//         });
//         console.log('Created reply to comment6');

//         const comment8 = await createComment({
//             content: 'Vue has a gentler learning curve, but React\'s ecosystem is unmatched.',
//             author: alice._id,
//             post: post8._id,
//             upvotes: 12,
//             downvotes: 2
//         });
//         console.log('Created comment on post8');

//         const comment9 = await createComment({
//             content: 'Quantum supremacy is just the beginning. The real revolution is yet to come.',
//             author: frank._id,
//             post: post9._id,
//             upvotes: 3,
//             downvotes: 0
//         });
//         console.log('Created comment on post9');

//         const comment10 = await createComment({
//             content: 'Color psychology is fascinating! Blue for trust, green for growth, etc.',
//             author: grace._id,
//             post: post10._id,
//             upvotes: 2,
//             downvotes: 0
//         });
//         console.log('Created comment on post10');

//         // Add comments to posts
//         post1.comments.push(comment1._id, reply1._id);
//         await post1.save();

//         post2.comments.push(comment2._id);
//         await post2.save();

//         post3.comments.push(comment3._id);
//         await post3.save();

//         post4.comments.push(comment4._id, reply2._id);
//         await post4.save();

//         post5.comments.push(comment5._id);
//         await post5.save();

//         post6.comments.push(comment6._id, reply3._id);
//         await post6.save();

//         post7.comments.push(comment7._id);
//         await post7.save();

//         post8.comments.push(comment8._id);
//         await post8.save();

//         post9.comments.push(comment9._id);
//         await post9.save();

//         post10.comments.push(comment10._id);
//         await post10.save();

//         // Add comments to users
//         bob.comments.push(comment1._id);
//         await bob.save();

//         charlie.comments.push(comment2._id);
//         await charlie.save();

//         alice.comments.push(reply1._id, comment3._id, comment4._id, comment8._id);
//         await alice.save();

//         frank.comments.push(comment7._id, reply3._id);
//         await frank.save();

//         david.comments.push(reply2._id);
//         await david.save();

//         grace.comments.push(comment10._id);
//         await grace.save();

//         // Add replies to comments
//         comment1.replies.push(reply1._id);
//         await comment1.save();

//         comment4.replies.push(reply2._id);
//         await comment4.save();

//         comment6.replies.push(reply3._id);
//         await comment6.save();

//         // Set up following relationships
//         alice.following.push(bob._id, charlie._id, david._id, emma._id);
//         bob.followers.push(alice._id);
//         charlie.followers.push(alice._id);
//         david.followers.push(alice._id);
//         emma.followers.push(alice._id);

//         bob.following.push(alice._id, frank._id);
//         alice.followers.push(bob._id);
//         frank.followers.push(bob._id);

//         charlie.following.push(bob._id, david._id);
//         bob.followers.push(charlie._id);
//         david.followers.push(charlie._id);

//         david.following.push(alice._id, grace._id);
//         alice.followers.push(david._id);
//         grace.followers.push(david._id);

//         emma.following.push(charlie._id, grace._id);
//         charlie.followers.push(emma._id);
//         grace.followers.push(emma._id);

//         frank.following.push(bob._id, david._id);
//         bob.followers.push(frank._id);
//         david.followers.push(frank._id);

//         grace.following.push(emma._id, alice._id);
//         emma.followers.push(grace._id);
//         alice.followers.push(grace._id);

//         await alice.save();
//         await bob.save();
//         await charlie.save();
//         await david.save();
//         await emma.save();
//         await frank.save();
//         await grace.save();

//         console.log('Database seeded successfully!');
//         process.exit(0);

//     } catch (error) {
//         console.error('Error seeding database:', error);
//         process.exit(1);
//     }
// }

// seedDatabase();