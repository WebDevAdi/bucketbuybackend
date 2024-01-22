import dotenv from 'dotenv'
dotenv.config({
    path:'./.env',
})

import connectDB from './src/db/index.js'
import app from './app.js'
const PORT = process.env.PORT || 3000

connectDB()
.then(() => {
    app.listen(PORT, ()=>{
        console.log(`app listening at : http://localhost:${PORT}`)
    })
})
.catch((error) => console.log(`Database Connection error : ${error.message}`))