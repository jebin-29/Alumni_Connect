const User = require('../Models/users');
const Alumni = require('../Models/alumni');

const getUsersForSidebar = async (req, res) => {
    try {
        const currentUserId = req.user?._id;

        // Fetch students and alumni concurrently
        const [students, alumni] = await Promise.all([
            User.find({ _id: { $ne: currentUserId } })
                .select('_id fullName profilePhoto')
                .lean(),
            Alumni.find({ _id: { $ne: currentUserId } })
                .select('_id fullName profilePhoto')
                .lean()
        ]);

        // Combine the results and send them as a single list
        const users = [...students, ...alumni];

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }
};

module.exports = { getUsersForSidebar };