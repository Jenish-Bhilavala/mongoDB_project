const express = require('express');
const router = express.Router();
const portfolioController = require('../../controllers/portfolioController');
const upload = require('../../utils/multer');
const { globalRoute } = require('../../utils/globalRoute');

router.post('/', upload.array('image'), portfolioController.addPortfolio);
router.get('/view-portfolio/:id', portfolioController.viewPortfolio);
router.post('/list-portfolio', portfolioController.listOfPortfolio);
router.put(
  '/update-portfolio/:id',
  upload.array('image'),
  portfolioController.updatePortfolio
);
router.delete('/delete-portfolio/:id', portfolioController.deletePortfolio);
router.all('*', globalRoute);

module.exports = router;
