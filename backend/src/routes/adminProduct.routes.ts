import { Router } from "express"
import adminProductController from "../controllers/adminProduct.controller"
import { authLogin } from "../middleware/auth.middleware"
import { checkAdmin } from "../middleware/admin.middleware"
import { attachUser } from "../middleware/attachUser.middleware"

const adminRouter = Router()

adminRouter.use(authLogin, attachUser, checkAdmin)

adminRouter.get('/products', adminProductController.getAllProducts)
adminRouter.post('/products', adminProductController.addProduct)
adminRouter.get('/products/:id', adminProductController.getProductById)
adminRouter.put('/products/:id', adminProductController.updateProductById)
adminRouter.delete('/products/:id', adminProductController.deleteProductById)

export default adminRouter