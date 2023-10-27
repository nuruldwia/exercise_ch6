const router = require('express').Router();
const { register, login, authenticate } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/authentication', authenticate);

module.exports = router;