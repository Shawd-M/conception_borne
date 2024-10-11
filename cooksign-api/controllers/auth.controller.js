const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Joi, errorMessages } = require('../helpers/validate');
const User = require('../services/users.service');

const pattern = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{7,100}$/;
const schema = Joi.object({
  login: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages(errorMessages('login')),
  newPassword: Joi.string()
    .min(7)
    .max(100)
    .regex(pattern)
    .required()
    .messages(errorMessages(
      'newPassword',
      'string',
      '1 majuscule,  1 minuscule, 1 chiffre et 1 cararctère spéciale (! @ # $ % ^ & *)',
    )),
  confirmPassword: Joi.string()
    .min(7)
    .max(100)
    .regex(pattern)
    .required()
    .messages(errorMessages(
      'confirmPassword',
      'string',
      '1 majuscule,  1 minuscule, 1 chiffre et 1 cararctère spéciale (! @ # $ % ^ & *)',
    )),
}).unknown(true);

module.exports = (app, GeneralError) => {
  app.post('/register', (
    async (req, res, next) => {
      try {
        const [user, created] = await User.FindOrCreate(req.body);

        if (!created) {
          throw new GeneralError('Ce login est déjà utilisé. veuillez en choisir un autre.', 409);
        }
        const isCreated = await User.AddRole(2, user.dataValues.id);

        if (!isCreated) {
          throw new GeneralError('Cet utilisateur possède déjà ce role.', 409);
        }
        
        return res.status(201).json({
          message: 'Création effectuée avec succés',
          values: user,
        });
      } catch (error) {
        next(error);
      }
    }
  ));

  app.post('/login', async (req, res, next) => {
    try {
      const { login, password } = req.body;

      const user = await User.FindUser(login);
      if (!user) {
        throw new GeneralError('login incorrect', 401);
      }
      const match = await User.Compare(password, user.password);

      if (!match) {
        throw new GeneralError('mot de passe incorrect', 401);
      }
      const token = jwt.sign(
        {
          sub: user.id,
          exp: Math.floor(Date.now() / 1000) + (3600 * 3),
        },
        process.env.JWT_SIGN_SECRET,
      );
      return res.status(200).json({
        message: 'Connexion réussie',
        token,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/login/borne', async (req, res, next) => {
    try {
      const { login, password } = req.body;

      const user = await User.FindUser(login);
      if (!user) {
        throw new GeneralError('login incorrect', 401);
      }
      const match = await User.Compare(password, user.password);

      if (!match) {
        throw new GeneralError('mot de passe incorrect', 401);
      }
      const token = jwt.sign(
        {
          sub: user.id,
        },
        process.env.JWT_SIGN_SECRET,
      );
      return res.status(200).json({
        message: 'Connexion réussie',
        token,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/reset/password', async (req, res, next) => {
    try {
      const data = await schema.validateAsync(req.body);
      const { login, confirmPassword, newPassword } = data;
      const user = await User.FindUser(login);
      if (!user) {
        throw new GeneralError('Aucun compte trouvé, login incorrect', 404);
      }
      const match = confirmPassword === newPassword;

      if (!match) {
        throw new GeneralError('les mots de passe ne correspondent pas', 400);
      }

      user.password = newPassword;

      const response = await User.ResetPassword(user.dataValues);

      if (response === 0) {
        throw new GeneralError('la modification à échoué.', 500);
      }
      return res.status(200).json({
        message: 'Modification réussie',
      });
    } catch (error) {
      next(error);
    }
  });
  /**
   * @swagger
   * /api/auth/me:
   *  get:
   *    tags:
   *      - Authentification
   *    description: Récupere les infos de l'utilisateur connecté.
   *    responses:
   *      200:
   *        description: Succès.
   *      404:
   *        description: Aucun utilisateur trouvé avec ce token.
   *      500:
   *        description: Une erreur s'est produite.
   *
   */
  app.get('/me', passport.authenticate('jwt', { session: false }, null), async (req, res, next) => {
    try {
      const user = await User.FindUser(req.user.id);

      if (!user) {
        throw new GeneralError('Aucun utilisateur trouvé avec ce token.', 404);
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  });

  return app;
};
