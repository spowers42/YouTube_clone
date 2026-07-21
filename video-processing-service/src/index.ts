import express from 'express';
import { downSampleVideo, extractAudioFromVideo, extractThumbnail } from './videoprocessors';
import { downloadRawVideo, fullProcessedPath, fullRawPath, setupDirectories, uploadProcessedFile } from './filestorage';
import { localCleanup } from './util';
 
// local storage for processing videos
setupDirectories(); 

const app = express();
app.use(express.json());

const port = process.env.port || 3000;

app.get("/health/live", (req, res) => {
    res.status(200).send("Running 😁")
})

app.post('/downScale', async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name){
            throw new Error("Invalid message, name is required");
        } 
    }catch (error){
        console.error(error);
        return res.status(400).send("Bad request, missing filename");
    }

    const inputFileName = data.name;
    const outputFileName = `downsampled-${inputFileName}`;
    const inputFilePath = fullRawPath(inputFileName);
    const outputFilePath = fullProcessedPath(outputFileName);
 
    try {
        await downloadRawVideo(inputFileName);
        // Todo: clean up name vs path
        await downSampleVideo(inputFilePath, outputFilePath);     
        await uploadProcessedFile(outputFileName);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Processing Failed");
    }    finally {
        await localCleanup(inputFileName, outputFileName);
    }
    
    return res.status(200).send("Downscaling completed.")
    
});

app.post('/extractAudio', async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name){
            throw new Error("Invalid message, name is required");
        } 
    }catch (error){
        console.error(error);
        return res.status(400).send("Bad request, missing filename");
    }

    const inputFileName = data.name;
    const outputFileName = `audio-${inputFileName}`;
    const inputFilePath = fullRawPath(inputFileName);
    const outputFilePath = fullProcessedPath(outputFileName);
 
    try {
        await downloadRawVideo(inputFileName);
        // Todo: clean up name vs path
        await extractAudioFromVideo(inputFilePath, outputFilePath);   
        await uploadProcessedFile(outputFileName);  
    } catch (error) {
        console.error(error);
        return res.status(500).send("Processing Failed");
    }    
    finally {
        await localCleanup(inputFileName, outputFileName);
    }
    
    

    return res.status(200).send("Audio extraction completed.")
});

app.post('/extractThumbnail', async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name){
            throw new Error("Invalid message, name is required");
        } 
    }catch (error){
        console.error(error);
        return res.status(400).send("Bad request, missing filename");
    }

    const inputFileName = data.name;
    const outputFileName = `thumbnail-${inputFileName}`;
    const inputFilePath = fullRawPath(inputFileName);
    const outputFilePath = fullProcessedPath(outputFileName);
 
    try {
        await downloadRawVideo(inputFileName);
        // Todo: clean up name vs path
        await extractThumbnail(inputFilePath, outputFilePath); 
        await uploadProcessedFile(outputFileName);    
    } catch (error) {
        console.error(error);
        
        return res.status(500).send("Processing Failed");
    } finally {
        await localCleanup(inputFileName, outputFileName);
    }

    return res.status(200).send("thumbnail extraction completed.")

});


app.listen(port, () =>{
    console.log(`server starting on http://localhost:${port}`);
});
