// const commentModel = require("../models/comment.model");
// const foodModel = require("../models/food.model");

// // Add comment
// async function addComment(req, res) {
//     try {
//         const { foodId, text } = req.body;
//         const user = req.user;

//         if (!foodId || !text || !text.trim()) {
//             return res.status(400).json({
//                 message: "Food ID and comment are required"
//             });
//         }

//         const food = await foodModel.findById(foodId);

//         if (!food) {
//             return res.status(404).json({
//                 message: "Food not found"
//             });
//         }

//         const comment = await commentModel.create({
//             user: user._id,
//             food: foodId,
//             text: text.trim()
//         });

//         await foodModel.findByIdAndUpdate(foodId, {
//             $inc: { commentCount: 1 }
//         });

//         const populatedComment = await commentModel
//             .findById(comment._id)
//             .populate("user", "fullName");

//         return res.status(201).json({
//             message: "Comment added successfully",
//             comment: populatedComment
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Failed to add comment",
//             error: error.message
//         });
//     }
// }

// // Get comments
// async function getComments(req, res) {
//     try {
//         const { foodId } = req.params;

//         const comments = await commentModel
//             .find({ food: foodId })
//             .populate("user", "fullName")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "Comments fetched successfully",
//             comments
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Failed to fetch comments",
//             error: error.message
//         });
//     }
// }

// module.exports = {
//     addComment,
//     getComments
// };





// const mongoose = require("mongoose");
// const commentModel = require("../models/comment.model");
// const foodModel = require("../models/food.model");

// // Add comment
// async function addComment(req, res) {
//   try {
//     const { foodId, text } = req.body;
//     const user = req.user;

//     if (!foodId || !mongoose.isValidObjectId(foodId)) {
//       return res.status(400).json({
//         message: "Valid food ID is required"
//       });
//     }

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         message: "Comment cannot be empty"
//       });
//     }

//     const food = await foodModel.findById(foodId);

//     if (!food) {
//       return res.status(404).json({
//         message: "Food not found"
//       });
//     }

//     const comment = await commentModel.create({
//       user: user._id,
//       food: foodId,
//       text: text.trim()
//     });

//     await foodModel.findByIdAndUpdate(foodId, {
//       $inc: { commentCount: 1 }
//     });

//     const populatedComment = await commentModel
//       .findById(comment._id)
//       .populate("user", "fullName");

//     return res.status(201).json({
//       message: "Comment added successfully",
//       comment: populatedComment
//     });

//   } catch (error) {
//     console.error("Add comment error:", error);
//     return res.status(500).json({
//       message: "Failed to add comment"
//     });
//   }
// }

// // Get comments for a particular food video
// async function getComments(req, res) {
//   try {
//     const { foodId } = req.params;

//     if (!mongoose.isValidObjectId(foodId)) {
//       return res.status(400).json({
//         message: "Invalid food ID"
//       });
//     }

//     const comments = await commentModel
//       .find({ food: foodId })
//       .populate("user", "fullName")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       message: "Comments fetched successfully",
//       comments
//     });

//   } catch (error) {
//     console.error("Get comments error:", error);
//     return res.status(500).json({
//       message: "Failed to fetch comments"
//     });
//   }
// }

// // Delete own comment
// async function deleteComment(req, res) {
//   try {
//     const { commentId } = req.params;
//     const userId = req.user._id;

//     if (!mongoose.isValidObjectId(commentId)) {
//       return res.status(400).json({
//         message: "Invalid comment ID"
//       });
//     }

//     // Find only the comment owned by logged-in user
//     const comment = await commentModel.findOne({
//       _id: commentId,
//       user: userId
//     });

//     if (!comment) {
//       return res.status(404).json({
//         message: "Comment not found or you cannot delete this comment"
//       });
//     }

//     await commentModel.deleteOne({
//       _id: commentId,
//       user: userId
//     });

//     await foodModel.findByIdAndUpdate(comment.food, {
//       $inc: { commentCount: -1 }
//     });

//     // Prevent negative comment count
//     await foodModel.updateOne(
//       { _id: comment.food, commentCount: { $lt: 0 } },
//       { $set: { commentCount: 0 } }
//     );

//     return res.status(200).json({
//       message: "Comment deleted successfully",
//       commentId
//     });

//   } catch (error) {
//     console.error("Delete comment error:", error);
//     return res.status(500).json({
//       message: "Failed to delete comment"
//     });
//   }
// }

// module.exports = {
//   addComment,
//   getComments,
//   deleteComment
// };



const mongoose = require("mongoose");
const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");

// Add comment
async function addComment(req, res) {
  try {
    const { foodId, text } = req.body;
    const user = req.user;

    if (!foodId || !mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({
        message: "Valid food ID is required"
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    const comment = await commentModel.create({
      user: user._id,
      food: foodId,
      text: text.trim()
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { commentCount: 1 }
    });

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate("user", "fullName")
      .lean();

    return res.status(201).json({
      message: "Comment added successfully",
      comment: {
        ...populatedComment,
        isOwner: true
      }
    });

  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      message: "Failed to add comment"
    });
  }
}

// Get comments
async function getComments(req, res) {
  try {
    const { foodId } = req.params;
    const userId = String(req.user._id);

    if (!mongoose.isValidObjectId(foodId)) {
      return res.status(400).json({
        message: "Invalid food ID"
      });
    }

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    const updatedComments = comments.map((comment) => ({
      ...comment,
      isOwner: String(comment.user?._id) === userId
    }));

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments: updatedComments
    });

  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      message: "Failed to fetch comments"
    });
  }
}

// Delete own comment
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID"
      });
    }

    const comment = await commentModel.findOneAndDelete({
      _id: commentId,
      user: userId
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you cannot delete this comment"
      });
    }

    await foodModel.findByIdAndUpdate(comment.food, {
      $inc: { commentCount: -1 }
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      message: "Failed to delete comment"
    });
  }
}

module.exports = {
  addComment,
  getComments,
  deleteComment
};
