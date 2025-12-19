exports.getStats = (req, res) => {
    const stats = {
        activeMods: {
            count: 0,
            description: "Your team made 0 mod actions this week"
        },
        publishedPosts: {
            count: 120,
            description: "Up 10% from last week"
        },
        publishedComments: {
            count: 450,
            description: "Down 5% from last week"
        },
        reports: {
            count: 15,
            description: "Reports on posts and comments"
        }
    };
    res.json(stats);
};
