const passport = require("passport");
require("../config/passport");
const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const token = req.get("Authorization")?.split(" ")[1];
    if (err || !user || token !== user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        data: "Unauthorized",
        message: "Not authorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
module.exports = guard;
