const prisma = require('../libs/prisma');
const imagekit = require('../libs/imagekit');

module.exports = {
    updateProfile: async (req, res, next) => {
        try {
            let { first_name, last_name, birth_date } = req.body;

            if (!req.file) {
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
                        upsert: {
                            create: {
                                first_name,
                                last_name,
                                birth_date: new Date(birth_date).toISOString(),
                                profile_picture: url,
                             },
                            update: {
                                first_name,
                                last_name,
                                birth_date: new Date(birth_date).toISOString(),
                                profile_picture: url,
                            },
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