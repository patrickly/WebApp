const verifyAdmin = (req, res, next) => {

  if (req.decoded.user.isAdmin) {
    next();
  } else {
    res.status(401).send('You are not an administrator');
  }
};

module.exports = verifyAdmin;
