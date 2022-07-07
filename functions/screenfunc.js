const Discord = require('discord.js');
const sharp = require('sharp');
const path = require('path')
const getColors = require('get-image-colors')
const tesseract = require("node-tesseract-ocr")
const fs = require('fs');
const Axios = require('axios')
const Jimp = require("jimp")
const stringSimilarity = require('string-similarity');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const config = {
  lang: "engrestrict_best_int",
  oem: 1,
  psm: 3,
}

async function downloadImage(url, path) {
  const writer = fs.createWriteStream(path)

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function convertImage(url,img){
  let p = new Promise(async (resolve, reject) => {
    if(url.endsWith(".png")){
      Jimp.read(img)
        .then(image => {
          image.write(img);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
    }
    else {
      resolve();
    }
  });
  
  return p;
}


async function readScreenshot(message, valor_ro, mystic_ro, instinct_ro) {
  let mildate = Date.now();
  let originalImage = `./functions/screenshot/tmp_scrsht_${mildate}.jpg`;
  await downloadImage(message.attachments.first().url, originalImage);
  await downloadImage(message.attachments.first().url, `./functions/screenshot/tmp_scrsht_${mildate}_og.jpg`);
  await convertImage(message.attachments.first().url, originalImage);
  let outputImage = `./functions/screenshot//tmp_scrsht_${mildate}_cropped.jpg`;
  let outputImagelevel = `./functions/screenshot//tmp_scrsht_${mildate}_cropped-level.jpg`;
  await timeout(1200);
  await sharp(originalImage).resize({ height: 1000 }).extract({ width : 300, height:250 , left: 5, top: 100}).toFile(outputImage)
  .catch(err => {
    console.error(err);
  })
  tesseract.recognize(outputImage, config)
    .then(text => {
       var  text = text.replace(/[^a-zA-Z0-9 &]/g," ")
        var tex2 = text.replace(/(\b(\w{1,4})\b(\s|$))/g,'',"")
        var newtext = tex2.split(' ')
        var i=0
        var newtextion = ''
        while(i<100 && newtextion == ''){
          var newtextion = newtext[i]
          i= i+1
        }
        i=0;
        var username = newtextion || "Άγνωστο"
      
      if (username === "άγνωστο"){
        message.reply("Δεν μπόρεσα να ανιχνεύσω το όνομα");
      } else{
        message.member.setNickname(username+" | "+"level");
      }
      
    //fs.unlinkSync(`croppedImage.jpg`);
  })
  .catch(err => {
    console.error(err);
  })


  await sharp(originalImage).sharpen(6).toFile(outputImagelevel)
  .catch(err => {
    console.error(err);
  })
  tesseract.recognize(outputImagelevel, {lang: "engrestrict_best_int", oem: 3, psm: 12,})
  .then(text => {
    let level = 0;
    let newtext = text.replace(/\n*/gm, "");

    //Begin block find match
    let match = newtext.match(/(?<level>\d+)(?<spacingTXT>\n*|\s*|\t*|\r*|[a-zA-Z]*)(?<levelTXT>LEVEL|Level)/m);
    if (match && match.hasOwnProperty("groups") && 'level' in match.groups){
      level = match.groups.level;
    } else {
      match = newtext.match(/(?<levelPre>[\da-zA-Z]*?)(?<level>\d+)(?<spacingTXT>\n*|\s*|\t*|[a-zA-Z]*)(?<extrasTXT>[a-zA-Z]*)(?<levelTXT>LEVEL|Level)/m);
      try {
        level = match.groups.level;
        return;
      } catch (error) {}
      match = newtext.match(/(?<levelPre>[\da-zA-Z]*?)(?<level>\d+)(?<spacingTXT>\n*|\s*|\t*|[a-zA-Z]*)(?<extrasTXT>[a-zA-Z]*)(?<levelALT>[a-zA-Z-]*)/mg);

      let highestSML = 0;
      let selectedMatch = null;
      for(let i=0; i<match.length; i++){
        let internalMatch = match[i].match(/(?<number>\d+)(?<extras>[a-zA-Z0-9]*)/m);
        if (internalMatch && internalMatch.hasOwnProperty("groups")&&(highestSML < stringSimilarity.compareTwoStrings('level', internalMatch.groups.extras)|| highestSML < stringSimilarity.compareTwoStrings('level', internalMatch.groups.extras.toLowerCase()))){
          highestSML = stringSimilarity.compareTwoStrings('level', internalMatch.groups.extras);
          selectedMatch = internalMatch;
        }
      }
      if (selectedMatch) {
        level = selectedMatch.groups.number;
      }
    }
    //End block find match

    if ((level>40 || level<1) || level === "level"){
      message.reply(`Δεν μπόρεσα να ανιχνεύσω το επίπεδό σου.`)
      fs.readdir('/root/profbot/functions/screenshot', (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join('/root/profbot/functions/screenshot', file), err => {
            if (err) throw err;
          });
        }
      });
    }else{
      nickname = message.guild.members.cache.get(message.author.id).displayName
      var words= nickname.split(' ');
      var name = words[0];
      message.member.setNickname(name+" | "+level)
      fs.readdir('/root/profbot/functions/screenshot', (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join('/root/profbot/functions/screenshot', file), err => {
           if (err) throw err;
          });
        }
      });
    }
  })
  .catch(err => {
    console.error(err);
  })
  

  getColors(path.join(outputImage)).then(colors => {
    checker = colors[0].alpha(0.5).css()
    var newtext =  checker.replace(/\D/g,' ')
    var finalstring = newtext.split(' ')
    var red = finalstring[5]
    var green = finalstring[6]
    var blue = finalstring [7]
    if (red> blue && green > blue){
      message.member.roles.add(instinct_ro)
      .catch(console.error)
      if (isNaN(instinct_ro)){
        message.reply('Το id της ομάδας δεν βρέθηκε, παρακαλώ επικοινωνήστε με τους admin έτσι ώστε να βάλουν το σωστό όνομα');
      }
      }else if(blue>red && blue > green){
      message.member.roles.add(mystic_ro)
      .catch(console.error)
      if (isNaN(mystic_ro)){
        message.reply('Το id της ομάδας δεν βρέθηκε, παρακαλώ επικοινωνήστε με τους admin έτσι ώστε να βάλουν το σωστό όνομα');
      }
    
    }else if (red > blue && red > green){
      message.member.roles.add(valor_ro)
      .catch(console.error)
      if (isNaN(valor_ro)){
        message.reply('Το id της ομάδας δεν βρέθηκε, παρακαλώ επικοινωνήστε με τους admin έτσι ώστε να βάλουν το σωστό όνομα');
      }
    }else{
      message.reply('υπήρξε κάποιο πρόβλημα στην ανίχνευση της ομάδας.');
    } 
  })
  .catch(function(err) {
      console.log("An error occured");
      console.log(err);
  })


}


module.exports = {readScreenshot}