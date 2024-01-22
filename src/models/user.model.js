import mongoose,{Schema} from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";

// creating a user schema 
const userSchema = new Schema({
    fullname:{
        type:String,
        required:[true,'Please enter your full name'],
        trim:true,
        lowercase:true,
        minlength:[3,'Full name cannot be less than 3 characters!'],
    },
    email:{
        type:String,
        required:[true,'Please enter a valid email'],
        unique:[true,'User with this email already exists! Please try to Login!'],
        validate(value){
            if(!validator.isEmail(value)) throw new apiError(400,'Please provide a valid email!')
        }
    },
    password:{
        type:String,
        required:[true,'Please your enter password!'],
        trim:true,
        minlength:[8,'Please enter a password having atleast 8 characters!']
    },
    // address:{
    //     streetAddress:{
    //         type:String,
    //         required : [true,'Please enter you street address!'],
    //         trim:true,
    //     },
    //     apartment:{
    //         type:String,
    //     },
    //     city:{
    //         type:String,
    //         required:[true,'Please select your city name!'],
    //     },
    //     state:{
    //         type:String,
    //         required:[true,'Please select your state']
    //     },
    //     pinCode:{
    //         type:String,
    //         required:[true,'Please enter a valid pincode!']
    //     },
    //     country:{
    //         type:String,
    //         default:'India'
    //     }

    // },
    ordersHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Order'
        }
    ],
    phoneNumber:{
        type:Number,
        required:true,
        minlength:[10,'Enter a valid phone number!'],
        maxlength:[10,'Enter a valid phone number']
    },
    dob:{
        // date format should be yyyy-mm-dd
        type:Date,
        required:[true,'Please enter your age!']
    },
    refreshToken:{
        type:String
    }
},
{
    // automatically adds createdAt and updatedAt fields in the document
    timstamps:true
}
)

// hashing passwords before saving a user in database(mongoDB)
userSchema.pre('save', async function(next){
    if (! this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

// creating a method to check if the password of the user is correct or not. Helpful during login
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password) // will return true or false values
}

// method to generate access token using jsonwebtoken
userSchema.methods.generateAccessToken = function(){
    const accessToken = jwt.sign(
        {
            _id:this._id,
            fullname:this.fullname,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return accessToken
}

// method to generate refresh token using jsonwebtoken
userSchema.methods.generateRefreshToken = function(){
    const refreshToken = jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return refreshToken
}

// creating a model from userSchema
const User = mongoose.model('User',userSchema)

export default User