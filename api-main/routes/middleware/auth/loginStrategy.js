const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../../../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../../../config/config');

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const user = await UserModel.findOne({ email }).select('+password');

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy({
            secretOrKey: config.jwt_key,
            jwtFromRequest: ExtractJWT.fromExtractors([
                ExtractJWT.fromAuthHeaderAsBearerToken(),
                ExtractJWT.fromUrlQueryParameter('jwt_token')
            ]),
        },
        async(token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);