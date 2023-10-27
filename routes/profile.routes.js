const router = require('express').Router();
const { updateProfile, createProfile } = require('../controllers/profile.controller');
const { imageStorage } = require('../libs/multer');

router.post('/createprofile', createProfile);
router.put('/updateprofile', imageStorage.single('image'), updateProfile);

module.exports = router;