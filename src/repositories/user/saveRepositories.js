import prisma from "../../services/prismaService.js";

export const save = async (name, email, password) => {
  return await prisma.users.create({
    data: {
      name: name,
      email: email,
      password: password,
      refreshToken: null,
    },
  });
};
