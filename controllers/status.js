import { Status } from "../models/status.models.js";
import { User } from "../models/user.models.js";

export const ShareStatus = async (req, res) => {
    try {
        const { image, caption } = req.body;
        console.log("Received image URL:", image); // Log the image URL

        if (!req.user || !req.user.email) {
            return res.status(401).send("Unauthorized: User information missing.");
        }

        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const newStatus = new Status({
            image,
            caption,
            user: user._id
        });

        await newStatus.save();

        user.status.push(newStatus._id);
        await user.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error creating status:", error);
        res.status(500).send("Internal Server Error");
    }
};
