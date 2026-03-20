import { prisma } from "../db";
import createHttpError from "http-errors";

export const createCommentService = async (data: {
  content: string;
  blogId: string;
  authorId: string;
}) => {
  const newComment = await prisma.comment.create({
    data,
  });
  return newComment;
};

export const getCommentsService = async (blogId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      blogId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return comments;
};

export const deleteCommentService = async ({
  commentId,
  authorId,
}: {
  commentId: string;
  authorId: string;
}) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) {
    throw createHttpError.NotFound("Resource not found");
  }
  if (comment.authorId !== authorId) {
    throw createHttpError.Unauthorized(
      "You are not authorized to delete this comment",
    );
  }
  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId,
      authorId,
    },
  });
  return deletedComment;
};
