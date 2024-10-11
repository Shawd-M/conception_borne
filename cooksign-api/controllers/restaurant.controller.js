const Restaurant = require("../services/restaurant.service");
const Restaurant_detail = require("../services/restaurant_details.service");
const Google = require("../services/google.service");

module.exports = (app, GeneralError) => {
  app.post("/create", async (req, res, next) => {
    try {
      const [restaurant, created] = await Restaurant.FindOrCreate(req.body);

      if (!created) {
        throw new GeneralError(
          "Ce restaurant existe déjà. veuillez en choisir un autre.",
          409
        );
      } else {
        const folderId = await Google.CreateFolder(`${restaurant.id}${restaurant.name}`);
        if (!folderId) {
          throw new GeneralError(
            "Une erreur est survenue lors de la création du dossier.",
            500
          );
        }

        const folder = ['Img_Plat', 'Img_Menu', 'Img_Restaurant', 'Img_Logo', 'Img_Carte', 'Img_Autre']

        for (let i = 0; i < folder.length; i++) {
          await Google.CreateFolderInFolder(folder[i], folderId);
        }


        restaurant.folder = `${folderId}`;
        const details = {
          restaurant_id: restaurant.id,
        };
        await Promise.all([
          Restaurant.Update(restaurant.dataValues),
          Restaurant_detail.FindOrCreate(details),
        ]);
      }

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: restaurant,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all", async (req, res, next) => {
    try {
      const restaurant = await Restaurant.ReadAll();

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: restaurant,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/by/:id", async (req, res, next) => {
    try {
      const restaurant = await Restaurant.Read(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: restaurant,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/update", async (req, res, next) => {
    try {
      const restaurant = await Restaurant.Update(req.body);

      if (!restaurant) {
        throw new GeneralError("Aucun borne trouvé avec cet id.", 404);
      }

      return res.status(200).json({
        message: "La modification a été effectuée avec succès.",
        values: restaurant,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
