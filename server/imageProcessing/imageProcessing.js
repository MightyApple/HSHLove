const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const path = require("path")

const gc = new Storage({
    keyFilename: path.join(__dirname, "../config/hshloveKey.json"),
    projectId: 'hshlove'
})

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
  });

const profilbilder = gc.bucket('profilbilder')
const chatBilder= gc.bucket('chatbilder')

//--------------------------- Nicht fertig
async function getAllImages(userID){
    try{
        const files = await profilbilder.getFiles({prefix:userID.toString()});
        return files
    }catch(e){
        console.log(e)
    }    
}

async function uploadChatImage(Image){
  /*
  New File muss am besten so aussehen.
  newFile = {
      fieldname: req.file.fieldname,
      originalname: uId + "_" + imgNr.toString() + ".jpeg",
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
      size: req.file.size
  }*/

  const blob = chatBilder.file(Image.originalname);
  const blobStream = blob.createWriteStream();
  blobStream.end(Image.buffer);
}

async function uploadImage(Image){
    /*
    New File muss am besten so aussehen.
    newFile = {
        fieldname: req.file.fieldname,
        originalname: uId + "_" + imgNr.toString() + ".jpeg",
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
        size: req.file.size
    }*/

    const blob = profilbilder.file(Image.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.end(Image.buffer);
}

function checkImages(){
  var formData = req.file;
}

async function updateForm(req){
    try {
        let newFile
        let imgNr;
    
        const uId = req.session.user._id
        var formData = req.body;
    
        const user = await mongoHSHLove.userDataCollection.findOne({
          _id: uId,
        })
    
        if (user) {
          try {
    
            //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
            if (user.toJSON().images.length === 0) {
              imgNr = 1
            } else {
              imgNr = (parseInt(user.toJSON().images[user.toJSON().images.length - 1].split("_").pop().split(".")[0]) + 1)
            }
            try {
              if (req.file) {
                newFile = {
                  fieldname: req.file.fieldname,
                  originalname: uId + "_" + imgNr.toString() + ".jpeg",
                  encoding: req.file.encoding,
                  mimetype: req.file.mimetype,
                  buffer: req.file.buffer,
                  size: req.file.size
                }
                uploadImage(newFile)
                /*const blob = profilbilder.file(newFile.originalname);
                const blobStream = blob.createWriteStream();
    
                blobStream.end(newFile.buffer);*/
    
              } else {
    
                throw "error with img";
              }
            } catch (error) {
              console.log(error)
            }
    
          } catch (error) {
    
            // res.status(500).send(error);
          }
          try {
            const data = {
              name: formData.name,
              birthday: formData.birthday,
              description: formData.description,
            }
        
            if (req.file) {
              await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data, $push: { images: newFile.originalname } })
            } else {
              await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data })
            }
    
            res.status(200).send("Success");
          } catch (error) {
    
            res.status(500).send(error);
          }
          
        } else {
          //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
          res.status(500).send("ERROR");
        }
    } catch (e) {
        console.log(e)
    }
}

/*router.get("/upload", async (req, res) => {
    try {
        const [files] = await profilbilder.getFiles();
        res.send([files]);
        console.log("Success");
    } catch (error) {
        res.send("Error:" + error);
    }
});
  
router.post("/personalSpace", multer.single("imgfile"), async (req, res) => {
    try {
      let newFile
      let imgNr;
  
  
      const uId = req.session.user._id
      var { name, birthday, description, password } = req.body;
  
  
  
      const user = await mongoHSHLove.userDataCollection.findOne({
        _id: uId,
      })
      const validPass = await bcrypt.compare(password, user.password)
  
      if (user && validPass) {
        try {
  
          //Datenbankeintrag 'images' letzte nummer rausfinden und um 1 erhöhen
          if (user.toJSON().images.length === 0) {
            imgNr = 1
          } else {
            imgNr = (parseInt(user.toJSON().images[user.toJSON().images.length - 1].split("_").pop().split(".")[0]) + 1)
          }
          try {
            if (req.file) {
              newFile = {
                fieldname: req.file.fieldname,
                originalname: uId + "_" + imgNr.toString() + ".jpeg",
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                buffer: req.file.buffer,
                size: req.file.size
              }
  
              const blob = profilbilder.file(newFile.originalname);
              const blobStream = blob.createWriteStream();
  
              blobStream.end(newFile.buffer);
  
            } else {
  
              throw "error with img";
            }
          } catch (error) {
            console.log(error)
          }
  
        } catch (error) {
  
          // res.status(500).send(error);
        }
        try {
  
          const data = {
            name: name,
            birthday: birthday,
            description: description,
          }
  
  
          if (req.file) {
            await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data, $push: { images: newFile.originalname } })
          } else {
            await mongoHSHLove.userDataCollection.findOneAndUpdate({ "_id": uId }, { $set: data })
          }
  
          //res.status(200).send("Success");
        } catch (error) {
  
          //res.status(500).send(error);
        }
        res.render("home")
      } else {
        //Fehler wenn nutzerbereits existiert und passwörter nicht stimmen
        //res.status(500).send("ERROR");
      }
    } catch (e) {
      console.log(e)
  
    }
})
*/
module.exports ={
    getAllImages,
    updateForm,
    uploadImage
}