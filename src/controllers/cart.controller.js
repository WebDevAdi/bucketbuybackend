import Cart from "../models/cart.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req,res)=>{
   try {
     const user = req.user;
     const product = req.product
     if(!user){
         window.location.href='/login'
     }
 
     const cart = await Cart.findOne({owner:user._id})
 
     if(!cart) {
 
         const cart = await Cart.create({
             products:[product],
             owner:user._id
         })
     }
 
     cart.products = cart.products.append(product)
     cart.save({validateBeforeSave:false})
 
     res.status(201)
     .json(new apiResponse(201, cart ,'Added to cart'))
   } catch (error) {
     throw new apiError(error.code,error.message)
   }
})

const removeItemFromCart = asyncHandler(async (req,res)=>{
    try {
        const user = req.user;
        const productId = req.productId;

        const cart = await Cart.findOne({owner:user._id})

        if(!cart) throw new apiError(400,'No items in the cart')

        cart.products = cart.products.map((item) => {
            return item !== productId
        } )

        cart.save({validateBeforeSave:false})

        res.status(200)
        .json(new apiResponse(200,cart,'Removed!'))

    } catch (error) {
        throw new apiError(error.code.error.message)
    }
})

const viewCartItems = asyncHandler(async (req,res) => {
    try {
        const user = req.user

        const cart = await Cart.findOne({owner:user._id})

        if(!user || !cart){ 
            res.status(404)
            .json(new apiResponse(404,{},'Cart is empty'))
        }

        res.status(200)
        .json(new apiResponse(200,cart, 'Cart items list fetched!'))

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})


export {
    addToCart,
    removeItemFromCart,
    viewCartItems
}