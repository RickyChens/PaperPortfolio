const User = require('../models/user')
const { hashPassword, comparePasswords } = require('../helpers/auth')
const { updateJSON } = require('../helpers/scrape')
const jwt = require('jsonwebtoken')
const { validate } = require('deep-email-validator')
const { Decimal128 } = require('mongodb');

const test = (req, res) => {
    res.json('test is working')
}

// update Stock
const updateStock = async(req, res) => {
    try {
        const {stock, isCrypto} = req.body
        updateJSON(stock, isCrypto)
    } catch (error) {
        console.log(error)
    }
}

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const {user, email, password} = req.body
        let emailValid = await validate(email)
        // Check if user was entered
        if (!user) {
            return res.json({
                error: 'user is required'
            })
        };
        if(!emailValid.valid) {
            return res.json({
                error: 'Email Invalid'
            })
        }
        // Check if password is good
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        };
        // Check email
        const exist = await User.findOne({email})
        if (exist) {
            return res.json({
                error: 'Email already exists'
            })
        }
        
        const hashedPassword = await hashPassword(password)
        const Users = await User.create({
            creationDate: new Date(),
            user, 
            email, 
            password: hashedPassword,
            balance: 100000
        })

        return res.json(Users)
    } catch (error) {
        console.log(error)
    }
}

// Login endpoint
const loginUser = async (req, res) => {
    try {
        const {user, password} = req.body
        // Check if user exists
        const users = await User.findOne({user})
        if (!users) {
            return res.json({
                error: 'No user found'
            })
        }
        
        // Check password
        const match = await comparePasswords(password, users.password)
        if (match) {
            jwt.sign({email: users.email, id: users._id, name: users.user}, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                }).json(users)
            })
        }
        if (!match) {
            res.json({
                error: 'Passwords do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
} 

// getProfile endpoint

const getProfile = (req, res) => {
    const {token} = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if (err) throw err
            const searchedUser = await User.findByIdAndUpdate(
                user.id,
            );
            //console.log(searchedUser)
            res.json(searchedUser)
        })
    } else {
        res.json(null)
    }
}

// Set Balance Endpoint
const setBalance = async (req, res) => {
    try {
        //console.log("Cookies:", req.cookies); 
        //console.log("Body:", req.body);
        const {token} = req.cookies
        const {balance} = req.body;
        //console.log(token)

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if (err) throw err
                
                const updatedUser = await User.findByIdAndUpdate(
                    user.id,
                    { balance },
                    { new: true }
                );
                if (updatedUser) {
                    updatedUser.history.push({
                        date: new Date(),
                        balance: updatedUser.balance
                    })

                    await updatedUser.save();
                } else {
                    return res.json({ error: 'User not found' });
                }

                console.log(updatedUser)
                console.log("Sending response:", { message: 'Balance updated', user: updatedUser });
                return res.status(200).json({ message: 'Balance updated', user: updatedUser });
            })
        } else {
            res.json({ error: 'Token Invalid'})
        }
    } catch (err) {
        console.log(err)
    }
}

// buyStock
const buyStock = async (req, res) => {
    try {
        const {token} = req.cookies
        const {stock, amount, cost} = req.body;
        //console.log(amount)
        //console.log(cost)

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if (err) throw err
                
                const existingUser = await User.findById(user.id);
                if (!existingUser) {
                    return res.json({ error: 'User not found' });
                }

                balance = Number(existingUser.balance)
                //console.log(cost < balance)
                if (cost < balance) {
                    //console.log(existingUser.balance)
                    existingUser.balance -= cost
                    await existingUser.save();
                    existingUser.history.push({
                        date: new Date(),
                        balance: existingUser.balance
                    })
                    //console.log(existingUser.balance)
                } else {
                    return res.status(400).json({ error: 'Not enough money' });
                }

                // Find the stock in the user's stocks array
                const stockEntry = existingUser.stocks.find(s => s.stock === stock);

                if (stockEntry) {

                    const numericAmount = Decimal128.fromString(amount.toString());
                    const existingAmount = stockEntry.amount;

                    const updatedAmount = Decimal128.fromString(
                        (parseFloat(existingAmount.toString()) + parseFloat(numericAmount.toString())).toFixed(2)
                    );
                
                    stockEntry.amount = updatedAmount;
                } else {
                    // Add a new stock entry
                    existingUser.stocks.push({ stock, amount });
                }

                // Save the updated user document
                await existingUser.save();

                return res.status(200).json({ message: 'Stock Bought', user: existingUser });
            })
        } else {
            res.json({ error: 'Token Invalid'})
        }
    } catch (err) {
        console.log(err)
    }
}

// sellStock
const sellStock = async (req, res) => {
    try {
        const {token} = req.cookies
        const {stock, amount, cost} = req.body;
        //console.log(stock)
        //console.log(amount)

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if (err) throw err
                
                const existingUser = await User.findById(user.id);
                if (!existingUser) {
                    return res.json({ error: 'User not found' });
                }

                // Find the stock in the user's stocks array
                const stockEntry = existingUser.stocks.find(s => s.stock === stock);
                
                console.log(stockEntry)
                const stocksOwned = stockEntry.amount
                const isValid = stocksOwned - amount
                if (stockEntry && isValid >= 0) {
                    // Update the amount for the existing stock
                    stockEntry.amount -= amount;
                    //console.log(cost)
                    const numericAmount = Decimal128.fromString(cost.toString());
                    const existingAmount = existingUser.balance;
                    
                    const updatedAmount = Decimal128.fromString(
                        (parseFloat(existingAmount.toString()) + parseFloat(numericAmount.toString())).toFixed(2)
                    );

                    existingUser.balance = updatedAmount;
                    existingUser.history.push({
                        date: new Date(),
                        balance: existingUser.balance
                    })
                    await existingUser.save();
                } else {
                    return res.status(400).json({ error: 'Not enough stocks' });
                }

                // Save the updated user document
                await existingUser.save();
                return res.status(200).json({ message: 'Stock Sold', user: existingUser });
            })
        } else {
            res.json({ error: 'Token Invalid'})
        }
    } catch (err) {
        console.log(err)
    }
}

// Logout Endpoint
const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    setBalance,
    buyStock,
    sellStock,
    updateStock
}