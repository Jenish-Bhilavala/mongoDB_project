const express = require('express');
const router = express.Router();
const testimonialController = require('../../controllers/testimonialController');
const upload = require('../../utils/multer');
const { globalRoute } = require('../../utils/globalRoute');

router.post('/', upload.single('image'), testimonialController.addTestimonial);
router.get('/view-testimonial/:id', testimonialController.viewTestimonial);
router.post('/list-testimonial', testimonialController.listOfTestimonial);
router.put(
  '/update-testimonial/:id',
  upload.single('image'),
  testimonialController.updateTestimonial
);
router.delete(
  '/delete-testimonial/:id',
  testimonialController.deleteTestimonial
);
router.all('*', globalRoute);

module.exports = router;
