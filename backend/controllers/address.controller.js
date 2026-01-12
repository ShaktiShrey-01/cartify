import { asynchnadler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import User from "../models/user.js";

// Add a new address to user's address array
export const addAddress = asynchnadler(async (req, res) => {
    const { buildingname, colony, city, state, pincode } = req.body;
    if (![buildingname, colony, city, state, pincode].every(Boolean)) {
        throw new apierror(400, "All address fields are required");
    }
    const user = await User.findById(req.user._id);
    if (!user) throw new apierror(404, "User not found");
    const newAddress = { buildingname, colony, city, state, pincode };
    user.address.push(newAddress);
    await user.save();
    return res.status(201).json(new apiresponse(201, user.address, "Address added successfully"));
});

// Edit an address by index
export const editAddress = asynchnadler(async (req, res) => {
    const { index } = req.params;
    const { buildingname, colony, city, state, pincode } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) throw new apierror(404, "User not found");
    if (index < 0 || index >= user.address.length) throw new apierror(404, "Address not found");
    user.address[index] = { buildingname, colony, city, state, pincode };
    await user.save();
    return res.status(200).json(new apiresponse(200, user.address, "Address updated successfully"));
});

// Delete an address by index
export const deleteAddress = asynchnadler(async (req, res) => {
    const { index } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) throw new apierror(404, "User not found");
    if (index < 0 || index >= user.address.length) throw new apierror(404, "Address not found");
    user.address.splice(index, 1);
    await user.save();
    return res.status(200).json(new apiresponse(200, user.address, "Address deleted successfully"));
});

// Get all addresses for current user
export const getAddresses = asynchnadler(async (req, res) => {
    const user = await User.findById(req.user._id).select("address").lean();
    if (!user) throw new apierror(404, "User not found");
    return res.status(200).json(new apiresponse(200, user.address, "Addresses fetched successfully"));
});
