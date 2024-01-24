import Product from "../models/product.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"



const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)

        if (!product) throw new apiError(404, 'Product Not Found!')

        res.status(200)
            .json(new apiResponse(200, product, 'Product Found!'))
    } catch (error) {
        throw new apiError(error.code, error.message)
    }

})

const getProducts = asyncHandler(async (req, res) => {
    try {
        const { category, subcategory } = req.params

        let products=[];
  
        if(subcategory !== 'undefined'){
            products = await Product.find({subcategory})
        }else if(subcategory === 'undefined'){
            products = await Product.find({category})
        }

       res.status(200)
       .json(new apiResponse(200,products,'Products Fetched Successfully!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

export {
    getProductById,
    getProducts
}