const Restaurant_detail = require("../services/restaurant_details.service");
const Image = require("../services/image.service");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Google = require("../services/google.service");
const { Buffer } = require('buffer');

module.exports = (app, GeneralError) => {
  app.get("/read/by/:id", async (req, res, next) => {
    try {
      const restaurant_detail = await Restaurant_detail.Read(req.params.id);

      return res.status(200).json({
        message: "La récupération a été effectuée avec succès.",
        values: restaurant_detail,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/update/:id", upload.single('image'), async (req, res, next) => {
    try {
      const {restaurantFile, image_id, google_id, ...data} = req.body
      const restaurant_detail = await Restaurant_detail.UpdateById(req.params.id, data);

      if (!req.file && !restaurant_detail) {
        throw new GeneralError("Modification echouée", 400);
      }

      if (req.file) {
        Google.DeleteFile(google_id)
        let google = await Google.CreateFile(req.file, restaurantFile)
        let file = await Google.ReadFile(google.id)
        const img = {
            id : google_id,
            name: file.name,
            image_id: file.id,
            url: file.webContentLink,
        }

        if (image_id > 3) {
          const update = await Image.UpdateByImageId(img)
          if (!update) {
            throw new GeneralError("Modification de l'image echouéess", 400);
          }
        }
        const { id, ...createImg } = img;
        const [image, create] = await Image.FindOrCreate(createImg)
        if (!create) {
          throw new GeneralError("Modification de l'image echouéezz", 400);
        }
        const restaurant_detail = await Restaurant_detail.UpdateById(req.params.id, {image_id: image.id});
        if (!restaurant_detail) {
          throw new GeneralError("Modification de l'image echouéefdf", 400);
        }
      }

      return res.status(200).json({
        message: "La modification a été effectuée avec succès.",
        values: 'restaurant_detail',
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/downloadFile", async (req, res, next) => {
    try {
      const arrayBuffer = await Google.downloadFile(req.body.fileID);
      const buffer = Buffer.from(arrayBuffer);
  
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  });

  return app;
};
