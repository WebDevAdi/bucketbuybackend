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

const getProductByUserSearch = asyncHandler(async(req,res)=>{
    try {
        const {page,limit} = req.query
        const query = req.query.q.toLowerCase()
        if(!query) throw new apiError(400,'Please enter something to query!')

        const queryKeywords = query.split(' ')

        const products = await Product.find({})
        let searchedProducts = []

        queryKeywords.forEach((keyword)=>{
            products.forEach((product)=>{
                let matchString = (product.title + " " + product.category + " " + product.subcategory).toLowerCase()
                if(matchString.includes(keyword)){
                    searchedProducts.push(product)
                }
            })
        })
        
        if(searchedProducts.length===0) throw new apiError(404,'No Products Found! Please check typos or try with another relevant keyword')

        res.status(200)
        .json({...new apiResponse(200,searchedProducts.slice((page-1)*limit,page*limit),'Products fetched successfully'), totalResults:searchedProducts.length})

    } catch (error) {
        throw new apiError(error.code,error.message)
    }
})

export {
    getProductById,
    getProducts,
    getProductByUserSearch
}