import Cart from "../models/cart.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// this object will be passed as a parameter while sending cookies to client
const options = {
    // if httpOnly is set to true, then cookie cannot be manupulated from client-side
    httpOnly:true, 
    secure:true
}

// below function will generate access and refresh tokens 
const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)
    if(!user) throw new apiError(404,'User does not exists')

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
 
    return {accessToken, refreshToken}
}


// below function registers the user in the database
const registerUser = asyncHandler(async (req,res) => {
    // destructuring data from req.body
    // TODO: add address
    const {fullname, email, password, phoneNumber, dob} = req.body

    try {
        // if any of the field from req.body is empty, an error will be thrown
        if([fullname,email,password,phoneNumber,dob].some((field)=>field?.trim()==='')){
            throw new apiError(400,'All fields are required!')
        }

        // checking if the user already exists in the database or not
        const existingUser = await User.findOne({email})
        if(existingUser) throw new apiError(400,'User with this email already exist, please try to login!')


        // below method will create an user in the database and return the created user
        const newUser = await User.create({
            fullname,email,password,phoneNumber,dob:new Date(dob)
        })
 
        if(!newUser) throw new apiError(500,'Some error occurred while creating account, please try again later!')

        // finding the newly created user from the database
        const user = await User.findById(newUser._id).select('-password')


        // but somehow if the user is not found , an error will be thrown
        if(!user) throw new apiError(500,'Some error occurred while creating account, please try again later!')


        // destructuring access and refresh tokens generated from the generateAccessAndRefreshTokens() function.
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)


        // storing generated refresh token in the user document and saving it in the database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
 
        const userToBeSentAsResponse = await User.findById(user._id).select('-password -refreshToken')
        // if everything works fine , below response will be sent to client side
       res.status(201)
       .cookie('accessToken',accessToken,options) // setting access token in user's browser
       .cookie('refreshToken',refreshToken,options) // setting refresh token in user's browser
       .json(new apiResponse(201,userToBeSentAsResponse,'Account created successfully!'))// sending user as a response 

    // loginUser();
    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

// login user
const loginUser = asyncHandler(async (req,res)=>{
    const {email,password, rememberMe} = req.body

    console.log(req.body);

    try {
        // check if the user with the provided email exists or not
        const existingUser = await User.findOne({email})
        if(!existingUser) throw new apiError(404,'User with this email does not exist, please Sign in')
        
        // checking if the password provided is same as in the database
        const isPasswordCorrect = await existingUser.isPasswordCorrect(password) // return true or false, isPasswordCorrect() is defined in user.model.js file

       // if provided password is not correct, an error will be thrown
        if(!isPasswordCorrect) throw new apiError(401, 'Invalid credentials!')

        // destructuring access and refresh tokens generated from the generateAccessAndRefreshTokens() function.
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(existingUser._id)

        // storing generated refresh token in the user document and saving it in the database
        existingUser.refreshToken = refreshToken
        await existingUser.save({validateBeforeSave:false})

        // finding a user to send its info to client side withou password and refreshToken fields
        const user = await User.findById(existingUser._id).select('-password -refreshToken')
 
        if(!user) throw new apiError(404,'User not found')

        // sending response

        if (rememberMe) {
            options.maxAge = 15 * 24 * 60 * 60 * 1000
        } else {
            options.maxAge = null
        }

        res.status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken',refreshToken,options)
        .json(new apiResponse(200,user,'Login successful!'))
    } catch (error) {
        throw new apiError(error.code,error.message)
    }

})

// logout user
const logoutUser = asyncHandler(async (req,res)=>{
    try {
        // req.user is defined in 'verifyUser.middleware.js' file and is decoded from the refreshToken available in the cookies
        await User.findByIdAndUpdate(req.user?._id,
            {
                // setting refreshToken field of user to null in the database
                $set:{
                    refreshToken:null
                }
            },
            {
                new:true
            }
            )

            // sending response
            res.status(200)
            .clearCookie('accessToken') // deleting access token from client side 
            .clearCookie('refreshToken') // deleting refresh token from client side
            .json(new apiResponse(200,{},'Logout successful!'))
    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

// changing user password
const changePassword = asyncHandler(async (req,res) => {
    try {
        // destructuring old password and new password from 'req.body'
        const {oldPassword, newPassword} = req.body

        // if any of both is missing, an error will be thrown
        if(!oldPassword || !newPassword) throw new apiError(401,'All fields are required')

        const user = await User.findById(req.user?._id)
        
        // below method is defined in 'user.model.js'
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

        // if incorrect password,an error will be thrown
        if(!isPasswordCorrect) throw new apiError(400,'Incorrect Password')

        // setting old password of the current user with the new one
        user.password = newPassword
        user.save({validateBeforeSave:false})


        // sending response
        res.status(201)
        .json(new apiResponse(201,{},'Password changed successfully!'))

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

// deleting user account
const deleteUser = asyncHandler(async (req,res) => {
    try {

        const deleteOrderHistory = await Order.deleteMany({owner:req.user._id})

        const deleteUserCart = await Cart.deleteMany({owner:req.user._id})

        if(!(deleteOrderHistory && deleteUserCart)) throw new apiError(500,'Account deletion failed! Try again later.')

        await User.findByIdAndDelete(req.user?._id)
        res.status(200)
        .clearCookie('accessToken',options)
        .clearCookie('refreshToken',options)
        .json(new apiResponse(200,{},'Account successfully deleted!'))
    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

const getCurrentUserDetails = asyncHandler(async (req,res) => {
    try {
        const user = req.user

        if(!user)  throw new apiError(401,'User not found! Please login')
        const existingUser = await User.findById(user._id)

        if(!existingUser) throw new apiError(404,'User not found! Please sign up')

        res.status(200)
        .json(new apiResponse(200,existingUser,'User fetched successfully'))

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUserDetails,
    deleteUser
}