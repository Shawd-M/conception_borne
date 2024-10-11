const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { testing } = require('googleapis/build/src/apis/testing');
const stream = require('stream');

const CLIENT_ID = '28360204740-vv1tc42u5deccn950hjm85usjjh0i0vu.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04PMG5LtGCE4QCgYIARAAGAQSNwF-L9IrF7b-SsjJmOT1y1NmT1Sj5LwkvwrlMvQ1lBNcwP8iwcIKpJ1K7PCoyJxC_HddBtJEd58';


// FOLDERID='1GHMNiJx3BqQ37irbf-nkMGfwsi_KJFZt'
// CLIENT_ID = '28360204740-vv1tc42u5deccn950hjm85usjjh0i0vu.apps.googleusercontent.com';
// CLIENT_SECRET = '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';
// REFRESH_TOKEN = '1//04PMG5LtGCE4QCgYIARAAGAQSNwF-L9IrF7b-SsjJmOT1y1NmT1Sj5LwkvwrlMvQ1lBNcwP8iwcIKpJ1K7PCoyJxC_HddBtJEd58';

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

module.exports = {
  CreateFolder: async (name) => {
    const file = await drive.files.create({
      resource: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [process.env.FOLDERID],
      },
      fields: 'id',
    });
    return file.data.id;
  },

  CreateFolderInFolder: async (name, id) => {
    const file = await drive.files.create({
      resource: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [id],
      },
      fields: 'id',
    });
    return file.data.id;
  },

  FindFolderByName: async (name) => {
    const files = [];
    const result = await drive.files.list({
      q: `'${process.env.FOLDERID}' in parents and mimeType=\'application/vnd.google-apps.folder\' and name=\'${name}\'`,
      fields: 'nextPageToken, files(id, name, parents)',
      spaces: 'drive',
    });
    Array.prototype.push.apply(files, result.data.files);
    result.data.files.forEach(function(file) {
      console.log('Found folder:', file.name, file.id);
    });
    return files;
  },

  CreateFile: async (file, folder) => {
    let bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const response = await drive.files.create({
        requestBody: {
          parents: [folder],
          name: Date.now(),
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
      });
    return response.data;
  },

  CreateFileInFile: async (file, folder, folderName) => {
    let bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    
    const folderList = await drive.files.list({
      q: `'${folder}' in parents`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });
    const folderId = folderList.data.files.find((element) => element.name === folderName).id;

    const response = await drive.files.create({
        requestBody: {
          parents: [folderId],
          name: Date.now(),
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
      });
    return response.data;
  },

  ReadFile: async (fileId) => {
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
      fields: 'id,name,webContentLink',
    });
    return result.data ? result.data : null;
  },

  DeleteFile: async (fileId) => {
    if (fileId !== '16dJbxhlXEqK9F4CUS0dMDcrFnQFCP_nF') {
      const result = await drive.files.delete({
        fileId: fileId,
      });
      return result.data ? result.data : null;
    } else {
      return true;
    }
  },

  DuplicateFile: async (fileId) => {
    const result = await drive.files.copy({
      fileId: fileId,
      requestBody: {
        name: Date.now(),
      },
    });
    return result.data ? result.data : null;
  },

  UpdateFileContent: async (fileId, newContent) => {
    let bufferStream = new stream.PassThrough();
    bufferStream.end(newContent.buffer);

    const result = await drive.files.update({
      fileId: fileId,
      media: {
        mimeType: newContent.mimetype,
        body: bufferStream,
      },
    });
    return result.data ? result.data : null;
  },

  downloadFile: async (fileId) => {
    try {
      const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
      const fileData = response.data;
      console.log(response.data)
      // const blob = new Blob([fileData], { type: response.headers['content-type'] });
  
      return response.data;
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la récupération du fichier :', error);
    }
  }
};
