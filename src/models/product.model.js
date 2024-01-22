import {Schema,model} from "mongoose";

const productSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
            minlength:[8,'Product title must be atleast 8 characters long!'],
            trim:true,
        },
        price:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:[true,'Please provide a product description!'],
            trim:true,
            minlength:[15,'Product description should be atleast 15 characters long']
        },
        productImages:[
            {
                type:String,
                required:true
            }
        ],
        category:{
            type:String,
            required:[true,'Please select a category']
        },
        subcategory:{
            type:String,
            required:[true,'Please select a subcategory']
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:'Seller'
        },
        totalOrders:{
            type:Number,
            default:0
        }
    },
    {
        // automatically adds createdAt and updatedAt fields in the document
        timestamps:true
    }
)

const Product = model('Product',productSchema)

export default Product