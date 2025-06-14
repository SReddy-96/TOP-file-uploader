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

const updateUser = async (id, username, email) => {
  const result = await prisma.users.update({
    where: { id: id },
    data: {
      username: username,
      email: email,
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

const getAllFilesByUser = async (userId) => {
  const results = await prisma.files.findMany({
    where: {
      userId: userId,
    },
  });
  return results;
};

const addFile = async (file, fileURL, folderId, userId, path) => {
  const result = await prisma.files.create({
    data: {
      name: file.originalname,
      url: fileURL,
      userId: userId,
      folderId: folderId ? folderId : null,
      path: path,
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

const getFileById = async (id, userId) => {
  const result = await prisma.files.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      folder: true,
    },
  });
  return result;
};

const getFolderById = async (id, userId) => {
  const result = await prisma.folders.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      children: true,
      files: true,
      parent: true,
    },
  });
  return result;
};

const updateFile = async (id, name, folderId, userId) => {
  const result = await prisma.files.update({
    where: {
      id: id,
      userId: userId,
    },
    data: {
      name: name,
      folderId: folderId || null,
    },
  });
  return result;
};

const updateFolder = async (id, name, parentFolderId, userId) => {
  const result = await prisma.folders.update({
    where: { id, userId },
    data: {
      name: name,
      parentId: parentFolderId,
    },
  });
  return result;
};

const deleteFile = async (id, userId) => {
  const result = await prisma.files.delete({
    where: { id, userId },
  });
  return result;
};

const deleteFolder = async (id, userId) => {
  const result = await prisma.folders.delete({
    where: { id, userId },
  });
  return result;
};

// recursive go over the folders to add the id of them all to an array
const getAllDescendantFolderIds = async (folderId) => {
  const children = await prisma.folders.findMany({
    where: { parentId: folderId },
  });
  let ids = children.map((child) => child.id);
  for (const child of children) {
    ids = ids.concat(await getAllDescendantFolderIds(child.id));
  }
  return ids;
};

const getAllFilePathsInFolderTree = async (rootFolderId) => {
  // get all folders
  const descendantFolderIds = await getAllDescendantFolderIds(rootFolderId);
  const allFolderIds = [rootFolderId, ...descendantFolderIds];

  // find all files with the folderId from the above array
  const files = await prisma.files.findMany({
    where: { folderId: { in: allFolderIds } },
    select: { path: true },
  });

  // return the paths of all files for deleting
  return files.map((file) => file.path);
};

const getAllFilePathsInUser = async (id) => {
  const files = await prisma.files.findMany({
    where: { userId: id },
    select: { path: true },
  });

  // return the paths of all files for deleting
  return files.map((file) => file.path);
};

const deleteUser = async (id) => {
  const files = await getAllFilePathsInUser(id);
  const result = await prisma.users.delete({
    where: { id: id },
  });

  return files;
};

module.exports = {
  getUserByUsername,
  getUserByEmail,
  getUserById,
  insertUser,
  updateUser,
  getAllFoldersByUser,
  getAllFilesByUser,
  addFile,
  addFolder,
  getFileById,
  getFolderById,
  updateFile,
  updateFolder,
  deleteFile,
  deleteFolder,
  getAllDescendantFolderIds,
  getAllFilePathsInFolderTree,
  deleteUser,
};
