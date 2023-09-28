// passport-config.ts

import passport from "passport";
import { User } from "./entities/User";
import { dataSource } from "./datasource";
import { Image } from "./entities/Image";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import * as jwt from "jsonwebtoken"
require('dotenv').config()

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
};

passport.use(new GoogleStrategy(googleConfig,  async function(accessToken, refreshToken, profile, cb) {    
    return cb(null, profile); 
}));

export default passport;
