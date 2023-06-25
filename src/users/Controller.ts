import { JwtPayload } from 'jsonwebtoken';
import jwtConfiguration from '../configuration/jwtConfiguration';
import { MSSecret, USSecret } from '../configuration/secretConfiguration';
import { UserRepository } from './Repository';

import express from 'express';
import { UserService } from './Service';
import { User, UserResponse } from './Model';
import { AuthHandler, IAuthHandler } from '../authorization/authorization';

const router = express.Router();

export class UserController {
    private static _instance: UserController;

    private _service: UserService;
    private _authHandler: AuthHandler;

    private constructor() {
        this._service = UserService.getInstance();
        this._authHandler = AuthHandler.getInstance();

        router.get('/login', this._authHandler.verify(new USSecret()), async (req, res) => {
            res.sendFile('login.ejs', { root: __dirname + '/../views/' });
        })

        router.get('/register', this._authHandler.verify(new USSecret()), async (req, res) => {
            res.sendFile('register.ejs', { root: __dirname + '/../views/' });
        });

        router.get('/logout', async (req, res) => {
            res.clearCookie('auth');
            res.redirect('/users/login');
        });

        //! ========================== POST METHODS ==========================

        //* Login
        //* Body: token
        //* Token data: usernameOrEmail, password
        //* usernameOrEmail: username or email (both are unique, and will be used to find the user)
        //* Returns: token (200) or error (400)
        router.post('/login', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;
            try{
                var usernameOrEmail = data.body.usernameOrEmail;
                var password = data.body.password;
            }catch(err){
                res.status(400).send('Username and password are required');
                return;
            }

            if (!usernameOrEmail || !password || usernameOrEmail == '' || password == '') {
                res.status(400).send('Username and password are required');
                return;
            }

            try{
                this._service.login(usernameOrEmail, password).then((user) => {
                    const token = jwtConfiguration.sign({ user: new UserResponse(user.id, user.username, user.email, user.session) }, new USSecret());
                    res.status(200).send({token: token});
                }).catch((err) => {
                    // Send unauthorized
                    res.status(401).send('Unauthorized');
                });
            }catch(err){
                res.status(401).send('Unauthorized');
            }
        });

        //* Register
        //* Body: token
        //* Token data: username, password, email
        //* Returns: token (200) or error (400)
        router.post('/register', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;
            try{
                var username = data.body.username;
                var password = data.body.password;
                var email = data.body.email;
            }catch(err){
                res.status(400).send({
                    message: 'Username, password, first name, last name and email are required', 
                    badFields: ['username', 'password', 'email']
                });
                return;
            }

            if (!username || !password || !email) {
                res.status(400).send({
                    message: 'Username, password, first name, last name and email are required', 
                    badFields: ['username', 'password', 'email']
                });
                return;
            }

            var user = new User(username, email, password, 'user', new Date(), new Date());

            this._service.register(user).then((user) => {
                const token = jwtConfiguration.sign({ user: new UserResponse(user.id, user.username, user.email, {})}, new USSecret());

                res.status(200).send({token: token});
            }).catch((err) => {
                res.status(400).send(err);
            });
        });

        //* Check session
        //* Body: token
        //* Token data: user, user.session
        //* Returns: token (200) or error (400)
        router.post('/checkSession', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;

            if (!data.user) {
                res.status(400).send('User is required');
                return;
            } 

            if (!data.user.session) {
                res.status(400).send('Session is required');
                return;
            }

            if (!data.user.session.id) {
                res.status(400).send('Session id is required');
                return;
            }

            this._service.checkSession(data).then((user) => {
                var token = jwtConfiguration.sign({ user: new UserResponse(user.id, user.username, user.email, user.session) }, new USSecret());
                res.status(200).send({token : token});
            }).catch((err) => {
                res.status(401).send('Unauthorized');
            });
                
        });
    }

    public getRouter() {
        return router;
    }

    public static getInstance(): UserController {
        if (!this._instance) {
            this._instance = new UserController();
        }

        return this._instance;
    }

}