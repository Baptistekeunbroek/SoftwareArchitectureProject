const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Importez ici votre modèle d'utilisateur (par exemple, User) et votre logique d'accès à la base de données

// Configurez la stratégie locale de Passport
passport.use(new LocalStrategy({
  usernameField: 'email', // Remplacez par le champ utilisé pour l'authentification (par exemple, 'username')
  passwordField: 'password' // Remplacez par le champ utilisé pour le mot de passe (par exemple, 'password')
}, async (email, password, done) => {
  try {
    // Recherchez l'utilisateur dans la base de données en utilisant l'email fourni
    const user = await User.findOne({ email });

    // Si l'utilisateur n'est pas trouvé ou le mot de passe ne correspond pas, renvoyez une erreur
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Identifiants invalides' });
    }

    // Si l'utilisateur est trouvé et le mot de passe correspond, renvoyez l'utilisateur
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Sérialisez l'utilisateur pour le stocker dans la session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisez l'utilisateur à partir de la session
passport.deserializeUser(async (id, done) => {
  try {
    // Recherchez l'utilisateur dans la base de données en utilisant l'ID fourni
    const user = await User.findById(id);

    // Si l'utilisateur n'est pas trouvé, renvoyez une erreur
    if (!user) {
      return done(null, false);
    }

    // Si l'utilisateur est trouvé, renvoyez l'utilisateur
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;