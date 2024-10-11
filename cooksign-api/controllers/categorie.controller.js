const Categorie = require("../services/categorie.service");

module.exports = (app, GeneralError) => {
  app.post("/create", async (req, res, next) => {
    try {
      let [categorie, created] = await Categorie.FindOrCreate(req.body);
      if (!created) {
        throw new GeneralError(
          "Cette categorie existe déjà.",
          409
        );
      }

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: categorie,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/restaurant/:id", async (req, res, next) => {
    try {
      let categorie = await Categorie.ReadAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: categorie,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/borne/all/restaurant/:id", async (req, res, next) => {
    try {
      let categorie = await Categorie.ReadBorneAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: categorie,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/active", async (req, res, next) => {
    try {
      let categorie = await Categorie.Update(req.body);

      return res.status(200).json({
        message: "La modification a été effectuée avec succès.",
        values: categorie,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
