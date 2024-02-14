const express = require("express");
// const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const bp = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload")
const fileStoragePath = "../frontend/src/Components/uploads";
const imagesPath = "../frontend/src/Components/images"
const app = express();

const PORT = process.env.PORT || 3011;

// let array;

app.use(fileUpload({}));
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.static(fileStoragePath));
app.use(express.static(imagesPath))
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// const storageConfig = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, fileStoragePath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

// app.use(multer({ storage: storageConfig }).array("filedata"));

app.post("/reload", (req, res, next) => {
    let data = JSON.stringify(req.body)
    console.log(data)
    fs.writeFile("reloadedContent.json", data, err => {
        console.log(err)
    })
})

// app.post("/changeLang", (req, res, next) => {
//     let data = JSON.stringify(req.body)
//     fs.writeFileSync("language.json", data)
// })

// app.get("/getLang", (req, res) => {
//     let toSend = fs.readFileSync("language.json")
//     let obj = JSON.parse(toSend)
//     res.send(JSON.stringify({info:obj}))
// })

app.get("/afterReload", (req, res) => {
    let toSend = fs.readFileSync("reloadedContent.json")
    let obj = JSON.parse(toSend)
    res.send(JSON.stringify({info: obj}));


    obj = {
        playingAudioNumber: 0,
        sliderValue: 0,
        play: false,
    }
    let data = JSON.stringify(obj)

    fs.writeFileSync("reloadedContent.json", data)
})

app.post("/upload", function (req, res, next) {
    if (req.files.filedata[0] ) {
        req.files.filedata[0].mv(path.join(fileStoragePath, req.files.filedata[0].name));
        let index = req.files.filedata[0].name.lastIndexOf('.')
        // let index2 = req.files.filedata[1].name.lastIndexOf('.')
        // let currentExstension = req.files.filedata[1].name.slice(index2)
        let imgName = req.files.filedata[0].name.replace(req.files.filedata[0].name.slice(index), '.jpg')
        console.log(imgName)
        req.files.filedata[1].mv(path.join(imagesPath, req.files.filedata[1].name))
        setTimeout(() => {
            fs.renameSync(path.join(imagesPath, req.files.filedata[1].name), path.join(imagesPath, imgName), () => {console.log("renamed")})
        }, 110);
    } else {
         req.files.filedata.mv(path.join(fileStoragePath, req.files.filedata.name));
    }
    console.log(req.body, req.file, req.files)
});

app.get("/getAllMusic", (req, res) => {
    fs.readdir(fileStoragePath, (err, files) => {
        array = []
        files.forEach(file => { array.push(file) });
    })

    res.send(JSON.stringify({ music: array }));
});

app.post("/delete", (req, res) => {
    let i = req.body.index;
    let index = req.body.fileName[i].lastIndexOf('.')
    let imgName = req.body.fileName[i].replace(req.body.fileName[i].slice(index), '.jpg')
    fs.unlink(path.join(fileStoragePath, req.body.fileName[i]), err => {
        err
            ? console.log(err)
            : console.log("File successfully deleted");
    });
    fs.unlink(path.join(imagesPath, imgName), err => {
        
    })
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});