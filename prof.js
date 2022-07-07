//βιβλιοθήκες και functions που βρίσκονται σε άλλο φάκελο
const Discord = require('discord.js');
var logger = require('winston');
const { StreamTransportOptions } = require('winston/lib/winston/transports');
var fs = require('fs');
var sqlite = require('sqlite3').verbose();
const calcuLator = require('./functions/calcuLator.js');
const pokefacts = require('./functions/pokefacts.js');
const screenfunc = require('./functions/screenfunc');
const deletefunc = require('./functions/deletefunc');
const dbfc = require('./functions/dbfc');
const levelup = require('./functions/levelup');
const flavortext = require('./functions/flavortext');
const Pokedex = require('pokedex-promise-v2');
const { type } = require('os');
//const calender = require('../useful-scripts/calender');
const tweet = require('./functions/tweet');
const talkedRecently = new Set();
const pm = new Pokedex();
const client = new Discord.Client();
const { token } = require('./token.json');

//tweet.tweet(client);
//calender.calenderauth();

//Event: Όταν το bot συνδέεται στο discord (offline --> online)
client.login(token);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('γράψε ;helprof για βοήθεια.');
});

//Event: Οταν το bot αποσυνδέεται απο το discord (online --> offline)
client.on('disconnected', function() {
  client.login(token)
	.catch(console.error);
});

//Event: Όταν το μποτ μπαίνει σε έναν σέρβερ
client.on("guildCreate", guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  //Γράφει σε μια βάση δεδομένων (πίνακας 1) το id, το όνομα του σέρβερ και το όνομα του ανθρώπου που έχει τον σέρβερ
  //let channel = client.channels.cache.get(guild.systemChannelID || channelID);
  channel.send(`Ευχαριστώ για την πρόσκληση. Παρακαλώ γράψε ;helprof, ;helprof mod αν είσαι συντονιστής ή ;helprof owner αν είσαι ο ιδιοκτήτης για να δεις μερικές απο τις λειτουργίες μου.`);
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
  db.serialize(function(){
    var smmt = db.prepare("INSERT OR REPLACE INTO Serverinfo VALUES(?,?,?)");
      smmt.run(guild.id, guild.name , guild.ownerID);
      smmt.finalize();
  })
  db.close();
})

//Event: Όταν ένα νέο μέλος μπαίνει στον σέρβερ
client.on("guildMemberAdd", member  => {
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  var serverid = member.guild.id
  const sql = 'SELECT * FROM blacklist WHERE userid = ? AND serverid = ?';
  db.all(sql,[member.id , serverid ], function(error,rows){
    if (rows.length > 0){
      member.kick("Αυτόματο από το bot, λόγω blacklist")
      return;
    }
    return;
  })
  db.close() 
 var welcometable = [`Καλώς ήρθες στην κοινότητα Pokemon-Go, ${member} ! Είμαι ο Προφέσορας. Για να γίνεις μέλος της κοινότητας θα θέλαμε να στείλεις σε αυτό το κανάλι ενα screenshot με του προφιλ σου στο Pokemon-go. \n\nfor english type ;eng`,
 `Δεν νομίζω να έχουμε γνωριστεί ακόμα, ${member}, εγώ είμαι ο Προφέσορας το μποτάκι γενικής χρήσεως αυτού εδώ του Server, δυστυχώς όταν δεν είσαι γραμμένος στον Server δεν μπορείς να δεις τα υπόλοιπα κανάλια, το να γραφτείς είναι εύκολο, Απλά στείλε ένα screenshot του προφιλ σου στο Pokemon-go σε αυτό εδώ το κανάλι και είσαι έτοιμος.\n\nfor english, type ;eng`,
 `Ωπ, ένας άγριος ${member} εμφανίστηκε! Ας συστηθώ ωστόσο γιατί μόνο αυτό ξέρω να κάνω σε αυτήν την λειτουργία, είμαι ο Προφέσορας, για να γίνεις μέλος στην κοινότητα (και να ξεκλειδώσεις τα υπόλοιπα κανάλια πρέπει να ''γραφτείς''. Αυτό το κάνεις απλά στέλνοντας ένα screenshot απο το προφιλ σου στο pokemon-go και είσαι έτοιμος.\n\nfor english, type ;eng`,
 `Καλώς τον ${member}, κι άρχισα να νιώθω μόνος. Είμαι ο Προφέσορας, το πιο cringe μποτάκι που υπάρχει, επίσης βοηθάω στον σέρβερ... κάπως. Για να πάρεις μέρος στην κοινότητα απλά στέλνεις σε αυτό εδώ το κανάλι ένα screenshot με το προφιλ σου στο Pokemon-go κι εγώ θα φτιάξω τα υπόλοιπα.\n\nfor english, type ;eng`
 ] 
 var randomizer = Math.floor(Math.random() * welcometable.length);
 dbfc.welcomechannelid(member,randomizer,client,welcometable)
 
});

