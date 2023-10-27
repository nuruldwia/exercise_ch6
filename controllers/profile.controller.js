const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../libs/imagekit');

module.exports = {
    createProfile: async (req, res, next) => {
        try {
            let { userId } = req.user;
            let { first_name, last_name, birth_date } = req.body;
            let profile_picture = req.file;

            let userprofile = await prisma.userProfile.create({
                data: {
                    userId,
                    first_name,
                    last_name,
                    birth_date,
                    profile_picture
                }
            });

            res.status(201).json({
                status: true,
                message: "User profile created!",
                data: userprofile
            });
        } catch (err) {
            next(err);
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            let { first_name, last_name, birth_date } = req.body;
            let { profile_picture } = req.file;

            if (profile_picture) {
                return res.status(400).json({
                    status: false,
                    message: 'missing file',
                    data: null
                });
            };

            const file = req.file.buffer.toString('base64');

            if (!first_name || !last_name || !birth_date) {
                return res.status(400).json({ 
                    status: false,
                    message: 'is missing',
                    data: null
                });
            }

            let  { url } = await imagekit.upload({
                file,
                fileName,
                folder: '/images',
            });

            let update = await prisma.user.update({
                where: {
                  id: req.user.id,
                },
                data: {
                    profile: {
                        update: {
                            first_name,
                            last_name,
                            birth_date: new Date(birth_date).toISOString(),
                            profile_picture: url,
                        },
                    },
                },
            });

            res.status(200).json({
                status: true,
                message: "User were Successfully Updated!",
                data: update
            });
        } catch (err) {
            next(err);
        }
    }
};