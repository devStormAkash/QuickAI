// Check the user is Authinticated or not and check user plan

import { clerkClient } from "@clerk/express";


export const auth = async (req,res,next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const hasPremiumPlan = await has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }
    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

}

// import { clerkClient } from "@clerk/express";

// export const auth = async (req, res, next) => {
//   try {
//     const { userId, has } = await req.auth();

//     // Check if user is authenticated
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const hasPremiumPlan = await has({ plan: "premium" });
//     const user = await clerkClient.users.getUser(userId);

//     if (!hasPremiumPlan && user.privateMetadata.free_usage) {
//       req.free_usage = user.privateMetadata.free_usage;
//     } else if (!hasPremiumPlan) {
//       // Initialize free_usage if it doesn't exist
//       await clerkClient.users.updateUserMetadata(userId, {
//         privateMetadata: {
//           free_usage: 0,
//         },
//       });
//       req.free_usage = 0;
//     }

//     req.plan = hasPremiumPlan ? "premium" : "free";
//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };