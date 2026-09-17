import fs from "fs";

export async function deleteLocalFiles(file) {
  if (!file) return;
  try {
    fs.unlinkSync(file.path);
    //  // console.log(`Deleted file: ${file.path}`);
  } catch (err) {
    // console.warn(`Failed to delete file ${file?.path}: ${err?.message}`);
  }
}


export async function deleteLocalFile(filePath) {
  if (!filePath) return;

  try {
    fs.unlinkSync(filePath);
    //  // console.log(`Deleted file: ${filePath}`);
  } catch (err) {
    // console.warn(`Failed to delete file ${filePath}: ${err.message}`);
  }
}
