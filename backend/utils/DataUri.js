// backend/utils/dataUri.js
import DatauriParser from "datauri/parser.js"; // ✅ Note the .js extension
import path from "path";

const parser = new DatauriParser();

/**
 * Converts a multer file buffer to a Data URI for cloudinary upload
 * @param {object} file - multer file object
 * @returns {object} DataURI object with content and mimetype
 */
export const getDataUri = (file) => {
  const ext = path.extname(file.originalname).toString();
  return parser.format(ext, file.buffer);
};
