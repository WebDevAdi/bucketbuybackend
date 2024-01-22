import Order from "../models/order.model.js";;
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const orderProduct = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const productIdsArr = req.body // this will be an array

        let totalPrice;
        productIdsArr.forEach((id) => {
            const product = getSingleProduct(id)
            totalPrice += product.price
        })

        if (!user) throw new apiError(401, 'Unauthorised request')

        const order = await Order.create({
            orderedBy: user._id,
            status: 'PENDING',
            products: productIdsArr,
            totalPrice
        })

        if (!order) throw new apiError(500, 'Could not make new orders right now, please try again later!')

        res.status(201)
            .json(201, Order, 'Order confirmed!')
    } catch (error) {
        throw new apiError(error.code, error.message)
    }

})

const cancelOrder = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const orderId = req.body.orderId

        if (!user) throw new apiError(401, 'Unauthorized request!')

        const order = await Order.findByIdAndUpdate(orderId, {
            $set: {
                status: 'CANCELLED'
            }
        })

        if (!order) throw new apiError(500, 'Failed to cancel order right now, please try again later!')

        res.status(200)
            .json(new apiResponse(200, order, 'Order cancelled!'))

    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

const getUserAllOrders = asyncHandler(async (req, res) => {
    try {
        const user = req.user

        if (!user) throw new apiError(401, 'Unauthorized request!')

        const orders = await Order.find({ orderedBy: user._id })

        if (!orders) throw new apiError(404, 'Unable to get orders!')

        res.status(200)
            .json(new apiResponse(200, orders, 'Order history fetched successfully!'))
    } catch (error) {
        throw new apiError(error.code, error.message)
    }
})

export {
    orderProduct,
    cancelOrder,
    getUserAllOrders
}