import passport from 'passport';
// import { BasicStrategy } from 'passport-http'
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {jwtSecret, masterKey} from '../../config';
import SuperDivisionModel from '../../models/superdivision';
import LoginModel from '../../models/login';
import {knexPool} from '../../lib/knexPool';
import {ipValidator} from '../../lib/ipValidator';

export const password = () => (req, res, next) =>
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err);
    } else if (err || !user) {
      if (err) {
        return res.status(401).json({message: `${err}`});
      }
      return res.status(401).json({message: 'Wrong username or password'});
    }
    if (info && info.division_db) {
      req.division_db = info.division_db;
    }
    req.logIn(user, {session: false}, err => {
      if (err) return res.status(401).end();
      next();
    });
  })(req, res, next);

export const master = () => passport.authenticate('master', {session: false});

export const token = ({required} = {}) => (
  req,
  res,
  next // , roles = User.roles
) =>
  passport.authenticate('token', {session: false}, async (err, user, info) => {
    if (err || (required && !user)) {
      //  || (required && !~roles.indexOf(user.role))
      return res.status(401).send({message_code: 'UNAUTHORIZED'});
    }
    if (info && info.division_db) {
      req.division_db = info.division_db;
      req.knex = await knexPool.getKnex(req.division_db);
    }
    await ipValidator.validateRequest(req);
    req.logIn(user, {session: false}, err => {
      if (err) return res.status(401).send({message_code: 'FAILED_FETCH_USER'});
      next();
    });
  })(req, res, next);

export const extractJwt = ({required} = {}) => (req, res, next) =>
  passport.authenticate('info_token', {session: false}, (err, tokenInfo, info) => {
    if (err) {
      return res.status(401).send({message_code: 'INVALID_TOKEN'});
    }
    req.tokenInfo = tokenInfo;
    next();
  })(req, res, next);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password', // this is the virtual field on the model
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        const sdModel = new SuperDivisionModel();
        const {division_id} = req.body;
        let response = await sdModel.getDivisionDatabase(division_id);
        if (!response || response.length === 0) {
          done(new Error('Invalid division'));
          return;
        }
        const division_db = response[0].database_name;
        req.division_db = division_db;
        req.knex = await knexPool.getKnex(req.division_db);
        await ipValidator.validateRequest(req);
        const loginModel = new LoginModel();

        const user = await loginModel.loginUser(username, password, division_db);
        done(null, user, {division_db});
      } catch (error) {
        console.error(error);
        done(error);
      }

      //   userSchema.validate({ email, password }, (err) => {
      //     if (err) done(err)
      //   })
      //   User.findOne({ email }).then((user) => {
      //     if (!user) {
      //       done(true)
      //       return null
      //     }
      //     return user.authenticate(password, user.password).then((user) => {
      //       done(null, user)
      //       return null
      //     }).catch(done)
      //   })
    }
  )
);

passport.use(
  'master',
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({id: {userName, division_db}}, done) => {
      const loginModel = new LoginModel();
      loginModel
        .getUserWithToken(division_db, userName)
        .then(user => {
          done(null, user, {division_db});
        })
        .catch(done);
    }
  )
);

passport.use(
  'info_token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromBodyField('token')
      ])
    },
    (info, done) => {
      done(null, info);
    }
  )
);
