const Ingredient = require("../services/ingredient.service");

module.exports = (app, GeneralError) => {
  app.post("/create", async (req, res, next) => {
    try {
      let [ingredient, created] = await Ingredient.FindOrCreate(req.body);
      if (!created) {
        throw new GeneralError(
          "Cette ingredient existe déjà.",
          409
        );
      }

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: ingredient,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/restaurant/:id", async (req, res, next) => {
    try {
      let ingredient = await Ingredient.ReadAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: ingredient,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
