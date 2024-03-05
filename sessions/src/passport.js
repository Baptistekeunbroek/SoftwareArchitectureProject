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
    "customer",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const user = await apiUsers.get(`/customer?id=${jwtPayload.id}`);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    })
  );

  passport.use(
    "user",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const user = await apiUsers.get(`/user?id=${jwtPayload.id}`);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    })
  );
  
  passport.use(
    "agent",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const Agent = await apiUsers.get(`/agent?id=${jwtPayload.id}`);
        if (!Agent) return done(null, false);
        return done(null, Agent);
      } catch (error) {
        console.log(error);
      }
      return done(null, false);
    })
  );

  app.use(passport.initialize());
};
