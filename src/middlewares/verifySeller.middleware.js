import jwt from 'jsonwebtoken'
import apiError from '../utils/apiError.js'
import Seller from '../models/seller.model.js'


const verifySeller = async (req,res,next) =>{
    try {
        // accessing accessToken from cookies or header on client side
    const accessToken = await req.cookies.accessToken  
    console.log(req.cookies);
    // || req.headers['authorization']?.replace('Bearer ','')
    
    // if access token is missing in cookie or header, then seller is unauthorised : thus an error will be thrown!
    if(!accessToken) throw new apiError(401,'Unauthorized request!')

    // extracting seller information from the accessToken 
    const decodedSellerInfo = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

    // if no information is found : accessToken is faulty or not valid!
    if(!decodedSellerInfo) throw new apiError(401,'Invalid token')

    // finding seller with id extracted from 'decodedSellerInfo'
    const seller = await Seller.findById(decodedSellerInfo._id).select('-password -refreshToken')

    // sending seller info along with the request object
    req.seller = seller

    // since verification is done, hence passing next flag.
    next();
    } catch (error) {
        next(error)
    }
}

export default verifySeller;