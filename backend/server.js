import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoute.js'

//App config
const app = express()
const port = process.env.PORT || 4000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

connectDB()
connectCloudinary()

//middlewares 

app.use(express.json())
app.use(cors())

//Api endpoints

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/api',(req,res)=>{
    res.send('API Working')
})

// Serve the built storefront and admin apps so everything runs from one URL.
// Admin panel -> /admin, storefront -> /, API -> /api
const frontendDist = path.join(__dirname, '../frontend/dist')
const adminDist = path.join(__dirname, '../admin/dist')

if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist))
  // SPA fallback for admin routes (e.g. /admin/add, /admin/list, /admin/orders)
  app.use('/admin', (req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'))
  })
  console.log('Serving admin panel from', adminDist)
} else {
  console.log('Admin build not found, skipping /admin static serving')
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  // SPA fallback for storefront routes, but let /api requests pass through
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
  console.log('Serving storefront from', frontendDist)
} else {
  console.log('Frontend build not found, serving API only')
}

app.listen(port,()=>{
    console.log('Server started at PORT : ' + port);
})
