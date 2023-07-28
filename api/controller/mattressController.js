
const Mattress = require("../model/mattress");
const cloudinary = require("../Utils/cloudinary");


const getAllMattress = async(req,res) => {
    const mattress = await Mattress.find({}).exec();
    res.status(200).json(mattress);
}


const addMattress = async (req,res) => {
    try {
        const mattress = await Mattress.create(req.body)
        res.status(201).json(mattress)
    } catch (error) {
        console.log(error);

        res.status(404).json({message: "Bad Request"})
    }
}

const updateMattress = async (req,res) => {
    try {
        const result = await Mattress.findOne({_id: req.params.id}).then(d => d).catch(e => new Error("can't find mattress"))
        
        // delete all images in the cloud
        // cloudinary
        let countDeletedImages = 0;
        async function deleteImagesInTheCloud() {
            result.images.forEach(async image => {
                console.log(image[2])
                await cloudinary.uploader.destroy(image[2]).then((d) => {
                    console.log(d)
                    countDeletedImages++
                }).catch(e => new Error('image not deleted in the cloud'));
            })
        }
        await deleteImagesInTheCloud();

        // then delete
        let newMattress = await Mattress.findOneAndUpdate({_id: req.params.id},{productInfo:req.body.productInfo, images:req.body.images},{new: true})
        console.log(countDeletedImages)
        res.status(200).json({message: 'mattress updated',newMattress})    
    } catch (error) {
        console.log(error);

        res.status(404).json({message: error.message})
    }
}

const deleteMattress = async (req,res) => {
    try {
        const result = await Mattress.findOne({_id: req.params.id}).then(d => d).catch(e => new Error("can't find product"))
        
        // delete all images in the cloud
        // cloudinary
        let countDeletedImages = 0;
        async function deleteImagesInTheCloud() {
            result.images.forEach(async image => {
                console.log(image[2])
                await cloudinary.uploader.destroy(image[2]).then((d) => {
                    console.log(d)
                    countDeletedImages++
                }).catch(e => new Error('image not deleted in the cloud'));
            })
        }
        await deleteImagesInTheCloud();

        // then delete
        await Mattress.findOneAndDelete({_id: req.params.id})
        console.log(countDeletedImages)
        res.status(200).json({message: 'mattress deleted'})    
    } catch (error) {
        console.log(error);

        res.status(404).json({message: error.message})
    }
}


const clearMattressTable = async (req,res) => {
    try {
        await Mattress.deleteMany({}).then(d => {
            res.status(204).json({message: 'mattress table cleared'})
        }).catch(e => new Error("can't clear table"))
        } catch (error) {
        console.log(error);

        res.status(404).json({message: "Bad Request"})
    }
}

module.exports = {
    getAllMattress,
    addMattress,
    clearMattressTable,
    updateMattress,
    deleteMattress
}