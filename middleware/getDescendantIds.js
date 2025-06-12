const getDescendantIds = (folder, allFolders) => {
  let ids = [];
  function recurse(currentId) {
    allFolders.forEach((f) => {
      if (f.parentId === currentId) {
        ids.push(f.id);
        recurse(f.id);
      }
    });
  }
  recurse(folder.id);
  return ids;
};

module.exports = getDescendantIds;
