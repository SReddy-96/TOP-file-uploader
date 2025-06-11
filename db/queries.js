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

const getAllFoldersByUser = async (userId) => {
  const result = await prisma.folders.findMany({
    where: {
      userId: userId,
    },
  });
  return result;
};

const addFile = async (file, folderId, userId) => {
  const result = await prisma.files.create({
    data: {
      name: file.originalname,
      url: file.destination + file.filename, // This will be the Supabase url. middleware to upload?
      userId: userId,
      folderId: folderId ? folderId : null,
    },
  });
  return result;
};

const addFolder = async (name, folderId, userId) => {
  const result = await prisma.folders.create({
    data: {
      name: name,
      parentId: folderId ? folderId : null,
      userId: userId,
    },
  });
  return result;
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  insertUser,
  getAllFoldersByUser,
  addFile,
  addFolder
};
