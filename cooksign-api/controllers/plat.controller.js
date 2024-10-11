const Plat = require("../services/plats.service");
const Image = require("../services/image.service");
const multer = require('multer');
const Google = require("../services/google.service");

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app, GeneralError) => {
  async function handleFileUploadPlat(req, plat, restaurantFile) {
    if (req.file) {
      const google = await Google.CreateFileInFile(req.file, restaurantFile, 'Img_Plat')
      const file = await Google.ReadFile(google.id)
  
      if (file) {
        const img = {
          plat_id: plat.id,
          menu_id: null,
          name: file.name,
          image_id: file.id,
          url: file.webContentLink,
        }
  
        const [image, created] = await Image.FindOrCreate(img)
        if (created) {
          plat.dataValues.image_id = image.id
          await Plat.Update(plat.dataValues)
        }
      }
    }
  };
  
  async function handleIngredients(ingredients, plat) {
    if (ingredients) {
      const parsedIngredients = JSON.parse(ingredients) ? JSON.parse(ingredients) : ingredients
      await Promise.all(
        parsedIngredients.map(async (ingredient) => {
          const ingredientData = {
            plat_id: plat.id,
            ingredient_id: ingredient,
          }
          await Plat.AddIngredient(ingredientData)
        })
      )
    }
  };
  
  app.post("/create", upload.single('image'), async (req, res, next) => {
    try {
      const {restaurantFile, ingredient, ...data} = req.body
      data.image_id = 1
      const [plat, created] = await Plat.FindOrCreate(data)
  
      if (!created) {
        throw new GeneralError("Ce plat existe déjà. veuillez en choisir un autre.", 409)
      }
  
      await handleFileUploadPlat(req, plat, restaurantFile)
      await handleIngredients(ingredient, plat)
  
      res.status(201).json({
        message: "Création effectuée avec succés",
        values: plat,
      })
  
    } catch (error) {
      next(error)
    }
  });  

  app.get("/read/all", async (req, res, next) => {
    try {
      const plat = await Plat.ReadAll();

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: plat,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/restaurant/:id/type/:type", async (req, res, next) => {
    try {
      const plat = await Plat.ReadByType(req.params);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: plat,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/restaurant/:id", async (req, res, next) => {
    try {
      let plat = await Plat.ReadAllByRestaurant(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: plat,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/update", upload.single('image'), async (req, res, next) => {
    try {
      const {restaurantFile, image_id, ingredient, ...data} = req.body
      const plat = await Plat.Update(data);
      
      if (!req.file && !ingredient && !plat) {
          throw new GeneralError("Modification echouée", 400);
      }

      if (ingredient) {
        await Plat.DeleteIngredient(data.id)
        await handleIngredients(ingredient, data)
      }

      if (req.file) {
        Google.DeleteFile(image_id)
        let google = await Google.CreateFileInFile(req.file, restaurantFile, 'Img_Plat')
        let file = await Google.ReadFile(google.id)
        const img = {
          id : image_id,
          name: file.name,
          image_id: file.id,
          url: file.webContentLink,
        }
        const update = await Image.UpdateByImageId(img, data)

        if (!update) {
            throw new GeneralError("Modification de l'image echouée", 400);
        }
      }


      return res.status(201).json({
        message: "Modification effectuée avec succés",
        values: plat,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/duplicate", async (req, res, next) => {
    try {
      const { id, restaurantFile } = req.body;
      const originalPlat = await Plat.FindById(id);
  
      if (!originalPlat) {
        throw new GeneralError("Plat original non trouvé", 404);
      }
      
      const newPlatData = {
        name: originalPlat.dataValues.name,
        description: originalPlat.dataValues.description,
        price: originalPlat.dataValues.price,
        type_id: originalPlat.dataValues.type_id,
        restaurant_id: originalPlat.dataValues.restaurant_id,
        image_id: 1,
      }

      let newPlat = await Plat.createDuplicate(newPlatData);

      if (!newPlat) {
        throw new GeneralError("La duplication du plat a échoué", 400);
      }
  
      const originalImage = await Image.FindByImageId(originalPlat.image_id);
      const newFile = await Google.DuplicateFile(originalImage.image_id);
      const file = await Google.ReadFile(newFile.id);
  
      const newImage = {
        plat_id: newPlat.id,
        menu_id: null,
        name: file.name,
        image_id: file.id,
        url: file.webContentLink,
      };
  
      const [image, createdImage] = await Image.FindOrCreate(newImage);
  
      if (!createdImage) {
        throw new GeneralError("La création de l'image a échoué", 400);
      }
  
      newPlat.image_id = image.id;
      await Plat.Update(newPlat.dataValues);
  
      return res.status(201).json({
        message: "Duplication effectuée avec succès",
        values: newPlat,
      });
  
    } catch (error) {
      next(error);
    }
  });
  
  app.put("/disable/:id", async (req, res, next) => {
    try {
      const update = await Plat.Update({id : req.params.id, active: -1});

      if (!update) {
        throw new GeneralError("Désactivation echouée", 400);
      }
      
      return res.status(201).json({
        message: "Désactivation effectuée avec succés",
        values: update,
      });
    } catch (error) {
      next(error);
    }
  });

  return app;
};
