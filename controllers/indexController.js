const getIndex = (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  res.render("index", { title: "Home" });
};

module.exports = {
  getIndex,
};
