const userDB = require('../model/user');
const jwt = require('jsonwebtoken');
const errcode = require("../config/errcode")

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Check if user already exists with the given email
        const existingUser = await userDB.findOne({
            email
        });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists with the given email'
            });
        }

        // Create new user
        const user = new userDB({
            name,
            email,
            password
        });
        const savedUser = await user.save();

        res.status(201).json({
            resp_status: true,
            resp_code: 'OK',
            resp_msg: "OK",
            message: 'User registered successfully',
            user: savedUser
        });
    } catch (error) {
        return res.json({
            resp_status: false,
            resp_code: 'DB_ERR_SELECT',
            resp_msg: errcode.DB_ERR_SELECT,
            resp_data_count: 0,
            resp_data: null
        });

    }
};

const loginForAuthenication = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Find user with the given email
        const user = await userDB.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed: user not found'
            });
        }

        // Check if password is correct with the response we get for user
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Authentication failed: wrong password'
            });
        }

        // Generate JWT token
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Authentication successful',
            token
        });
    } catch (error) {
        return res.json({
            resp_status: false,
            resp_code: 'DB_ERR_SELECT',
            resp_msg: errcode.DB_ERR_SELECT,
            resp_data_count: 0,
            resp_data: null
        });
    }
}

module.exports.loginForAuthenication = loginForAuthenication
module.exports.register = register