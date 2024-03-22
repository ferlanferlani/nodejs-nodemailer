import prisma from "../../services/prismaService.js";

export const userValidation = async (email) => {
  const userAlreadyExists = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (userAlreadyExists) {
    return {
      status: false,
      errorMessage: "User already exists",
    };
  }

  return {
    status: true,
  };
};
