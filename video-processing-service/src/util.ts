import { deleteProcessedFile, deleteRawVideo } from "./filestorage";

export async function localCleanup(inputFileName: string, outputFileName:string){
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedFile(outputFileName)
    ]);
}
