const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

router.post('/', buildingController.createBuilding);
router.get('/', buildingController.getBuildings);
router.get('/admin/:adminId', buildingController.getBuildingsByAdmin);
router.get('/:id', buildingController.getBuildingById);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

module.exports = router;
