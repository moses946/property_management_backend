const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const adminAuth = require('../middleware/adminAuth');


router.use(adminAuth); 

router.post('/', unitController.createUnit);
router.get('/building/:buildingId', unitController.getUnitsByBuilding);
router.get('/:id', unitController.getUnitById);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);

module.exports = router;
