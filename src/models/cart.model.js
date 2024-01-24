import {Schema,model} from 'mongoose'
import apiError from '../utils/apiError.js'

const cartSchema = new Schema(
    {
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        products:[
            {
                product:{
                    type:Schema.Types.ObjectId,
                    ref:'Product' 
                },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ]
    },
    {
        // automatically adds createdAt and updatedAt fields in the document
        timestamps:true
    }
)

cartSchema.methods.populateProducts = async function () {

    try {
       return await this.populate('products.product')
    } catch (error) {
        throw new apiError(error.code, error.message)
    }
}

const Cart = model('Cart',cartSchema)

export default Cart