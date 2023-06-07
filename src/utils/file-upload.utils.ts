import { extname } from 'path';

export const uploadFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(json|png)$/)) {
    return callback(new Error('Only json anf png file are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname
  callback(null, `${name}`);
};