const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const { globalRoute } = require('../../utils/globalRoute');

router.post('/', categoryController.addCategory);
router.get('/view-category/:id', categoryController.viewCategory);
router.post('/list-category/:id', categoryController.listCategory);
router.all('*', globalRoute);

module.exports = router;
