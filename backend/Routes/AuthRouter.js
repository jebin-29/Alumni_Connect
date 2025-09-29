const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { verifyToken } = require('../Middlewares/authMiddleware'); // Import verifyToken middleware
const router = require('express').Router();
const upload = require('../Middlewares/multer');

// Route for student signup
router.post('/signup', upload.single('image'),signupValidation,signup);

// Route for student login
router.post('/login', loginValidation,login);

// Route to verify a user's token
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid' });
});

module.exports = router;