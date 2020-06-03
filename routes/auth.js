const router = require('express').Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.send({ msg: error.details[0].message })

    //checking if the user is already in database
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send({ msg: 'Email already exits' })

    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //create a new user
    const user = new User(
        {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        }
    )
    try {
        const saveUser = await user.save()
        res.send({ user: saveUser.id })
    } catch (error) {
        res.status(400).send(error)
    }
})

//login
router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.send({ msg: error.details[0].message })

    //checking if the email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({ msg: 'email or password is wrong' })

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('email or password is wrong')

    //create and assign a token
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router