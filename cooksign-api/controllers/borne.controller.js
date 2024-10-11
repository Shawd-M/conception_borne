const Borne = require("../services/bornes.service");
const User = require('../services/users.service');

module.exports = (app, GeneralError) => {
  app.post("/create", async (req, res, next) => {
    try {
      const [borne, created] = await Borne.FindOrCreate(req.body);

      if (!created) {
        throw new GeneralError("Cette borne existe déjà.", 409);
      }
      
      const [user, createdUser] = await User.FindOrCreate({
        login: req.body.serieNum.toString(),
        password: req.body.code,
        firstName: req.body.name,
      });

      if (!createdUser) {
        throw new GeneralError('Ce login est déjà utilisé. veuillez en choisir un autre.', 409);
      }
      const isCreated = await User.AddRole(3, user.dataValues.id);

      if (!isCreated) {
        throw new GeneralError('Cet utilisateur possède déjà ce role.', 409);
      }

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: borne,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all", async (req, res, next) => {
    try {
      const borne = await Borne.ReadAll();

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: borne,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/bornes/:id", async (req, res, next) => {
    try {
      const borne = await Borne.ReadAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: borne,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/update", async (req, res, next) => {
    try {
      const borne = await Borne.Update(req.body);

      if (!borne) {
        throw new GeneralError("Aucun borne trouvé avec cet id.", 404);
      }
      
      const user = {
        firstName: req.body.name,
        login: req.body.serieNum.toString(),
        restaurant_id: req.body.restaurant_id,
      }

      const userUpdated = await User.UpdateBorne(user); 

      if (!userUpdated) {
        throw new GeneralError("Erreur lors de la modifiaction.", 404);
      }

      return res.status(200).json({
        message: "La modification a été effectuée avec succès.",
        values: borne,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/link/borne', async (req, res, next) => {
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

      const borne = await Borne.FindBorne(login);

      const linkUser = await User.Update({
        id: user.id,
        restaurant_id: req.body.restaurantId,
      });

      const linkBorne = await Borne.Update({
        id: borne.id,
        restaurant_id: req.body.restaurantId,
      });

      if (!linkUser && !linkBorne) {
        throw new GeneralError('Erreur lors de la connexion', 401);
      }

      return res.status(200).json({
        message: 'Connexion réussie',
        value: linkBorne,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
