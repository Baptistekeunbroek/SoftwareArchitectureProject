const passport = require("passport");
const CustomStrategy = require("passport-custom").Strategy;

module.exports = function (app) {
  passport.use(
    "session",
    new CustomStrategy(function (req, done) {
      const apiKey = req.headers["x-api-key"];
      if (!apiKey || apiKey !== process.env.API_KEY) {
        return done(null, false);
      }
      done(null, true);
    })
  );

  app.use(passport.initialize());
};
