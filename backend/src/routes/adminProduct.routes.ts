import { Router } from "express"
import adminProductController from "../controllers/adminProduct.controller"
import { authLogin } from "../middleware/auth.middleware"
import { checkAdmin } from "../middleware/admin.middleware"

const adminRouter = Router()

adminRouter.get('/', authLogin, checkAdmin, adminProductController.getAllProducts)
adminRouter.post('/', authLogin, checkAdmin, adminProductController.addProduct)
adminRouter.put('/:id', authLogin, checkAdmin, adminProductController.updateProductById)
adminRouter.delete('/:id', authLogin, checkAdmin, adminProductController.deleteProductById)

export default adminRouter