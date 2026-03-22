import { prisma } from "../db";
import createHttpError from "http-errors";

// create a comment service
export const createCommentService = async (data: {
  content: string;
  blogId: string;
  authorId: string;
}) => {
  const newComment = await prisma.comment.create({ data });
  return newComment;
};

// get all comments by blog id
export const getCommentsService = async (blogId: string) => {
  const comments = await prisma.comment.findMany({
    where: { blogId },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return comments;
};

// delete a comment by  id
export const deleteCommentService = async ({
  commentId,
  authorId,
}: {
  commentId: string;
  authorId: string;
}) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  // check if comment exists
  if (!comment) {
    throw createHttpError.NotFound("Resource not found");
  }

  // check if user is authorized to delete comment
  if (comment.authorId !== authorId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to delete this comment",
    );
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: commentId, authorId },
  });

  return deletedComment;
};
