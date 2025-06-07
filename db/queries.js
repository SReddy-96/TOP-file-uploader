const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

const getUserByUsername = async (username) => {
  const result = await prisma.users.findUnique({
    WHERE: {
      username: username,
    },
  });
  return result;
};

module.exports = {
  getUserByUsername
};