//Event: όταν το στέλνετε κάποιο μήνυμα που το μποτάκι μπορεί να διαβάσει
client.on("message", message => {
  var prefix = ';';
  const nosferatuid = '364525165863895041';
  if (message.guild == null){
    return;
  }

  dbfc.blockMessage(message);

  //Ο Αλγόριθμος που είναι υπεύθυνος για την αρχικοποίηση ενός server, ο ιδιοκτήτης του server πρέπει να του πει με κατάλληλη σειρά τα ονόματα και τους βαθμούς που πρέπει να αντιστοιχηστούν 
  //για να λειτουργεί 100% το bot
  //ΠΡΟΣΟΧΗ: ΦΑΙΝΕΤΑΙ ΝΑ ΕΧΕΙ ΠΡΟΒΛΗΜΑ ΟΤΑΝ ΔΕΝ ΕΧΕΙ ΟΛΑ ΤΑ PERMISSIONS
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  if ((message.content.startsWith(prefix + "init")) && (message.author.id === message.guild.ownerID)){
    dbfc.dbInit(message, prefix);
   }

  //κάθε φορά που διαβάζει ένα μήνυμα το bot, βρίσκει το id του server μέσω του μηνύματος που έστειλε ο χρήστης, τότε ψάχνει τον δεύτερο πίνακα στην βάση δεδομένων και ανακαλεί ότι id έχει αποθηκεύσει για τον εκάστοτε σέρβερ.
  //Σημείωση, στον πρώτο πίνακα το server id είναι το primary key, ενω στον δεύτερο πίνακα, το server id είναι το foreign key.
  if (!message.guild)return;
  const sql = 'SELECT * FROM channelid WHERE Serverid = ?';
   db.all(sql,[message.guild.id], function(error,rows){
     //σταματάει εδώ
   rows.forEach(function(row){
      var   welcome_ch = row.welcome
      var   showoff_ch = row.showoff
      var   hundo_ch = row.hundo
      var   levelreport_ch = row.levelreportchannel
      var   valor_ro = row.valor
      var   mystic_ro = row.mystic
      var   instinct_ro = row.instinct
      var   admin_ro = row.admin
      var   mod_ro = row.mod
      var   prefix = row.prefix
      db.close(); 
      //αν ο εαυτός του έγραψε το μήνυμα, το αγνοεί
      if (message.author.bot) return;

      //Αλγόριθμος OCR
      if ((message.channel.id == welcome_ch) && ((message.attachments.size > 0))){
        screenfunc.readScreenshot(message, valor_ro, mystic_ro, instinct_ro).then(text => {})
          return;   
      }

      //Διοθρώνει ένα κανάλι το οποίο έχει μπει λάθος στο init.
      if ((message.content.startsWith(prefix + "correct")) && (message.author.id === message.guild.ownerID || message.member.roles.cache.has(mod_ro)  || message.member.roles.cache.has(admin_ro)  )){
        dbfc.corrector(message,prefix)
       }
      
      //θέτει ένα κανάλι για τα νέα απο το twitter.
      if ((message.content.startsWith(prefix + "setnews")) && (message.author.id === message.guild.ownerID || message.member.roles.cache.has(mod_ro)  || message.member.roles.cache.has(admin_ro)  )){
        var words = message.content.split(' ');
        var i=1
        var news_ch = ""
        while(i<100 && news_ch == ""){
          var news_ch = words[i]
          i= i+1
        }
        i=0;
        
        if (!news_ch == ""){
          news_ch = news_ch.toLowerCase()
          var newschanfound = message.guild.channels.cache.find(channel => channel.name == news_ch);
          if (newschanfound == null){
            message.reply("Δεν μπόρεσα να διαβάσω το όνομα του καναλιού")
            return;
          }
          var guildid = message.guild.id;
          let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
          db.serialize(function(){
            var smmt = db.prepare("INSERT OR REPLACE INTO news VALUES(?,?)");
            smmt.run(guildid , newschanfound.id);
            smmt.finalize();
            message.delete();
            message.author.send(`Το κανάλι για τα νέα αποθηκεύτηκε με επιτυχία στην βάση δεδομένων`);
          })
          db.close();
        }else{
          message.reply("Πρέπει να γράψεις το όνομα του καναλιού που θα ήθελες να έρχονται τα νέα για το Pokemon-go.")
          return;
        }
      }
      

      //Αν το μέλος με ένα συγκεκριμένο προαναφερθέν id και ποστάρει μια φωτογραφία στο κανάλι το bot αντιδράει.
      if ((message.channel.id == showoff_ch) && (message.author.id === nosferatuid)){
          if(message.attachments.size > 0){
          message.react('😒')
          .catch(console.error);
          return;
        } 
      }

      //οποιοδήποτε άλλο μέρος που ποστάρει στο συγκεκριμένο κανάλι παίρνει διαφορετική αντίδραση
      if (message.channel.id == showoff_ch){
        if(message.attachments.size > 0) {
          message.react('✨')
          .catch(console.error);
          return;
        }
      }

      //Στο κανάλι των hundo κάνει μια παρόποια αντίδραση με το παραπάνω.
      if(message.channel.id == hundo_ch){
        if(message.attachments.size > 0){
          message.react('💯')
            .catch(console.error);
            return;
          }
        }

        //το μποτάκι επαναλαμβάνει ότι είναι μετά το "repeat" και διαγράφει το αρχικό μήνυμα, δεν είναι τόσο καλό διότι φαίνεται στις ειδοποιήσεις ποιος έδωσε το μήνυμα
        if((message.content.startsWith(prefix + "repeat")) && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro))){
          var repeatable = message.content.split(`${prefix}repeat `);
          var repeat = repeatable[1];
          message.channel.send(repeat).catch(console.error);
          message.delete()
          return;
        }

        //το μποτάκι δίνει μια τυχάια πρόταση για τα pokemon, ο πίνακας υπάρχει σε άλλον φάκελο.
        if(message.content.startsWith(prefix + "pokefacts") || message.content.startsWith(prefix + "pokefact")){
          let tmp = pokefacts.pokeFacts();
          message.reply(tmp.facts[tmp.fact]);
          return;
        }

      //Για τους τουρίστες που δεν μπορούν να διαβάσουν το welcome message, αν ο χρήστης γράψει ;eng στο κανάλι καλοσορίσματος, βγαίνει ένα μήνυμα στα αγγλικά.
      if((message.channel.id == welcome_ch) && (message.content.startsWith(";eng"))){
        message.reply(`Welcome to the Community of Pokemon-go, my name is "The Professor", a bot made for this server for your convinience. In order to gain access to the other channels of the community you will first need to register. you can do it just sending a screenshot of your Pokemon-go profile and I will do the rest.`);
        return;
      }
      
      //Βάζει έναν χρήστη στην βάση δεδομένων του blacklist. Όποιος είναι σε αυτήν την βάση δεν μπορεί να μιλήσει στον σέρβερ που τον απέβαλλε , αλλά ούτε να ξαναμπεί άμα φύγει
      if (message.content.startsWith(prefix + "blacklist") && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro) || message.author.id === message.guild.ownerID)){
        dbfc.blackList(message,client)
      }
      
      //Αναίρεση του Blacklist
      if (message.content.startsWith(prefix + "whitelist") && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro)|| message.author.id === message.guild.ownerID)){
        dbfc.whiteList(message,client);
      }

      //Στέλνει στον χρήστη μια λίστα με όλους αυτούς που έχουν μπαναριστεί στον σέρβερ.
      if (message.content.startsWith(prefix + "showlist") && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro)|| message.author.id === message.guild.ownerID)){
        dbfc.showList(message);
      }

      //Οταν ο χρήστης γράψει σε ένα προκαθορισμένο απο την αρχικοποίηση κανάλι την εντολή levelup [αριθμος] θα αλλάξει το επίπεδο του σε αυτό που καθόρισε ο ίδιος και ύστερα το μποτ
      //θα στείλει στην αλλαγή αυτή σε ένα άλλο κανάλι για επιτήριση από admin ή mod
      if (message.content.startsWith(prefix + "levelup")){
        if (talkedRecently.has(message.author.id)) {
          message.author.send("Η εντολή αυτή μπορεί να ενεργοποιηθεί μια φορά κάθε 24 ώρες απο κάθε χρήστη.");
          message.delete();
        }else{
          levelup.updateLevel(message, client, levelreport_ch, talkedRecently);
          talkedRecently.add(message.author.id);
          setTimeout(() => {
            talkedRecently.delete(message.author.id);
          }, 86400000);
        }
      }

      //Το μποτάκι μπορεί να διαγράφει μαζικά μηνύματα
      if (message.content.startsWith(prefix + "bulkdelete") && (message.member.roles.cache.has(admin_ro) || (message.author.id === message.guild.ownerID) || (message.member.roles.cache.has(mod_ro)))){
        deletefunc.bulkdelete(message,prefix);
      }
      
      //To Μποτάκι αλλάζει το prefix του Server.
      if ((message.content.startsWith(prefix + "changeprefix")) && (message.member.roles.cache.has(admin_ro) || (message.author.id === message.guild.ownerID)) ){
        var words = message.content.split(' ');
        var newprefix = words[1];
        dbfc.dbPrefix(message, prefix, newprefix)
      }

      //Το bot γράφει το username και το friendcode (τις λέξεις δηλαδή μετά το dbres) στην βάση δεδομένων
      if ((message.content.startsWith(prefix + "dbres")) && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro))){
        dbfc.dbRegister(message)
      }
      
      //Γράφει τον Χρήστη της εντολής στην βάση δεδομένων του Server.
      if (message.content.startsWith(prefix + "regme")){
        dbfc.registerMe(message)
      }

      //το μποτάκι δίνει το friend-code του username που έχει γίνει registered
      if ((message.content.startsWith(prefix + "givefc"))){
        dbfc.dbGivedata(message)
      };

      //Υπολογίζει μόνο του τι αδυναμίες κάθε pokemon η του τύπου η συνδιασμό τύπων που θα γράψει ο χρήστης
      if (message.content.startsWith(prefix + "counter")){
        var words = message.content.split(' ');
        var i=1
        var type1 = ""
        var type2 = ""
        while(i<100 && type1 == ""){
          var type1 = words[i]
         i= i+1
        }
        while(i < 100 && type2 == ""){
         var type2 = words[i]
         i=i+1;
          }
        i=0;
        if (!type1 == ""){
          type1 = type1.replace(/[^a-zA-Z- ]/g, "")
          type1 = type1.toLowerCase();
        }else{
          message.reply("Πρέπει να γράψεις κάτι μετά το counter για να υπολογίσω αδυναμίες.")
          return;
        }
        if (!type2 == ""){
          type2 = type2.toLowerCase();
          type2 = type2.replace(/[^a-zA-Z0-9]/g, "")
        }

        if (type1 === "pokemon"){
        pm.getPokemonByName(type2)
        .then(function(response){
          let tmp = [];
          response["types"].forEach(type => {
            tmp.push(type["type"]["name"]);
            })
          outPut(calcuLator.calcuLator(tmp));
          })
        .catch(function(error){
          message.reply("Μάλλον έγραψες λάθος το όνομα του pokemon, δοκίμασε ξανά.");
          });
        }else if ( !type2 || type1 === type2){
          let tmp_data = calcuLator.calcuLator (type1)
          if (tmp_data.count < 1){
           message.reply("Ο τύπος που έγραψες δεν είναι σωστός.");
          }else{
          outPut(tmp_data)
          }
        }else if (type2){ 
          let tmp_data = calcuLator.calcuLator(type1, type2);
          if (tmp_data.count === 2){
            outPut(tmp_data)
          }else{
            message.reply("Κάποιος απο τους τύπους που έγραψες είναι λάθος");
          }
        } 

        //Το Function το οποίο στέλνει τις πληροφορίες των αδυναμειών του pokemon σε μήνυμα, με συγκεκριμένο format, επίσης διαγράφει οποιαδήποτε γραμμή έχει x1, δηλαδή όταν το pokemon/τυπος παίρνει κανονική ζημιά απο έναν τύπο κίνησης
        function outPut (data){
        var preFab = `\n<:normal:624712757496905729>: x${data.normal}\n<:fire:624712757329264650>: x${data.fire} \n<:water:624712756834336788>: x${data.water}\n<:electr:624712757974925313>: x${data.electr} \n<:grass:624712758973169685>: x${data.grass} \n<:ice:624712757006172174>: x${data.ice} \n<:fight:624712757928919061>: x${data.fight} \n<:poison:624712758885220382>: x${data.poison} \n<:ground:624712758314926084>: x${data.ground} \n<:flying:624712757391917058>: x${data.flying} \n<:psychc:624712758520446992>: x${data.psychc} \n<:bug:624712756582547456>: x${data.bug} \n<:rock:624712758847602698>: x${data.rock} \n<:ghost:624712756699856907>: x${data.ghost} \n<:dragon:624712756821622786>: x${data.dragon} \n<:dark:624688707135471624>: x${data.dark} \n<:steel:624712757555625985>: x${data.steel} \n<:fairy:624712758641950721>: x${data.fairy}`;
        var pfArray = preFab.split('\n');
        var output = [];
        pfArray.forEach(
          (line) => {
            line = line.trim();
            pfArray[pfArray.indexOf(line)] = line;
            if(line.endsWith("x1")){
              //Κενό
            }else{
              output.push(line);
            }
          })
          message.reply(output);
        }
      }

      //Στέλνει μια εικόνα με το sprite της εικόνας του pokemon στην shiny μορφή του.
      if (message.content.startsWith(prefix + "shiny")){
        var words = message.content.split(' ');
        var i=1
        var type1 = ""
        while(i<100 && type1 == ""){
          var type1 = words[i]
         i= i+1
        }
        if (!type1 == ""){
          type1 = type1.replace(/[^a-zA-Z-]/g, "")
          type1 = type1.toLowerCase();
        }else{
          message.reply("Πρέπει να γράψεις κάτι μετά το 'Shiny' για να σου δείξω το shiny pokemon που επιθυμείς.")
          return;
        }
        
        pm.getPokemonByName(type1)
        .then(function(response,error){
          const attachment = new Discord.MessageAttachment(response["sprites"]["front_shiny"]);
          const attachment2 = new Discord.MessageAttachment(response["sprites"]["front_default"]);
          if (!response["sprites"]["front_shiny"]){
            message.reply(`Δεν έχω την εικόνα ενός shiny ${type1} στην βάση δεδομένων μου.`);
          }else{
            message.reply(`Ορίστε η διαφορά μεταξύ ενός κανονικού και ενός shiny ${type1}:` , attachment2).then(setTimeout(function(){ message.reply(attachment)}, 1000));
          }
        })
        .catch(function(error) {
          message.reply("Μάλλον έγραψες λάθος το όνομα του pokemon, δοκίμασε ξανά.");
        });
      }
      
      //Στέλνει τις πληροφορίες του pokedex ενός Pokemon, υπάρχει επιλογή να στείλει απ'ολες τις κασέτες και μεταφρασμένο σε google translate σε όλες τις γλώσσες.
      if (message.content.startsWith(prefix + "dexentry")){
        flavortext.flavorfinder(message,pm);
      }

      //Εντολή βοήθειας απο το μποτ.
      if(message.content.startsWith(prefix + "helprof")){
        var ourtext = `Ορίστε μια λίστα με τα commands τα οποία λειτουργώ: \n${prefix}counter [type] [type] : Δίνω σε τι τύπους επιθέσεων έχει αδυναμίες το Pokemon που έχει τους τύπους που θα γράψεις.(παράδειγμα: ${prefix}counter dragon flying)\n${prefix}counter pokemon [Pokemon's name] : Δίνω σε τι τύπους επιθέσεων έχει αδυναμία ένα οποιοδήποτε pokemon.\n${prefix}shiny [Pokemon's name] : Δείχνω με εικόνα πως μοιάζει ένα συγκεκριμένο pokemon όταν είναι shiny. (παράδειγμα: ${prefix}shiny bulbasaur)\n${prefix}dexentry [pokemon's name][version][language] : Δίνω το τι λέει το pokedex για ένα συγκεκριμένο pokemon, η εντολή μπορεί να γραφτεί μόνο με το όνομα του pokemon αλλιώς μπορούν να μπουν 2 παράμετροι, την κασέτα η οποία θα χρησιμοποιηθει και την γλώσσα στην οποία θα μεταφραστεί το κείμενο του pokedex. (πχ: ${prefix}dexentry heatran pearl el.)\n${prefix}pokefacts : Δίνω μια τυχαία (και μάλλον άχρηστη) πληροφορία για τον κόσμο των Pokemon.\n${prefix}levelup [αριθμός] : Αυξάνω ή μειώνω το επίπεδο του χρήστη στο nickname του με τον αριθμό που αυτός έγραψε, μπορεί να χρησιμοποιηθεί μια φορά την μέρα από τον κάθε χρήστη. (πχ: ${prefix}levelup 38.\n${prefix}givefc [username]: Χρησιμοποιεί μια παράμετρο, το όνομα που θα γράψει ο χρήστης και εγώ στέλνω το friend code του ατόμου αυτού.(πχ: ${prefix}givefc panos123)\n${prefix}regme [friendcode] : Γράφει το nickname του χρήστη μαζί με το friendcode που έβαλε στην βάση δεδομένων. Η μόνη παράμετρος που χρειάζεται είναι το Friendcode του χρήστη με ενωμένους του αριθμούς (χωρίς κενά ή παύλες ανάμεσα)(πχ: ${prefix}regme 123412341234)`
        var ownertext = `Aν δεν το έχεις κάνει ήδη πρέπει να με αρχικοποιήσεις στα κανάλια του Server.\n Αυτό το κάνεις γράφοντας με μια συγκεκριμένη σειρά τα ονόματα και τους ρόλους για τον σέρβερ σου.\nμαζί με την εντολή ${prefix}init. Η σειρά πάει ως εξείς: ${prefix}init [Κανάλι για καλοσορίσμα] [κανάλι για showoff] [κανάλι που ποστάρονται τα hundo] [κανάλι που αναφέρονται οι αλλαγές στο επίπεδο του καθενός με την εντολή ${prefix}levelup] [ρόλος valor] [ρόλος mystic] [ρόλος instinct] [ρόλος διαχειριστών Σερβερ] [ρόλος συντονιστών Σερβερ] . Αν έκανες λάθος σε κάποια απο τις παραμέτρους μπορεις να κάνεις όποτε θες ξανά ${prefix}init αλλίως γράψε ${prefix}correct [όνομα καναλιού η ρόλου που θες να διορθώσεις] = [όνομα καναλιού η ρόλου που έχει ο σέρβερ σου], για περισσότερες πληροφορίες γράψε ${prefix}correct και άσε ένα κενό`
        var admintext = `Αυτές είναι οι εντολές που μπορούν να χρησιμοποιηθούν μόνο απο τους admin και moderators του server.\n${prefix}bulkdelete: Διαγράφει μαζικά τα μηνύματα στο κανάλι το οποίο γράφτηκε η εντολή αυτή. Η μόνη παράμετρος που μπαίνει δίπλα είναι το αριθμός των μηνυμάτων που θέλει ο χρήστης να σβηστούν(πχ: ${prefix}bulkdelete 10)\n${prefix}repeat : Γράφω αυτό που έγραψες μετά το repeat και το επαναλαμβάνω, διαγράφοντας στην συνέχεια το μήνυμα σου(για κανέναν λόγο)(πχ: ${prefix}repeat Γεία, τι γίνεται)\n${prefix}dbres: Γράφει στην βάση δεδομένων το username και το friendcode ενός μέλους, μπορεί να ανακαλεστεί μετά με την εντολή ${prefix}givefc.(πχ: ${prefix}dbres antonis123 000011112222)\n${prefix}changeprefix : αλλάζει το σύμβολο το οποίο χρειάζεται για να δω μια εντολή στα μηνύματα(Το προεπιλεγμένο είναι ";"(πx:${prefix}changeprefix %)\n${prefix}blacklist [ονομα]: προσθέτει έναν χρήστη στην μαύρη λίστα, χάνοντας τον δικαίωμα να γράφει στον σέρβερ ή να ξαναμπει στον σέρβερ όταν φύγει(είναι case-sensitive). Για να αφαιρεθεί απο την μαύρη λίστα ένας παίκτης και να μπορεί να ξαναμιλήσει/ξαναμπει στον σερβερ, η εντολή είναι\n${prefix}whitelist [ονομα] (πχ: ${prefix}blacklist Takis).\n ${prefix}showlist: Δεν χρειάζεται παραμέτρους, απλά στέλνει το όνομα των ατόμων που έχουν μπει στην μαύρη λίστα του server.)`
        if (message.content.includes("owner") && message.author.id === message.guild.ownerID){
          message.author.send(ownertext);
          return;
        }else if(message.content.includes("mod") && (message.member.roles.cache.has(mod_ro) || message.member.roles.cache.has(admin_ro))){
          message.author.send(admintext);
          return;
        }else{
         message.author.send(ourtext)
        .catch(console.error);
        }
      }
    })
  })
})