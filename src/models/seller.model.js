import mongoose,{Schema} from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";

const sellerSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minlength:[3,'Full name cannot be less than 3 characters!'],
    },
    email:{
        type:String,
        required:[true,'Please enter a valid email'],
        unique:[true,'Seller with this email already exists! Please try to Login!'],
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
    profilePhoto:{
        type:String,
        // required:[true, 'Please upload a profile picture.'],
    },

    refreshToken:{
        type:String
    },


},{timestamps:true})

sellerSchema.pre('save', async function(next){
    if (! this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

// creating a method to check if the password of the user is correct or not. Helpful during login
sellerSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password) // will return true or false values
}

// method to generate access token using jsonwebtoken
sellerSchema.methods.generateAccessToken = function(){
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
sellerSchema.methods.generateRefreshToken = function(){
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

const Seller = mongoose.model('Seller',sellerSchema)

export default Seller