import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// defining cors origin
app.use(cors())
app.use(cookieParser())

app.use(express.static(path.join(`${__dirname}/dist`)))



// to manupulate cookies on client side from server


// to parse the data comming from url
app.use(express.urlencoded({extended:true}))

// to access public folder
app.use(express.static('public'))

// to parse incoming json data. 'body-parser' can also be used
app.use(express.json())


// routes 
import userRoutes from './src/routes/user.routes.js'
import productRoutes from './src/routes/product.routes.js'
import cartRoutes from './src/routes/cart.routes.js'
import orderRoutes from './src/routes/order.routes.js'
import sellerRoutes from './src/routes/seller.routes.js'
import categories from './src/routes/category.routes.js'
import { fileURLToPath } from 'url'

app.use('/api/v1/user',userRoutes)

app.use('/api/v1/products',productRoutes)

app.use('/api/v1/cart',cartRoutes)

app.use('/api/v1/order',orderRoutes)

app.use('/api/v1/seller',sellerRoutes)

app.use('/api/v1/categories',categories)

app.use('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist','index.html'))
})

export default app