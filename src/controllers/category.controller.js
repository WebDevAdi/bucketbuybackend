import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"

const productCategories = {
    "Computer & Laptops": [
      "Laptops",
      "Desktop Computers",
      "Computer Accessories",
    ],
    "Mobile & Accessories": ["Smartphones", "Mobile Accessories"],
    "Audio & Headphones": ["Headphones", "Speaker", "Audio Accessories"],
    "Camera & Photography": ["Digital Cameras", "Camera Accessories"],
    "Home Appliances": ["Smart Home Devices", "Kitchen Appliances"],
    "Tv and Home Entertainment": ["Television", "Home Theatre Systems"],
    "Wearables & Smart Devices": [
      "Smartwatches",
      "Fitness Tracker",
      "Smart Home Devices",
    ],
    Gaming: ["Gaming Consoles", "Video Games", "Gaming Accessories"],
  };

const categories = async(req,res) => {
    try {
        res.status(200)
        .json(new apiResponse(200,productCategories,'Categories fetched successfully!'))
    } catch (error) {
        throw new apiError(error.code,error.message)
    }
}

export default categories;