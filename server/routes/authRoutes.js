const express = require('express');
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, getProfile, logoutUser, setBalance, buyStock, sellStock, updateStock } = require('../controllers/authController')

// middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.post('/logout', logoutUser);
router.put('/setBalance', setBalance);
router.put('/buy', buyStock);
router.put('/sell', sellStock);
router.post('/update', updateStock);

module.exports = router