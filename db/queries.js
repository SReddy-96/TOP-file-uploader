const prisma = require("./prismaClient");

const getUserByUsername = async (username) => {
  const result = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });
  return result;
};

const getUserByEmail = async (email) => {
  const result = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return result;
};

const getUserById = async (id) => {
  const result = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

const insertUser = async (email, username, hashedPassword) => {
  const result = await prisma.users.create({
    data: {
      email: email,
      username: username,
      password: hashedPassword,
    },
  });
  return result;
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  insertUser,
};
