import { Post } from "../models/posts.models.js";
import { User } from "../models/user.models.js";

export const openprofile = async (req, res) => {
    try {
        const id = req.params.id; // Get the user ID from the request parameters

        // Fetch the current user and populate friends
        const currentUser = await User.findById(req.user.userid).populate('friends');
        if (!currentUser) {
            return res.redirect("/login"); // Redirect to login if current user is not found
        }

        // Fetch the profile user and populate friends
        const user = await User.findById(id).populate('friends');
        if (!user) {
            return res.redirect("/login"); // Redirect to login if profile user is not found
        }

        // Fetch the current user's friends based on populated friends field
        const currentUserFriends = await User.find({ _id: { $in: currentUser.friends } });

        // Fetch the profile user's friends based on populated friends field
        const profileUserFriends = await User.find({ _id: { $in: user.friends } });

        // Determine mutual friends
        const mutualFriends = currentUserFriends.filter(friend =>
            profileUserFriends.some(profileFriend => profileFriend._id.equals(friend._id))
        );

        // Fetch posts made by the profile user
        const userPosts = await Post.find({ user: id });

        // Map over user posts to get the image URLs
        const imageUrls = userPosts.map(post => post.image);

        // Render the view with fetched data including mutual friends
        res.render("openprofile", {
            user,
            imageUrls,
            friends: profileUserFriends,
            currentUser,
            currentUserFriends,
            mutualFriends  // Pass mutual friends to the view
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).send("Internal Server Error");
    }
};
