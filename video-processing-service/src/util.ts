import { deleteLocalFile, deleteRawVideo } from "./filestorage";

export async function localCleanup(inputFilePath: string, outputFilePath:string){
    await Promise.all([
        deleteRawVideo(inputFilePath),
        deleteLocalFile(outputFilePath)
    ])
}