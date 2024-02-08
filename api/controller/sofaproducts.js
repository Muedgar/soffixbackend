const Product = require("../model/product");
const cloudinary = require("../Utils/cloudinary");
const fs = require("fs");

const getAllProducts = async(req,res) => {
    
    try {
        const products = await Product.find({}).exec();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);

        res.status(404).json({message: "Unable to retrieve products, Please contact support"})
    }
}


const addProduct = async (req,res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        console.log(error);

        res.status(404).json({message: "Bad Request"})
    }
}

const updateProduct = async (req,res) => {
    try {
        const result = await Product.findOne({_id: req.params.id}).then(d => d).catch(e => console.log("can't find product"))
        
        // delete all images in the cloud
        // cloudinary
        let countDeletedImages = 0;
        async function deleteImagesInTheCloud() {
            result.images.forEach(async image => {
                console.log(image[2])
                await cloudinary.uploader.destroy(image[2]).then((d) => {
                    console.log(d)
                    countDeletedImages++
                }).catch(e => {
                    console.log(e)
                });
            })
        }
        await deleteImagesInTheCloud();

        // then delete
        let newProduct = await Product.findOneAndUpdate({_id: req.params.id},{productInfo:req.body.productInfo, images:req.body.images},{new: true})
        console.log(countDeletedImages)
        res.status(200).json({message: 'product updated',newProduct})    
    } catch (error) {
        console.log(error);

        res.status(404).json({message: error.message})
    }
}

const deleteProduct = async (req,res) => {
    try {
        const result = await Product.findOne({_id: req.params.id}).then(d => d).catch(e => console.log("can't find product"))
        
        // delete all images in the cloud
        // cloudinary
        let countDeletedImages = 0;
        async function deleteImagesInTheCloud() {
            result.images.forEach(async image => {
                console.log(image[2])
                await cloudinary.uploader.destroy(image[2]).then((d) => {
                    console.log(d)
                    countDeletedImages++
                }).catch(e => {
                    console.log(e)
                });
            })
        }
        await deleteImagesInTheCloud();

        // then delete
        await Product.findOneAndDelete({_id: req.params.id})
        console.log(countDeletedImages)
        res.status(200).json({message: 'product deleted'})    
    } catch (error) {
        console.log(error);

        res.status(404).json({message: error.message})
    }
}


const clearProductsTable = async (req,res) => {
    try {
        await Product.deleteMany({}).then(d => {
            res.status(204).json({message: 'products table cleared'})
        }).catch(e => console.log("can't clear table"))
        } catch (error) {
        console.log(error);

        res.status(404).json({message: "Bad Request"})
    }
}

module.exports = {
    getAllProducts,
    addProduct,
    clearProductsTable,
    updateProduct,
    deleteProduct
}