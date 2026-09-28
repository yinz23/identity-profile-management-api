const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/usersModel');

//register new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;

        //check all required fields provided
        if (!username || !email || !password || !roleId) {
            return res.status(400).json({
                message: 'Username, email, password and role are required'
            });
        }

        //check if username already exist
        const existingUser = await usersModel.userByUsername(username);

        if (existingUser) {
            return res.status(409).json({
                message: 'Username already exists'
            });
        }

        //hash password before saving 
        const passwordHash = await bcrypt.hash(password, 10);

        //create user in database
        const userId = await usersModel.createUser(
            username,
            email,
            passwordHash,
            roleId
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: userId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Registration failed'
        });
    }
};

//login as existing user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //check required fields provided
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        //find user
        const user = await usersModel.userByUsername(username);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        //compare entered password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        //create jwt token
        const token = jwt.sign(
            {
                userId: user.user_id,
                roleId: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            message: 'Login successful',
            token: token,
            userId: user.user_id,
            roleId: user.role_id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Login failed'
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};