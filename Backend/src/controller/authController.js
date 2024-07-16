import jwt from "jsonwebtoken";
import UserSchema from '../models/users.js'; 
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const applicationLogin = async (req, res, next) => {
    try {
        let userData = req.body;
        if (!userData.password || !userData.userName) {
            return res.status(401).json({ status: false, message: "Login username & password is required" });
        }

        let userDetail = await UserSchema.findOne({ deletedAt: null, status: true, userName: userData.userName });

        if(!userDetail)
            return res.status(403).json({ status: false, message: 'Its not a valid User.'});

        if(userDetail.userIsBlock){
            return res.status(403).json({ status: false, message: 'Account is locked. Please contact your admin' });
        }

        if(userDetail && userDetail.loginAttemptCount >= process.env.LOGIN_ATTEMPTS_COUNT){
            await updateUserData(userDetail._id, { userIsBlock: true })
            return res.status(403).json({ status: false, message: 'Account is locked. Please contact your admin' });
        }

        if (userDetail && userDetail._id) {
            let isVerified = await bcrypt.compareSync(userData.password, userDetail.password);
            if (isVerified) {
                userDetail = userDetail.toObject();
                delete userDetail.password;

                let payload = {
                    _id: userDetail._id,
                    userName: userDetail.userName
                };
                let token = JWT.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRATION,
                });
                if (token) {
                    await updateUserData(userDetail._id, { userToken: token, loginAttemptCount: 0 })
                }
                return res.status(200).json({ status: true, data: { user: userDetail }, message: "Success" });
            } else {
                await updateUserData(userDetail._id, { loginAttemptCount: userDetail.loginAttemptCount + 1 })
                return res.status(401).json({ status: false, data: {}, message: "Incorrect Password" });
            }

        } else {
            await updateUserData(userDetail._id, { loginAttemptCount: userDetail.loginAttemptCount + 1 })
            return res.status(401).json({ status: false, message: "Please give the valid username / password" });
        }
    } catch (error) {
        console.log('=== login ', error);
        return res.status(502).json({ status: false, data: {}, message: "Internal Server Error" });
    }
};


const updateUserData = async(id, userData) => {
    try{
        await UserSchema.updateOne({ _id: id }, userData);
    }catch(error){
        console.log(error)
    }
}