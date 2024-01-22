import asyncHandler from '../utils/asyncHandler.js'
import apiError from '../utils/apiError.js'
import Seller from '../models/seller.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import apiResponse from '../utils/apiResponse.js'
import Product from '../models/product.model.js'

// this object will be passed as a parameter while sending cookies to client
const cookieOptions = {
    httpOnly: true,
}

// below function will generate access and refresh tokens 
const generateAccessAndRefreshTokens = async (sellerId) => {
    const seller = await Seller.findById(sellerId)
    if (!seller) throw new apiError(404, 'User does not exists')

    const accessToken = seller.generateAccessToken()
    const refreshToken = seller.generateRefreshToken()

    return { accessToken, refreshToken }
}

const createSellerAccount = asyncHandler(async (req, res) => {
    try {
        const { fullname, email, password } = req.body

        // checking empty fields
        if ([fullname, email.password].some((field) => field == '')) throw new apiError(400, 'All fields are required!')

        // checking if seller already exists or not !

        const existingSeller = await Seller.findOne({ email })

        if (existingSeller) throw new apiError(400, 'Seller with this email already exists! Try to Log In')

        const profilePhotoLocalPath = req.file?.path

        if (!profilePhotoLocalPath) throw new apiError(500, 'Unable to create account please try again later!')

        const profilePhotoCloudinaryUrl = await uploadOnCloudinary(req.file.path)

        if (!profilePhotoCloudinaryUrl) throw new apiError(500, 'image upload on cloudinary failed!')

        const newSeller = await Seller.create({
            fullname,
            email,
            password,
            profilePhoto: profilePhotoCloudinaryUrl
        })

        if (!newSeller) throw new apiError(500, 'Sorry we unable to create account! Please try again later')

        const seller = await Seller.findById(newSeller._id).select('-password')

        if (!seller) throw new apiError(500, 'Unable to create account')

        const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(seller._id)

        seller.refreshToken = refreshToken
        await seller.save({ validateBeforeSave: false })

        res.status(201)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(new apiResponse(201, seller, 'Account created successfully!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})


const sellerLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body

        if (!email || !password) throw new apiError(400, 'Email and password both are required!')

        // check if seller exists or not
        const existingSeller = await Seller.findOne({ email }).select('-refreshToken')

        if (!existingSeller) throw new apiError(400, "Seller with this email doesn't exist!")

        const isPasswordCorrect = await existingSeller.isPasswordCorrect(password)

        if (!isPasswordCorrect) throw new apiError(400, 'Invalid credentials!')

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingSeller._id)

        existingSeller.refreshToken = refreshToken
        await existingSeller.save({ validateBeforeSave: false })

        const seller = await Seller.findById(existingSeller._id).select('-password -refreshToken')

        if (rememberMe) {
            cookieOptions.maxAge = 15 * 24 * 60 * 60 * 1000
        } else {
            cookieOptions.maxAge = null
        }

        res.cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(new apiResponse(200, seller, 'Seller logged in!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

const sellerLogout = asyncHandler(async (req, res) => {
    try {
        const seller = req.seller
        if (!seller) throw new apiError(401, 'Unauthorized Request!')

        const updatedSeller = await Seller.findByIdAndUpdate(seller._id,
            {
                $set: {
                    refreshToken: null
                }
            },
            {
                new: true
            }
        )

        if (!updatedSeller) throw new apiError(500, 'Unable to logout right now , please try again later')


        res.status(200)
            .clearCookie('accessToken',{httpOnly:true, expires:new Date(0)})
            .clearCookie('refreshToken',{httpOnly:true, expires:new Date(0)})
            .json(200,{},'Logged out successfully')
    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

const getCurrentSeller = asyncHandler(async (req, res) => {
    try {
        const seller = req.seller
        if (!seller) throw new apiError(404, 'Seller is not logged in');

        res.status(200)
            .json(new apiResponse(200, seller, 'seller fetched successfully!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})


// Seller's product related controllers

const addProduct = asyncHandler(async (req, res) => {
    try {
        const { title, price, description, productImages, category, subcategory } = req.body

        console.log(req.body);

        if ([title, price, description, productImages, category].some((field) => { field === '' })) throw new apiError(400, 'All fields are required!')

        const product = await Product.create({ title, price: `₹ ${price}`, description, productImages, category, subcategory, owner: req.seller?._id })

        if (!product) throw new apiError(500, 'Some error occurred while listing your product, please try again later!')

        res.status(201)
            .json(new apiResponse(201, {}, 'Product listed successfully'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

const getSellerAllProduct = asyncHandler(async (req, res) => {
    try {
        const seller = req.seller

        if (!seller) throw new apiError(401, 'Unauthorised seller request')

        const sellerProducts = await Product.find({ owner: seller._id }).select('-owner -updatedAt -__v')

        if (!sellerProducts) throw new apiError(404, 'No Products Found!')

        res.status(200)
            .json(new apiResponse(200, sellerProducts, 'Product fetched successfully!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})


const deleteSelectedProduct = asyncHandler(async (req, res) => {
    try {
        const seller = req.seller

        const productIds = req.body.productIds // this will be an array

        if (!seller) throw new apiError(401, 'Unauthorized request!')

        if (!productIds) throw new apiError(400, 'Please provide product\'s id')

        await Product.deleteMany({ _id: { $in: productIds } })

        res.status(200)
            .json(200, {}, 'Product(s) deleted!')
    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})


export {
    createSellerAccount,
    sellerLogin,
    sellerLogout,
    getSellerAllProduct,
    addProduct,
    deleteSelectedProduct,
    getCurrentSeller
}