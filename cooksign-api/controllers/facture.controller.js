const Facture = require("../services/facture.service");

module.exports = (app, GeneralError) => {
  app.post("/create", async (req, res, next) => {
    try {
      const facture = await Facture.Create(req.body);

      if (!facture) {
        throw new GeneralError(
          "Erreur lors de la création de la facture",
          409
        );
      }

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: facture,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/restaurant/:id", async (req, res, next) => {
    try {
      const facture = await Facture.ReadAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: facture,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/update", async (req, res, next) => {
    try {
      const plat = await Facture.Update(req.body);

      if (!plat) {
        throw new GeneralError("Aucune facture trouvé avec cet id.", 404);
      }

      return res.status(200).json({
        message: "La modification a été effectuée avec succès.",
        values: plat,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
