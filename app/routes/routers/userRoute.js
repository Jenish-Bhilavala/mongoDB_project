const express = require('express');
const router = express.Router();
const upload = require('../../utils/multer');
const userController = require('../../controllers/userController');

router.post('/', upload.single('image'), userController.registerUser);
router.get('/view/:id', userController.viewUser);
router.post('/login', userController.loginUser);

module.exports = router;
