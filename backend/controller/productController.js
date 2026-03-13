import Product from '../models/productModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
import {v2 as cloudinary} from 'cloudinary';    

// http://localhost:8000/api/v1/product/6974e763c69f2fdfd108120e?keyword=phone
// Creating Products
export const createProducts=handleAsyncError(async (req, res, next)=>{
    let image=[];
    if(typeof req.body.image === "string"){
        image.push(req.body.image);
    }else{
        image = req.body.image;
    }   
    const imageLinks = [];
    for(let i=0; i<image.length; i++){
        const result = await cloudinary.uploader.upload(image[i],{
            folder: "products"  
        });
        imageLinks.push({
            public_id: result.public_id,    
            url: result.secure_url
        })
    } 
    req.body.images = imageLinks;     
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })

})

// Get all products
export const getAllProducts=handleAsyncError(async(req, res, next)=>{
    const resultsPerPage = 4;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
    
    // Getting filered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    // Calculate Totalpages based on filtered count
    const totalPages = Math.ceil(productCount / resultsPerPage);
    const page = Number(req.query.page) || 1;
    if(page > totalPages && productCount > 0){
        return next(new HandleError("This Page doesn't found", 404));
    
    }

    // Apply pagination
    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query;
    
    if(!products ||products.length === 0){
        return next(new HandleError("No Product Found", 404));
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentPage: page
        
    })
});
    

// // Update products
// export const updateProduct=handleAsyncError(async(req, res, next)=>{
//     let product = await Product.findById(req.params.id);
//     if(!product){
//         return next(new HandleError("Product not found", 404));
//     }
//     let images=[];
//     if(typeof req.body.image === "string"){
//         images.push(req.body.image);
//     }else if(Array.isArray(req.body.image)){
//         images = req.body.image;    
//     } 
    
//     if(images.length > 0){
//         // Deleting existing images from cloudinary
//         for(let i=0; i<product.images.length; i++){ 
//             await cloudinary.uploader.destroy(product.images[i].public_id);
//         }   
//         // Uploading new images
//         const imageLinks = [];  
//         for(let i=0; i<images.length; i++){ 
//             const result = await cloudinary.uploader.upload(images[i],{
//                 folder: "products"
//             }); 
//             imageLinks.push({
//                 public_id: result.public_id,
//                 url: result.secure_url
//             })
//         }       
//         req.body.images = imageLinks;
//     }       

          
//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,

//     })


//     res.status(200).json({
//         success: true,
//         product
//     })  
    
// })
// Update products
export const updateProduct = handleAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }

    let images = [];

    // 🔥 THIS IS THE FIX
    if (req.files && req.files.image) {

        if (!Array.isArray(req.files.image)) {
            images.push(req.files.image);
        } else {
            images = req.files.image;
        }

        // Delete old images
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id);
        }

        const imageLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(
                images[i].tempFilePath,   // ✅ Important
                {
                    folder: "products"
                }
            );

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        req.body.images = imageLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        product
    });

});



// DELETE Product

export const deleteProduct=handleAsyncError(async(req, res, next)=>{  
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
       return next(new HandleError("Product not found", 404));
    }
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})  

// Accessing single product 
export const getSingleProduct=handleAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){           
        return next(new HandleError("Product not found", 404));
    }   
    res.status(200).json({
        success: true,
        product
    })  
})

// Creating and  Updating reviews
export const createReviewForProduct=handleAsyncError(async(req, res, next)=>{  
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment
    };  
    const product = await Product.findById(productId);
    if(!product){
        return next(new HandleError("Product not found",400))
    }
    const reviewExists = product.reviews.find(review=> review.user.toString() === req.user._id.toString());

    if(reviewExists){
        product.reviews.forEach(review=>{  
            if(review.user.toString() === req.user._id.toString()){
                review.rating = rating,
                review.comment = comment
            }   
        });
    }else{
        product.reviews.push(review);
        
    }
    product.numOfReviews = product.reviews.length;       
    // Calculating average ratings
    let avg = 0;        
    product.reviews.forEach(review=>{
        avg += review.rating;
    });
    product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0;
    await product.save({validateBeforeSave: false});    
    res.status(200).json({
        success: true,
        product
    })  
}); 

//Getting Reviews
export const getProductReviews=handleAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new HandleError("Product not found", 400));
    } 
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })  
}); 

// Deleting Reviews
export const deleteReview=handleAsyncError(async(req, res, next)=>{
    
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new HandleError("Product not found", 400));
    }       
    const reviews = product.reviews.filter(review=> review._id.toString() !== req.query.id.toString()); 
    // Calculating average ratings
    let avg = 0;    
    reviews.forEach(review=>{
        avg += review.rating;
    }); 
    const ratings = reviews.length > 0 ? avg / reviews.length : 0;
    const numOfReviews = reviews.length;   

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,        
        numOfReviews
    },{
        new:true,
        runValidators:true, 
    });
    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
        
    })  
}); 


// Admin - Getting all products 
export const getAdminProducts=handleAsyncError(async(req, res, next)=>{
    const products = await Product.find();
    res.status(200).json({  
        success: true,
        products
    })  
})
