const User = require('../services/users.service');

module.exports = (app, GeneralError) => {

  app.get('/read',
    async (req, res, next) => {
      try {
        return res.status(200).json({
          message: 'La récupération a été effectuée avec succès.',
          values: 'Users',
        });
      } catch (error) {
        next(error);
      }
    });

  app.put('/update',
    async (req, res, next) => {
      try {
        const user = await User.Update(req.body);

        if (!user) {
          throw new GeneralError('Aucun utilisateur trouvé avec cet id.', 404);
        }

        return res.status(200).json({
          message: 'La modification a été effectuée avec succès.',
          values: user,
        });
      } catch (error) {
        next(error);
      }
    });

  app.get('/read/all',
    async (req, res, next) => {
      try {
        const user = await User.ReadAll();

        return res.status(200).json({
          message: 'La récupération a été effectuée avec succès.',
          values: user,
        });
      } catch (error) {
        next(error);
      }
    });
  return app;
};
