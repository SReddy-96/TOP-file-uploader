const passport = require("passport");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      const match = await bcrypt.compare(password, user.password); // using bcrypt.compare to check the password
      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    } catch (err) {
      console.error("Error during Passport LocalStrategy authentication:", err);
      return done(err);
    }
  })
);

// storing the user session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// checking the user session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
