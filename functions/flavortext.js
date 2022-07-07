
const Pokedex = require('pokedex-promise-v2');
const translate = require('@k3rn31p4nic/google-translate-api');
var fs = require('fs');

function flavorfinder(message,pm){

var words = message.content.split(' ');
var i=1
var pokemon = ""
var version = ""
var language = ""
while(i<100 && pokemon == ""){
var pokemon= words[i]
i= i+1
}
while(i < 100 && version == ""){
var version = words[i]
i=i+1;
}
while(i < 100 && language == ""){
  var language = words[i]
  i=i+1;
  }
i=0;

if (!pokemon == ""){
  pokemon = pokemon.replace(/[^a-zA-Z0-9- ]/g, "")
  var pokemon = pokemon.toLowerCase();
}else{
  message.reply("Πρέπει να γράψεις τις παραμέτρους της εντολής έτσι ώστε να σου πω το Pokedex entry του pokemon που θα επιλέξεις.")
  return;
}
if (!version == ""){
  version = version.toLowerCase();
  version = version.replace(/[^a-zA-Z0-9 ]/g, "")
}

if (!language == ""){
  language = language.replace(/[^a-zA-Z0-9 ]/g, "")
  language = language.toLowerCase();
}
/*if (!words[1]){
    message.reply("Κάτι πήγε λάθος, πρόσεχε τα κεντά μεταξύ των λέξεων")
    return;
}
*/ 

pm.getPokemonSpeciesByName(pokemon)
.then(function(response) {
  var dexnum = response["id"];
  if (dexnum <= 151){
    var geniden = "1stgen"
  }else if (dexnum>151 && dexnum<=251){
    var geniden = "2ndgen"
  }else if (dexnum>251 && dexnum<=386){
    var geniden = "3rdgen"
  }else if (dexnum>386 && dexnum<=493){
    var geniden = "4thgen"
  }else if (dexnum>493 && dexnum<=649){
    var geniden = "5thgen"
  }else if (dexnum>649 && dexnum<=721){
    var geniden = "6thgen"
  }else if (dexnum>721 && dexnum<=809){
    var geniden = "7thgen"
  }else{
    var geniden = "8thgen"
  }
  const path = require('path')
  let rawdata = fs.readFileSync(path.resolve('/root/profbot/jsonforgens/', 'Dexdictionary.json'));
  let pokemon = JSON.parse(rawdata);
   if (!version){
     var flavorvar = pokemon[geniden]["default"]
     if (typeof flavorvar === "undefined"){
      message.reply("Δεν υπάρχουν στοιχεία για το pokemon αυτό στην κασέτα που έγραψες ή δεν έγραψες σωστά το όνομα της κασέτας");
      return;
    }
    translatext = response["flavor_text_entries"][flavorvar]["flavor_text"].replace(/(\r\n|\n|\r)/gm, " ").replace(/\u000c/gmu, " ")
    message.reply (translatext)
   } else{
     var flavorvar = pokemon[geniden][version]
     if (typeof flavorvar === "undefined"){
       message.reply("Δεν υπάρχουν στοιχεία για το pokemon αυτό στην κασέτα που έγραψες ή δεν έγραψες σωστά το όνομα της κασέτας");
       return;
     }
     translatext = response["flavor_text_entries"][flavorvar]["flavor_text"].replace(/(\r\n|\n|\r)/gm, " ").replace(/\u000c/gmu, " ")
     if (language){
       language = language.toLowerCase()
       translate(translatext, { from: 'en', to: language }).then(res => {
        message.reply (res.text);
        return;
       }).catch(err => {
          console.error(err);
        });
     }else{
      message.reply (translatext);
     }
   }

   }
  )
.catch(function(error){
  console.log(error)
  message.reply("Μάλλον έγραψες λάθος το όνομα του pokemon, δοκίμασε ξανά.");
});
}
module.exports = {flavorfinder}