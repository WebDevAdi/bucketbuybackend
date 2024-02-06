import {Schema,model} from "mongoose";
import apiError from "../utils/apiError.js";

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
                product:{
                    type:Schema.Types.ObjectId,
                    ref:'Product' 
                },
                quantity:{
                    type:Number,
                    default:1
                },
                orderPrice:{
                    type:Number,
                    required:true
                },
                subtotal:{
                    type:Number,
                    required:true
                },
            }
        ],
        totalAmount:{
            type:Number,
            required:true
        },
        shippingAddress:{
            type:Object,
           required:true
            
        },
         paymentMethod:{
            type:String,
            enum:['Cash on Delivery','Debit Card','Credit Card'],
            default:'Cash on Delivery'
         },
         deliveryCharges:{
            type:Number,
            required:true,
            default:0
         },
         subtotal:{
            type:Number,
            required:true
         }
    },
    {
    // automatically adds createdAt and updatedAt fields in the document
    timestamps:true,
    }
)

orderSchema.methods.populateProducts = async function() {
    try {
       return await this.populate('products.product')
    } catch (error) {
        throw new apiError(error.code, error.message)
    }
}

const Order = model('Order',orderSchema)

export default Order;