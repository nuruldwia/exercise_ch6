const router = require('express').Router();
const { updateProfile } = require('../controllers/profile.controller');
const { imageStorage } = require('../libs/multer');

router.put('/updateprofile', imageStorage.single('image'), updateProfile);

module.exports = router;