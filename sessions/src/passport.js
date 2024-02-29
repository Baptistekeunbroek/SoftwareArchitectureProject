const passport = require("passport");
const apiUsers = require("./utils/apiUsers");
const JwtStrategy = require("passport-jwt").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

function getToken(req) {
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!token) token = req.cookies?.jwt;
  return token;
}

module.exports = function (app) {
  const opts = {};
  opts.jwtFromRequest = getToken;
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    "user",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const user = await apiUsers.get(`/user?id=${jwtPayload.id}`);
        if (!user.ok) return done(null, false);
        return done(null, user.user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    })
  );

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

  passport.use(
    "admin",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const isAdmin = await apiUsers.get(`/admin?id=${jwtPayload.id}`);
        if (!isAdmin.ok) return done(null, false);
        return done(null, isAdmin.user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    })
  );

  app.use(passport.initialize());
};
