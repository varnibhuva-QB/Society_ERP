const express = require('express');
const { amenityController } = require('../controllers');
const { authenticate, isAdminOrChairman } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Get all amenities
router.get('/', amenityController.getAll);

// Create amenity (admin/chairman only)
router.post('/', isAdminOrChairman, amenityController.create);

// Update amenity (admin/chairman only)
router.put('/:id', isAdminOrChairman, amenityController.update);

// Delete amenity (admin/chairman only)
router.delete('/:id', isAdminOrChairman, amenityController.delete);

module.exports = router;
