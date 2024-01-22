import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()


// defining cors origin
app.use(cors())


// to manupulate cookies on client side from server
app.use(cookieParser())



// to parse the data comming from url
app.use(express.urlencoded({extended:true, limit:'100kb'}))

// to access public folder
app.use(express.static('public'))

// to parse incoming json data. 'body-parser' can also be used
app.use(express.json())

app.get('/',(req,res)=> {
    res.send('hello')
})

// routes 
import userRoutes from './src/routes/user.routes.js'
import productRoutes from './src/routes/product.routes.js'
import cartRoutes from './src/routes/cart.routes.js'
import orderRoutes from './src/routes/order.routes.js'
import sellerRoutes from './src/routes/seller.routes.js'
import categories from './src/routes/category.routes.js'

app.use('/api/v1/user',userRoutes)

app.use('/api/v1/products',productRoutes)

app.use('/api/v1/cart',cartRoutes)

app.use('/api/v1/order',orderRoutes)

app.use('/api/v1/seller',sellerRoutes)

app.use('/api/v1/categories',categories)

export default app