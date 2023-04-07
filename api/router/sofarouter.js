const router = require("express").Router();

const {signup_post,login_post,getLoggedInUser, logout, changePassword, clearUserTable} = require("../controller/authControllers");

const {
    addProduct,
    getAllProducts,
    clearProductsTable,
    updateProduct,
    deleteProduct
} = require("../controller/sofaproducts");

const {
saveItems,
getItems,
deleteOneItem
} = require("../controller/cart");
const { authorize } = require("../middleware/authorization");


// products
router.get("/products",getAllProducts);
router.post("/products/add",authorize,addProduct);
router.delete("/products/clear",authorize,clearProductsTable);
router.delete("/products/delete/:id",authorize,deleteProduct)
router.put("/products/update/:id",authorize,updateProduct)

// orders 
router.post("/products/order", saveItems);
router.get("/products/order",authorize, getItems);
router.delete("/products/orders/deleteOne",authorize,deleteOneItem)

router.get("/", (req,res) => {
    res.status(200).json({
        status: "server is running and ready to receive requests ..."
    })
})

router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/getLoggedIn', getLoggedInUser);
router.get('/logout',logout)
router.post('/changePassword',authorize,changePassword)


module.exports = router;