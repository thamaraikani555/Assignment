import UserSchema from '../models/users.js'; 
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';


const checkEmailIdPhoneNumberExist = async(userName) => {
    try{
        let isUser = await UserSchema.findOne({ deletedAt: null, status: true, userName: userName});
        if(isUser && isUser._id){
            return true
        }else{
            return false
        }
    }catch(error){
        return true
    }
}

export const createNewUser = async(req, res, next) => {
    try{
        let userData = req.body;

        if(!userData.password || !userData.userName){
            res.status(401).json({ status: false, message: "This username & password is required"})
        }

        let checkduplicate = await checkEmailIdPhoneNumberExist(userData.userName);
        if(checkduplicate){
            return res.status(401).json({ status: false, message: "This username is already exists, Please give the other userName"})
        }

        let payload = {
            userName: userData.userName,
            status: userData.status
        };
        let salt = bcrypt.genSaltSync();
        let hash = bcrypt.hashSync(userData.password, salt);
        payload['password'] = hash;

        let user = await new UserSchema(payload)
        let result = await user.save();

        if(result && result._id){
            return res.status(200).json({ status: true, data: result, message: "Successfully Created"})
        }else{
            return res.status(409).json({ status: true, data: {}, message: "Unable to create"})
        }

    }catch(error){
        console.log('=== createNewUser ', error)
        return res.status(502).json({ status: true, message: "Internal Server Error"})
    }
}

export const makeNewLink = async(req,res, next) => {
    try{
        let body = req.body;
        if(!body.userName){
            return res.status(401).json({ status: false, data: {}, message: "Please give the valid User"})
        }
        let userDetail = await UserSchema.findOne({ deletedAt: null, status: true, userName: body.userName });
        if(!userDetail)
            return res.status(404).json({ status: false, data: {}, message: "User Not Found"})

        const token = JWT.sign(
            { userName: body.userName, type: 'one-time-link' }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.OTL_EXPIRATION_TIME }
        );
        let url = process.env.BACKEND_URL + `/client-api/v1/use-link?token=${token}`
        return res.status(200).json({ status: true, data: {link: url}, message: "Successfully Generated"});

    }catch(error){
        return res.status(502).json({ status: false, data: {}, message: "Internal Server Error"})
    }
}

export const useCustomLink = async(req,res, next) => {
    try{
        let token = req.query.token || null;
        if(!token){
            return res.status(403).json({ status: false, data: {}, message: "Token is required"})
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err || decoded.type !== 'one-time-link') 
                return res.status(401).json({ error: 'Invalid or expired link' });

            const userToken = JWT.sign(
                { userName: decoded.userName }, 
                process.env.JWT_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION }
            );
            return res.status(200).json({ status: true, data: { token: userToken }, message: "Token is required"})
        });
    }catch(error){
        return res.status(502).json({ status: false, data: {}, message: "Internal Server Error"})
    }
}

export const removeTokenFromUser = async(req, res, next) => {
    try{
        const body = req.body;
        let userName = body.userName;
        if(!userName){
            return res.status(403).json({ status: false, data: {}, message: "Username is required"})
        }

        let userDetail = await UserSchema.findOne({ deletedAt: null, status: true, userName: userName });
        if(!userDetail)
            return res.status(404).json({ status: false, data: {}, message: "User Not Found"})

        let isupdated = await updateUserData(userDetail._id, {userIsBlock: true, token: null})
        if(isupdated){
            return res.status(200).json({ status: true, message:  'User has been kicked out' })
        }else{
            return res.status(401).json({ status: false, message:  'User has not been kicked out' })
        }
    }catch(error){
        return res.status(502).json({ status: false, message:  'Internal Server Error' })
    }
}

const updateUserData = async(id, userData) => {
    try{
        await UserSchema.updateOne({ _id: id }, userData);
        return true
    }catch(error){
        console.log(error)
        return false
    }
}