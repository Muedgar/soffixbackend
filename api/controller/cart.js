const Order = require("../model/order");

const saveItems = async (req, res) => {
    await Order.create(req.body)
        .then(d => {
            res.status(201).json({message: 'order saved'})
        }).catch(e => res.status(400).json({message: 'Bad Request'}))
}

const clearItems = async (req, res) => {
    await Order.deleteMany({})
        .then(d => {
            res.status(201).json({message: 'order cleared'})
        }).catch(e => res.status(400).json({message: 'Bad Request'}))
}

const getItems = async (req, res) => {
   try {
    await Order.find({})
    .then(d => {
        console.log("trying to get orders...",d);
        /*
        <th style={{paddingLeft: '35px'}} name="product">Product Name</th>
            <th name="price">Price</th>
            <th name="quantity">Quantity</th>
            <th name="customer">Customer Name</th>
            <th name="phone">Customer Phone</th>
        */
       let results = [];
       d.forEach(da => {
        if(!da.orderInfo[0]) {
            return
        }
        da.orderInfo[0].forEach(daData => {
            let result = [];
            
            result.push(daData.item_img)
            result.push(daData.item_name)
            result.push(daData.item_price)
            result.push(daData.item_quantity)
            result.push(da.orderInfo[1].user)
            result.push(da.orderInfo[1].phone)
            let dateArray = da.createdAt.toString().split(" ")
            result.push(dateArray[0]+" "+dateArray[1]+" "+dateArray[2]+" "+dateArray[3])
            result.push(da._id)
            results.push(result)
        })
        console.log("got results, ",results);
        
       })
        res.status(201).json(results)
    })
   } catch (error) {
    res.status(400).json({message: 'Bad Request, can not get data', error: error})
   }
}



const deleteOneItem = async (req, res) => {
    let data = req.body;
    try {
        await data.forEach(async d => {
            await Order.findOneAndDelete({_id: d.id})
        })
        res.status(201).json({message: "success"})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}



module.exports = {
    saveItems,
    getItems,
    clearItems,
    deleteOneItem
}