import jwt from 'jsonwebtoken'
import apiError from '../utils/apiError.js'
import User from '../models/user.model.js'

const verifyUser = async (req,_,next) =>{
   try {
     // accessing accessToken from cookies or header on client side
     const accessToken = req.cookies?.accessToken
      // || req.header('Authorization')?.replace('Bearer ','')
    
     // if access token is missing in cookie or header, then user is unauthorised : thus an error will be thrown!
     if(!accessToken) throw new apiError(401,'Unauthorized request!')
 
     // extracting user information from the accessToken 
     const decodedUserInfo = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
 
     // if no information is found : accessToken is faulty or not valid!
     if(!decodedUserInfo) throw new apiError(401,'Invalid token')
 
     // finding user with id extracted from 'decodedUserInfo'
     const user = await User.findById(decodedUserInfo._id).select('-password -refreshToken')
 
     // sending user info along with the request object
     req.user = user
 
     // since verification is done, hence passing next flag.
     next();
 
   } catch (error) {
    next(error)
   }
}

export default verifyUser;