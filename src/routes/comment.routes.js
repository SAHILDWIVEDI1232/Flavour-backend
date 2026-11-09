// const express = require("express");
// const router = express.Router();

// const commentController = require("../controllers/comment.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// // Add comment
// router.post(
//     "/",
//     authMiddleware.authUserMiddleware,
//     commentController.addComment
// );

// // Get comments
// router.get(
//     "/:foodId",
//     authMiddleware.authUserMiddleware,
//     commentController.getComments
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add comment
router.post(
  "/",
  authMiddleware.authUserMiddleware,
  commentController.addComment
);

// Get comments
router.get(
  "/:foodId",
  authMiddleware.authUserMiddleware,
  commentController.getComments
);

// Delete own comment
router.delete(
  "/:commentId",
  authMiddleware.authUserMiddleware,
  commentController.deleteComment
);

module.exports = router;
