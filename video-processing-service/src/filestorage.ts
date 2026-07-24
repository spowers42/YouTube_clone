
import { Storage } from "@google-cloud/storage";
import fs from 'fs';


const storage = new Storage();

const rawVideoBucketName = "spp-yt-raw-videos";
//Storage for downsampled videos, audio files, and thumbnails.  
const processedFilesBucketName = "spp-yt-processed-files";

const localRawVideoPath = "./storage/raw-videos";
const localProcessedFilePath = "./storage/processed-files";

/////////////////////////////////////////////////////////////////////
// File Path utils
/////////////////////////////////////////////////////////////////////

export function fullRawPath(fileName: string){
    return `${localRawVideoPath}/${fileName}`;
}

export function fullProcessedPath(fileName: string){
    return `${localProcessedFilePath}/${fileName}`;
}


/////////////////////////////////////////////////////////////////////
// Create local directories
/////////////////////////////////////////////////////////////////////

export function setupDirectories(){
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedFilePath);
}

function ensureDirectoryExists(dirPath: string){
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive:true});
        console.log(`Directory ${dirPath} created.`);
    }
}

/////////////////////////////////////////////////////////////////////
// upload and download
/////////////////////////////////////////////////////////////////////

export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({
        destination: fullRawPath(fileName)
    });

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`);
}


export async function uploadProcessedFile(fileName: string){
    const bucket = storage.bucket(processedFilesBucketName);
    const localPath = fullProcessedPath(fileName);

    await bucket
    .upload(localPath, {
        destination: fileName
    });

    console.log(`${fileName} uploaded to gs://${processedFilesBucketName}/${fileName}`);
}

/////////////////////////////////////////////////////////////////////
// file cleanup
/////////////////////////////////////////////////////////////////////

function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)){
            fs.unlink(filePath, (err)=>{
                if (err) {
                    console.error(`Failed to deleted ${filePath}`, err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
        resolve();
        }
    });
}


export function deleteRawVideo(fileName: string){
    return deleteFile(fullRawPath(fileName));
}

export function deleteProcessedFile(fileName: string){
    return deleteFile(fullProcessedPath(fileName));
}


