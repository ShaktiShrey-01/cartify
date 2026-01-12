import {asynchnadler} from "../utils/asynchandler.js";
import {apierror} from "../utils/apierror.js";
import {apiresponse} from "../utils/apiresponse.js";
import Product from "../models/product.js";
import Review from "../models/review.js";

// NEW: Normalize DB docs into the shape the current frontend expects.
const toFrontendProduct = (doc) => {
    const raw = doc?.toObject ? doc.toObject({ virtuals: false }) : (doc || {})
    const categoryKey =
        (raw?.categoryKey && String(raw.categoryKey).trim())
            ? String(raw.categoryKey).trim()
            : (raw?.category?.name ? String(raw.category.name).trim() : "")

    return {
        id: String(raw?._id ?? raw?.id ?? ""),
        name: raw?.name,
        description: raw?.description,
        price: raw?.price,
        image: raw?.image,
        rating: raw?.rating,
        type: raw?.type,
        featured: Boolean(raw?.featured),
        // NEW: keep both `category` and `categoryKey` for compatibility.
        category: categoryKey,
        categoryKey,
    }
}


const addproduct=asynchnadler(async(req,res)=>{
    // NEW: accept categoryKey/type/featured/rating as well (frontend-friendly fields).
    const {name,description,price,category,categoryKey,type,featured,rating,reviews,image}=req.body;
    const missingRequired =
        !name || String(name).trim() === "" ||
        !description || String(description).trim() === "" ||
        price === undefined || price === null || String(price).trim() === "" ||
        // NEW: allow either `category` (Category _id) OR `categoryKey` (string)
        (!category || String(category).trim() === "") && (!categoryKey || String(categoryKey).trim() === "");

    if (missingRequired) {
        throw new apierror(400,"All feilds are required");
    }
    const existedproduct=await Product.findOne({name});

if(existedproduct){
   throw new apierror(409,"Product with given name already exists");
}
const product=await Product.create({
     name,
     description,
     price,
     category,
     categoryKey,
     type,
     featured,
     rating,
     reviews,
     image,
});
const createdproduct=await Product.findById(product._id).lean();
if(!createdproduct){
   throw new apierror(500,"Unable to create product");
}
return res.status(201).json(new apiresponse(201,toFrontendProduct(createdproduct),"Product registered successfully"));
});
 
const getallproducts=asynchnadler(async(req,res)=>{
    // NEW: support query filtering: ?categoryKey=electronics&featured=true
    const { categoryKey, featured } = req.query;

    try {
        // Pagination: ?page=1&limit=20
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        let query = {};
        if (categoryKey) {
            query.categoryKey = String(categoryKey).trim();
        }
        if (featured !== undefined) {
            query.featured = String(featured).toLowerCase() === "true" || String(featured) === "1";
        }
        const products = await Product.find(query)
            .populate({ path: "category", select: "name" })
            .populate({ path: "reviews", select: "rating title comment createdby createdon" })
            .skip(skip)
            .limit(limit)
            .lean();
        let normalized = products.map(toFrontendProduct);
        return res.status(200).json(new apiresponse(200, normalized, "Products fetched successfully"));
    } catch (err) {
        console.error("getallproducts error:", err);
        throw err;
    }
});

const getproductbyid=asynchnadler(async(req,res)=>{
   const {id}=req.params;
   const product=await Product.findById(id)
       .populate({ path: "category", select: "name" })
       .populate({ path: "reviews", select: "rating title comment createdby createdon" })
       .lean();
    if(!product){
        throw new apierror(404,"Product not found");
    }
    return res.status(200).json(new apiresponse(200,toFrontendProduct(product),"Product fetched successfully"));
}   );
const deleteproduct=asynchnadler(async(req,res)=>{  
    const {id}=req.params;
    const product=await Product.findByIdAndDelete(id);
    if(!product){
        throw new apierror(404,"Product not found");
    }
    return res.status(200).json(new apiresponse(200,toFrontendProduct(product),"Product deleted successfully"));
});
 
const updateproduct=asynchnadler(async(req,res)=>{  
    const {id}=req.params;
    // Do not allow updating rating via edit product route.
    const {name,description,price,category,categoryKey,type,featured,reviews,image}=req.body;
    const updateFields = {name,description,price,category,categoryKey,type,featured,reviews,image};
    // Remove undefined fields (in case some are not sent)
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
    const product=await Product.findByIdAndUpdate(id,
        updateFields,
        {new:true,runValidators:true}); 
    if(!product){
        throw new apierror(404,"Product not found");
    }
    return res.status(200).json(new apiresponse(200,toFrontendProduct(product),"Product updated successfully"));
});

export { addproduct, getallproducts, getproductbyid, deleteproduct, updateproduct };
