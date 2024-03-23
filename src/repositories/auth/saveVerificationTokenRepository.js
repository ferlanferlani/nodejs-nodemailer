import prisma from "../../services/prismaService.js";
import jwt from "jsonwebtoken";

export const saveVerificationTokenRepository = async (
  userId,
  name,
  email,
  token,
  verificationTokenType,
  res
) => {
  // token is expired on 45 minutes
  const currentDate = new Date();
  const expirationTime = new Date(currentDate.getTime() + 45 * 60000);
  try {
    const tokenSaved = await prisma.verificationTokens.create({
      data: {
        name: name,
        email: email,
        token: token,
        verificationTokenType: verificationTokenType,
        expired: expirationTime,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const userToken = jwt.sign(
      {
        userId,
        name,
        email,
      },
      process.env.USER_SIGNUP_TOKEN
    );

    res.cookie("user", userToken, { httpOnly: true });

    console.log({
      sucsess: true,
      message: "verification token saved",
      data: tokenSaved,
    });
  } catch (error) {
    console.log(error);
  }
};
