const Menu = require("../services/menu.service");
const Image = require("../services/image.service");
const multer = require('multer');
const Google = require("../services/google.service");

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app, GeneralError) => {
  app.get("/test/:id", async (req, res, next) => {
    try {
      const test = await Google.ReadFile(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: test,
      });
      } catch (error) {
        console.log(error.message);
      }
  });

  app.post("/create", upload.single('image'), async (req, res, next) => {
    try {
      const {restaurantFile, ...data} = req.body
      data.image_id = 1
      let [menu, created] = await Menu.FindOrCreate(data);
      if (!created) {
        throw new GeneralError(
          "Ce menu existe déjà. veuillez en choisir un autre.",
          409
        );
      } else if (req.file) {
        let google = await Google.CreateFileInFile(req.file, restaurantFile, 'Img_Menu')
        let file = await Google.ReadFile(google.id)
        if (file)  {
          const img = {
            plat_id : null,
            menu_id : menu.id,
            name: file.name,
            image_id: file.id,
            url: file.webContentLink,
          }
          const [image, created] = await Image.FindOrCreate(img)
          if (created)
            menu.dataValues.image_id = image.id
          await Menu.Update(menu.dataValues);
        }
      }
      JSON.parse(data.items).forEach(async (element) => {
        await Menu.AddPlat({
          id: element.id,
          menu: menu.id,
        });
      });

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: 'menu',
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/read/all/restaurant/:id", async (req, res, next) => {
    try {
      const plat = await Menu.ReadAllByRestaurant(req.params.id);

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
      const {restaurantFile, image_id, ...data} = req.body
      const menu = await Menu.Update(data);
      
      if (!req.file && !menu && !req.body) {
          throw new GeneralError("Modification echouée", 400);
      }

      if (req.file) {
        Google.DeleteFile(image_id)
        let google = await Google.CreateFileInFile(req.file, restaurantFile, 'Img_Menu')
        let file = await Google.ReadFile(google.id)
        const img = {
            id : image_id,
            name: file.name,
            image_id: file.id,
            url: file.webContentLink,
        }
        const update = await Image.UpdateByImageId(img)

        if (!update) {
            throw new GeneralError("Modification de l'image echouée", 400);
        }
      }

      await Menu.DeletePlat(data.id);

      JSON.parse(data.items).forEach(async (element) => {
        await Menu.AddPlat({
          id: element.id,
          menu: data.id,
        });
      });

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: menu,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/duplicate", async (req, res, next) => {
    try {
      const { id, restaurantFile } = req.body;
      const originalMenu = await Menu.FindById(id);
  
      if (!originalMenu) {
        throw new GeneralError("Menu original non trouvé", 404);
      }
      
      const newMenuData = {
        name: originalMenu.dataValues.name,
        description: originalMenu.dataValues.description,
        price: originalMenu.dataValues.price,
        restaurant_id: originalMenu.dataValues.restaurant_id,
        image_id: 1,
      }

      let newMenu = await Menu.createDuplicate(newMenuData);

      if (!newMenu) {
        throw new GeneralError("La duplication du menu a échoué", 400);
      }
  
      const originalImage = await Image.FindByImageId(originalMenu.image_id);
      const newFile = await Google.DuplicateFile(originalImage.image_id);
      const file = await Google.ReadFile(newFile.id);
  
      const newImage = {
        plat_id: newMenu.id,
        menu_id: null,
        name: file.name,
        image_id: file.id,
        url: file.webContentLink,
      };
  
      const [image, createdImage] = await Image.FindOrCreate(newImage);
  
      if (!createdImage) {
        throw new GeneralError("La création de l'image a échoué", 400);
      }
  
      newMenu.image_id = image.id;
      await Menu.Update(newMenu.dataValues);
  
      originalMenu.dataValues.platHasMenu.forEach(async (element) => {
        await Menu.AddPlat({
          id: element.dataValues.id,
          menu: newMenu.id,
        });
      });

      return res.status(201).json({
        message: "Duplication effectuée avec succès",
        values: newMenu,
      });
  
    } catch (error) {
      next(error);
    }
  });

  app.put("/disable/:id", async (req, res, next) => {
    try {
      const update = await Menu.Update({id : req.params.id, active: -1});

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
