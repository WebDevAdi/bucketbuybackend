import {Schema,model} from 'mongoose'

const cartSchema = new Schema(
    {
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        products:[
            {
                productId:{
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

const Cart = model('Cart',cartSchema)

export default Cart