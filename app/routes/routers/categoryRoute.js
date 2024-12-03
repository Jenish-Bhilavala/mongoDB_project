const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const { globalRoute } = require('../../utils/globalRoute');

router.post('/', categoryController.addCategory);
router.get('/view-category/:id', categoryController.viewCategory);
router.post('/list-category', categoryController.listCategory);
router.put('/update-category/:id', categoryController.updateCategory);
router.delete('/delete-category/:id', categoryController.deleteCategory);
router.all('*', globalRoute);

module.exports = router;
