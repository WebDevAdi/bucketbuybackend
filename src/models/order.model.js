import {Schema,model} from "mongoose";

const orderSchema = new Schema(
    {
        orderedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        status:{
            type:String,
            emum:['PENDING','DELIVERED','CANCELLED'],
            default:'PENDING'
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
    timestamps:true,
    }
)

const Order = model('Order',orderSchema)

export default Order;