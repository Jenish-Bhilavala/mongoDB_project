const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer');
const userController = require('../../controllers/userController');

router.post('/', upload.single('image'), userController.registerUser);
router.get('/view-profile/:id', userController.viewProfile);
router.post('/login', userController.loginUser);
router.put(
  '/update-profile/:id',
  upload.single('image'),
  userController.updateProfile
);
router.post('/verify-email', userController.verifyEmail);
router.put('/forgot-password', userController.forgotPassword);

module.exports = router;
