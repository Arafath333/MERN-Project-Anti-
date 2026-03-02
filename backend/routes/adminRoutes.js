const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
