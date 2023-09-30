// passport-config.ts

import passport from "passport";
import { User } from "./entities/User";
import { dataSource } from "./datasource";
import { Image } from "./entities/Image";
import * as jwt from "jsonwebtoken"
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config()

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
};

const facebookConfig = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/api/auth/facebook/callback",

};



passport.use(new GoogleStrategy(googleConfig,  async function(accessToken, refreshToken, profile, cb) {    
    return cb(null, profile); 
}));


passport.use(new FacebookStrategy(facebookConfig,
  async function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  })
)

export default passport;
