const { Router } = require('express');
const {
  GetDonationById,
  GetAllDonations,
  CreateNewDonation,
  UpdateDonationById,
  DeleteDonationById,
} = require('../controllers/donations');
const JWTValidation = require('../middlewares/auth')

const router = Router();

router.get('', [], GetAllDonations);
router.get('/admin', JWTValidation, GetAllDonations);
router.get('/:id', [], GetDonationById);
router.post('', [], CreateNewDonation);
router.put('/:id', JWTValidation, UpdateDonationById);
router.delete('/:id', JWTValidation, DeleteDonationById);

module.exports = router;
