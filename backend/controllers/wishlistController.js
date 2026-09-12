import userModel from "../models/userModel.js";

// toggle a product in the user's wishlist
const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const userData = await userModel.findById(userId);
        let wishlist = userData.wishlist || [];

        const isWishlisted = wishlist.includes(productId);

        if (isWishlisted) {
            wishlist = wishlist.filter((id) => id !== productId);
            await userModel.findByIdAndUpdate(userId, { wishlist });
            res.json({ success: true, isWishlisted: false, wishlist, message: "Removed from wishlist" });
        } else {
            wishlist.push(productId);
            await userModel.findByIdAndUpdate(userId, { wishlist });
            res.json({ success: true, isWishlisted: true, wishlist, message: "Added to wishlist" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// get user wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);

        res.json({ success: true, wishlist: userData.wishlist || [] });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { toggleWishlist, getUserWishlist };