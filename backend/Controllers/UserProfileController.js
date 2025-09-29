const User = require('../Models/users');
const Alumni = require('../Models/alumni');

// Get current user's profile
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAlumni = req.isAlumni; // Use req.isAlumni from middleware

    let user;
    if (isAlumni) {
      user = await Alumni.findById(userId).select('fullName graduationYear role linkedin');
    } else {
      user = await User.findById(userId).select('fullName graduationYear course usn fieldOfStudy linkedin');
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user.toObject(),
      isAlumni
    });
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Check both User and Alumni models
    const [user, alumni] = await Promise.all([
      User.findById(id).select('fullName graduationYear course usn fieldOfStudy linkedin github'),
      Alumni.findById(id).select('fullName graduationYear role linkedin profilePhoto')
    ]);

    const profile = user || alumni;

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
      return res.json({ message: 'Profile updated successfully', user: updatedUser });
    }

    const alumni = await Alumni.findById(id);
    if (alumni) {
      const updatedAlumni = await Alumni.findByIdAndUpdate(id, updates, { new: true });
      return res.json({ message: 'Profile updated successfully', user: updatedAlumni });
    }

    return res.status(404).json({ error: 'User not found' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getCurrentUserProfile
};