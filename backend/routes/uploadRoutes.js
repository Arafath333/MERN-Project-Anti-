const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, uploadImage);
router.delete('/', protect, admin, deleteImage);

module.exports = router;
