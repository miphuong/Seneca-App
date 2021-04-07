const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
        clientID: '170638808187-q6ahelnalm63r8cfbms7spoe1qp3auog.apps.googleusercontent.com',
        clientSecret: 'z1DpgsWu6ie50ITpRtE4wJL7',
        callbackURL: 'http://localhost:8080/auth/google/callback'
    },
    (token, refereshToken, profile, done) => {
        return done(null, {
            profile: profile,
            token: token
        });
    }));
};