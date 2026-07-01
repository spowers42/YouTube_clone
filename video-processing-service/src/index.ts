import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

const port = process.env.port || 3000;

app.post('/downScale', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath){
        return res.status(400).send("Input file path required");
    }
    if (!outputFilePath){
        return res.status(400).send("Output file path required");
    }

    ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', function(){
        console.log("processing finished");
        res.status(200).send('processing finished successfully');
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on('error', function(err: any){
        const message = "error processing video: " + err.message;
        console.log(message);
        res.status(500).send(message);
    })
    .save(outputFilePath);

});

app.post('/extractAudio', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath){
        return res.status(400).send("Input file path required");
    }
    if (!outputFilePath){
        return res.status(400).send("Output file path required");
    }
    if (!outputFilePath.endsWith(".mp3")){
        return res.status(400).send("Output file path must be .mp3")
    }

    // TODO fix: this fails on files with no audio stream 

    ffmpeg(inputFilePath)
    .outputOptions('-vn', '-q:a', '0')
    .on('end', function(){
        console.log('audio extracted');
        res.status(200).send('audio extraction finished successfully');
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on('error', function(err: any){
        const message = 'error extracting audio: ' + err.message;
        console.log(message);
        res.status(500).send(message);
    })
    .save(outputFilePath);
});

app.post('/extractThumbnail', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath){
        return res.status(400).send("Input file path required");
    }
    if (!outputFilePath){
        return res.status(400).send("Output file path required");
    }
    if (!outputFilePath.endsWith(".jpg")){
        return res.status(400).send("Output file path must be .jpg")
    }

    ffmpeg(inputFilePath)
    .seekInput(10)
    .size("?x360")
    .aspect("4:3")
    .autoPad()
    .outputOptions('-vframes:v 1')
    .on("end", function(){
        console.log('thumbnail extracted');
        res.status(200).send("thumbnail successfull extracted");
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on("error", function(err: any){
        const message = "error extracting thumbnail: " + err.message;
        console.log(message);
        res.status(500).send(message);
    })
    .save(outputFilePath);
});


app.listen(port, () =>{
    console.log(`server starting on http://localhost:${port}`);
});
