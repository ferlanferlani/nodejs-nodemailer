import prisma from "../../services/prismaService.js";

export const verifyEmail = async (req, res) => {
  const tokenfromUrl = req.query.token;

  try {
    const verificationToken = await prisma.verificationTokens.findFirst({
      where: {
        token: tokenfromUrl,
      },
    });

    if (!verificationToken) {
      return res.status(400).send({
        error: "Invalid Token",
      });
    }

    const expiredToken = await prisma.verificationTokens.findFirst({
      where: {
        expired: {
          lte: new Date(),
        },
      },
    });

    if (expiredToken) {
      await prisma.verificationTokens.delete({
        where: {
          id: expiredToken.id,
        },
      });
      return res.status(400).send({
        error: "Token Expired",
      });
    }

    const user = await prisma.users.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    const userEmailVerified = await prisma.users.findFirst({
      where: {
        email: user.email,
      },
    });

    const userId = user.id;

    const verificationTokenId = await prisma.verificationTokens.findFirst({
      where: {
        userId: userId,
      },
    });

    if (userEmailVerified && verificationTokenId) {
      await prisma.verificationTokens.delete({
        where: {
          id: verificationTokenId.id,
        },
      });
    }

    res.status(200).send("Email Verified");
    // clear cookie
    res.clearCookie("user");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};