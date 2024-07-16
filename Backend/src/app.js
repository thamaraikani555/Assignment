import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import appRouter from './routes/mainRoutes.js'; // Ensure the path and extension are correct
import UserSchema from './models/users.js'; // Ensure the path and extension are correct
import dotenv from 'dotenv';
import moment from 'moment';
import http from 'http';

// Load environment variables
dotenv.config();

// Token part
const mongooseOptions = {
    connectTimeoutMS: 30000,
};

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    let user = await UserSchema.findById(jwt_payload._id);
    const now = moment().unix();
    if (now > jwt_payload.exp) {
        next(null, false);
    } else if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

const app = express();
var server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

passport.use(strategy);
app.use(passport.initialize());

app.use('/client-api/v1', appRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Async function to connect to the database and start the server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, mongooseOptions);
        console.log('DB Connected', process.env.DB_URL);
        server.listen(process.env.PORT, () =>
            console.log('App listening on port ' + process.env.PORT)
        );
    } catch (err) {
        console.error('Failed to connect to DB', err);
    }
};

// Start the server
startServer();
