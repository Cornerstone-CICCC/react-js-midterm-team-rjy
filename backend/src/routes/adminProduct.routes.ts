import { Router } from "express"
import adminProductController from "../controllers/adminProduct.controller"
import { authLogin } from "../middleware/auth.middleware"
import { checkAdmin } from "../middleware/admin.middleware"

const adminRouter = Router()

adminRouter.get('/products', authLogin, checkAdmin, adminProductController.getAllProducts)
adminRouter.post('/products', authLogin, checkAdmin, adminProductController.addProduct)
adminRouter.get('/products/:id', authLogin, checkAdmin, adminProductController.getProductById)
adminRouter.put('/products/:id', authLogin, checkAdmin, adminProductController.updateProductById)
adminRouter.delete('/products/:id', authLogin, checkAdmin, adminProductController.deleteProductById)

export default adminRouter