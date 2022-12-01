import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';

import { createCategory } from './app/routes/categories/createCategory';
import { listCategories } from './app/routes/categories/listCategories';
import { createProduct } from './app/routes/products/createProduct';
import { listProducts } from './app/routes/products/listProducts';
import { listProductsbyCategory } from './app/routes/categories/listProductsbyCategory';
import { listOrders } from './app/routes/orders/listOrders';
import { createOrder } from './app/routes/orders/createOrder';
import { changeOrderStatus } from './app/routes/orders/changeOrderStatus';
import { cancelOrder } from './app/routes/orders/cancelOrder';

export const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

//List categories
router.get('/categories', listCategories);

//Create category
router.post('/categories', createCategory);

//List products
router.get('/products', listProducts);

//Create product
router.post('/products', upload.single('image'), createProduct);

//Get products by category
router.get('/categories/:categoryId/products', listProductsbyCategory);

//List orders
router.get('/orders', listOrders);

//Create order
router.post('/orders', createOrder);

//Change order status
router.patch('/orders/:orderId', changeOrderStatus);

//Delete/cancel order
router.delete('/orders/:orderId', cancelOrder);

