import { JwtPayload } from 'jsonwebtoken';
import jwtConfiguration from '../configuration/jwtConfiguration';
import { MSSecret, USSecret } from '../configuration/secretConfiguration';
import { UserRepository } from './Repository';

import express from 'express';
import { UserService } from './Service';
import { User, UserResponse } from './Model';
import { AuthHandler, IAuthHandler } from '../authorization/authorization';
import { SessionService } from '../session/Service';

const router = express.Router();

export class UserController {
    private static _instance: UserController;

    private _userService: UserService;
    private _sessionService: SessionService;
    private _authHandler: AuthHandler;

    private constructor() {
        this._userService = UserService.getInstance();
        this._authHandler = AuthHandler.getInstance();
        this._sessionService = SessionService.getInstance();

        router.get('/login', this._authHandler.verify(new USSecret()), async (req, res) => {
            res.sendFile('login.ejs', { root: __dirname + '/../views/' });
        })

        router.get('/register', this._authHandler.verify(new USSecret()), async (req, res) => {
            res.sendFile('register.ejs', { root: __dirname + '/../views/' });
        });

        //! ========================== POST METHODS ==========================

        router.post('/delete', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;

            if (!data.deleteId) {
                res.status(400).send('Id is required');
                return;
            }

            this._userService.delete(data.deleteId).then((ack) => {
                res.status(200).send(ack);
            }).catch((err) => {
                res.status(400).send(err);
            });
        })

        router.post('/create', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;
            try{
                var username = data.username;
                var password = data.password;
                var email = data.email;
                var roles = data.roles;
            }catch(err){
                res.status(400).send({
                    message: 'Username, password, email and roles are required (first)',
                    badFields: ['username', 'password', 'email']
                });
                return;
            }

            if (!username || !password || !email) {
                res.status(400).send({
                    message: 'Username, password, email and roles are required (second)',
                    badFields: ['username', 'password', 'email']
                });
                return;
            }

            var user = new User(username, email, password, roles, new Date(), new Date());

            this._userService.register(user).then((user) => {
                res.status(200).send(user);
            }).catch((err) => {
                res.status(400).send(err);
            });
        })

        router.post('/count', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;

            this._userService.count(data.username, data.email, data.roles).then((count) => {
                res.status(200).send({count: count});
            }).catch((err) => {
                res.status(400).send({count: 0, error: err});
            });
        })

        router.post('/search', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;

            if (!data.pagesize || !data.pagenumber) {
                res.status(400).send('Pagesize and pagenumber are required');
                return;
            }

            this._userService.search(data.username, data.email, data.roles, data.pagesize, data.pagenumber).then((users) => {
                res.status(200).send(users);
            }).catch((err) => {
                res.status(400).send(err);
            });
        })

        router.post('/logout', this._authHandler.verify(new USSecret()), async (req, res) => {
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

            this._sessionService.deleteSessionByUserId(data.user.id).then((ack) => {
                res.status(200).send(ack);
            }).catch((err) => {
                res.status(400).send(err);
            });            
        });

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
                this._userService.login(usernameOrEmail, password).then((user) => {

                    this._sessionService.createSession(user.id, 1).then((session) => {
                        const token = jwtConfiguration.sign({ user: new UserResponse(user.id, user.username, user.email, user.roles, session) }, new USSecret());
                        res.status(200).send({token: token});
                    }).catch((err) => {
                        res.status(400).send(err);
                    });

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

            var user = new User(username, email, password, ['user'], new Date(), new Date());

            this._userService.register(user).then((user) => {
                const token = jwtConfiguration.sign({status: 200}, new USSecret());

                res.status(200).send({token: token});
            }).catch((err) => {
                res.status(400).send(err);
            });
        });

        router.post('/role/check', this._authHandler.verify(new USSecret()), async (req, res) => {
            var data = res.locals.data as JwtPayload;
            try{
                var user = data.user;
                var role = req.body.role;
            }catch(err){
                res.status(400).send('Role is required');
                return;
            }

            if (!user) {
                res.status(400).send('User is required');
                return;
            }

            if (!role) {
                res.status(400).send('Role is required');
                return;
            }

            this._userService.checkRole(user.id, role).then((ack) => {
                res.status(200).send("OK");
            }).catch((err) => {
                res.status(401).send(err);
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