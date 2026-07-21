import ffmpeg from 'fluent-ffmpeg';


export function downSampleVideo(rawVideoPath:string, processedVideoPath: string){
    return new Promise<void>((resolve, reject)=>{
    ffmpeg(rawVideoPath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', function(){
        console.log("processing finished");
        resolve();
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on('error', function(err: any){
        const message = "error processing video: " + err.message;
        console.log(message);
        reject(message);
    })
    .save(processedVideoPath);
    });
}

export function extractAudioFromVideo(rawVideoPath:string, audioFilePath: string){
    return new Promise<void>((resolve, reject)=>{
    // TODO fix: this fails on files with no audio stream 

    ffmpeg(rawVideoPath)
    .outputOptions('-vn', '-q:a', '0')
    .on('end', function(){
        console.log('audio extracted');
        resolve();
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on('error', function(err: any){
        const message = 'error extracting audio: ' + err.message;
        console.log(message);
        reject(message);
    })
    .save(audioFilePath);
    });
}

export function extractThumbnail(rawVideoPath:string, thumbnailPath:string){
    return new Promise<void>((resolve, reject)=>{
    ffmpeg(rawVideoPath)
    .seekInput(10)
    .size("?x360")
    .aspect("4:3")
    .autoPad()
    .outputOptions('-vframes:v 1')
    .on("end", function(){
        console.log('thumbnail extracted');
        resolve();
    })
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .on("error", function(err: any){
        const message = "error extracting thumbnail: " + err.message;
        console.log(message);
        reject(message);
    })
    .save(thumbnailPath);
    });
}