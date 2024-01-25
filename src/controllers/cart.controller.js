import Cart from "../models/cart.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req,res)=>{
   try {
     const user = req.user;
     const {productId, quantity} = req.body
     if(!user){
         window.location.href='/login'
     }
 
     const cart = await Cart.findOne({owner:user._id})
 
     if(!cart) {
 
         const newCart = await Cart.create({
             products:[{product:productId,quantity}],
             owner:user._id
         })

         res.status(201)
     .json(new apiResponse(201, newCart ,'Added to cart'))
         return null;
     }


    //  prevents adding same product in cart multiple times
     if(cart.products.some((product)=>product.product == productId)){
         res.end()
        return null;
     }

     cart.products.push({product:productId,quantity})
     await cart.save({validateBeforeSave:false})

     res.status(201)
     .json(new apiResponse(201, cart ,'Added to cart'))
   } catch (error) {
     throw new apiError(error.code,error.message)
   }
})

const removeItemFromCart = asyncHandler(async (req,res)=>{
    try {
        const user = req.user;
        const {productId} = req.body
        console.log(productId);

        const cart = await Cart.findOne({owner:user._id})

        if(!cart) throw new apiError(400,'No items in the cart')

        cart.products = cart.products.filter((item) => {
            return item.product._id != productId
        } )

        await cart.save({validateBeforeSave:false})

        res.status(200)
        .json(new apiResponse(200,cart,'Item Removed from Cart!'))

    } catch (error) {
        throw new apiError(error.code.error.message)
    }
})

const getUserCart = asyncHandler(async (req,res) => {
    try {
        const user = req.user

        const cart = await Cart.findOne({owner:user._id})

        if(!user || !cart){ 
            res.status(404)
            .json(new apiResponse(404,[],'Cart is empty'))
            return null;
        }

        // const populatedCart = await cart.populate('products.product')
        const userCart = await cart.populateProducts()

        res.status(200)
        .json(new apiResponse(200,userCart, 'Cart items list fetched!'))

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

const updateQuantity = asyncHandler(async(req,res)=>{
    try {
        const user = req.user
        const {productId,quantity} = req.body
        console.log(req.body);

        if(!user) throw new apiError(401,'Unauthorized Request!')

        const cart = await Cart.findOne({owner:user._id})

        if(!cart) throw new apiError(404,'Cart not found !')

        cart.products = cart.products.map((product)=>{
            if(product.product._id == productId){
                product.quantity = quantity
                console.log(product)
                return product
            }else{
                return product
            }
        })

        await cart.save({validateBeforeSave:false})

        const updatedCart = await Cart.findOne({owner:user._id})

        res.status(201)
        .json(new apiResponse(201,updatedCart,'Cart updated successfully'))

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

export {
    addToCart,
    removeItemFromCart,
    getUserCart,
    updateQuantity
}