const prisma = require('../libs/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ 
                    status: false,
                    message: 'is missing',
                    data: null
                });
            }

        const userExist = await prisma.users.findUnique({ where: { email }});
        if (userExist) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request!',
                err: 'Email has alredy used!',
                data: null
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                password: hashPassword
            }
        });

        return res.status(201).json({
            status: true,
            message: "CREATED!",
            err: null,
            data: { user }
        });

        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            let { email, password } = req.body;

            let user = await prisma.users.findUnique({ where: {email}});
            if (!user) {
                return req.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Invalid email or password!',
                    data: null
                });
            }

            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return req.status(400).json({
                    status: false,
                    message: 'Bad Request!',
                    err: 'Invalid email or password!',
                    data: null
                });
            }

            let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: "OK!",
                err: null,
                data: { user, token }
            });
        } catch(err) {
            next(err)
        }
    },

    authenticate: async (req, res, next) => {
        try {
            if(!req.user) 
            return res.status(401).json({
                status: false,
                message: 'unauthorized',
                data: null
            });

            let user = await prisma.user.findUnique({
                where: { id: req.user.id },
                include: { profile },
            });

            res.status(200).json({
                status: true,
                message: 'user authentication success',
                data: user,
            });
        } catch (err) {
            next(err);
        }
    }
};