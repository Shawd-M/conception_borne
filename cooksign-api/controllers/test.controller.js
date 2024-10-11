const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { testing } = require('googleapis/build/src/apis/testing');
const Google = require("../services/google.service");

const CLIENT_ID = '28360204740-vv1tc42u5deccn950hjm85usjjh0i0vu.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04PMG5LtGCE4QCgYIARAAGAQSNwF-L9IrF7b-SsjJmOT1y1NmT1Sj5LwkvwrlMvQ1lBNcwP8iwcIKpJ1K7PCoyJxC_HddBtJEd58';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

const filePath = path.join(__dirname, '../test.png');

module.exports = (app, GeneralError) => {
  app.get("/ok/:id", async (req, res, next) => {
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

  app.post("/create/folder", async (req, res, next) => {
    try {
      const folderId = '1r4sbiEw4FRDewwjsdxO5uhQncZmwO7iy'
      const file = await drive.files.create({
        resource: {
          name: req.body.folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId],
        },
        fields: 'id',
      });
      console.log('Folder Id:', file.data.id);
    
      return res.status(201).json({
          message: "Création effectuée avec succés",
          values: file.data.id,
        });
    
      } catch (error) {
        console.log(error.message);
      }
  });

  app.get("/create/file", async (req, res, next) => {
    try {
        const folderId = '1eLO8EF0K36uMi02b-azrsWBoS4Z3ZpCN'
        const response = await drive.files.create({
          requestBody: {
            parents: [folderId],
            name: 'test.png',
            mimeType: 'image/jpg',
          },
          media: {
            mimeType: 'image/jpg',
            body: fs.createReadStream(filePath),
          },
        });
        console.log(response.data)
    
        return res.status(201).json({
            message: "Création effectuée avec succés",
            values: response.data,
          });
    
      } catch (error) {
        console.log(error.message);
      }
  });

  app.get("/read/file/list/:id", async (req, res, next) => {
    try {
      const folderId = req.params.id
      const files = [];
      const result = await drive.files.list({
        // q: 'mimeType=\'image/png\'',
        // q: "'folderid' in parents or 'filderid2' in parents"
        q: "'1mXg3VrbP56iXTWvzdzaWP_2rLHll4hBP' in parents",
        fields: 'nextPageToken, files(id, name, parents)',
        spaces: 'drive',
        // parents: [folderId],
      });
      Array.prototype.push.apply(files, result.files);
      result.data.files.forEach(function(file) {
        console.log('Found file:', file.name, file.id);
      });

      return res.status(201).json({
        message: "Création effectuée avec succés",
        values: result.data,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  app.get("/read/file", async (req, res, next) => {
    try {
        const fileId = '12nTkVwgRbbSx68oBYy0txPddTRke0xzJ';
        await drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
    
        /* 
        webViewLink: View the file in browser
        webContentLink: Direct download link 
        */
        const result = await drive.files.get({
          fileId: fileId,
          fields: 'webContentLink',
        });
        console.log(result.data);
        return res.status(201).json({
            message: "Création effectuée avec succés",
            values: result.data,
          });
      } catch (error) {
        console.log(error.message);
      }
  });

  return app;
};
