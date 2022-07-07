var sqlite = require('sqlite3').verbose();

function dbInit(message, prefix){
  var words = message.content.split(' ');
  if(typeof words[1] === "undefined" || typeof words[8] === "undefined"){
    message.author.send("Έχεις κάνει λάθος με τα κενά, χρειάζομαι 13 ονόματα καναλιών με κενά ανάμεσα.")
    return;
  }
  var welcomechannel = message.guild.channels.cache.find(channel => channel.name == words[1]) || "nowelcome";
  var showoffchannel = message.guild.channels.cache.find(channel => channel.name == words[2]) || "noshowoff";
  var hundochannel = message.guild.channels.cache.find(channel => channel.name == words[3]) || "nohundo";
  var levelchangereportchannel = message.guild.channels.cache.find(channel => channel.name == words[4]) || "nolevelreport";
  var valorid = message.guild.roles.cache.find(r => r.name === words[5]) || "novalor";
  var mysticid = message.guild.roles.cache.find(r => r.name === words[6])|| "nomystic";
  var instinctid = message.guild.roles.cache.find(r => r.name === words[7])|| "noinstinct";
  var adminid = message.guild.roles.cache.find(r => r.name === words[8]) || "noadmin";
  var modid = message.guild.roles.cache.find(r => r.name === words[9]) || "nomod";
  var welcomeinit = welcomechannel.id || "nowelcome"
  var showoffinit = showoffchannel.id || "noshowoff"
  var hundoinit = hundochannel.id || "nohundo"
  var levelreportinit = levelchangereportchannel.id || "nolevelreport"
  var valorinit = valorid.id || "novalor"
  var mysticinit = mysticid.id || "nomystic"
  var instinctinit = instinctid.id || "noinstinct"
  var admininit = adminid.id || message.guild.ownerID
  var modinit = modid.id || "nomod"
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  db.serialize(function(){
    var smmt = db.prepare("REPLACE INTO channelid VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");
      smmt.run(message.guild.id, message.guild.name,  prefix, welcomeinit, showoffinit, hundoinit, levelreportinit,valorinit,mysticinit,instinctinit,admininit,modinit);
      smmt.finalize();
      message.author.send(`Η αρχικοποίηση των παραμέτρων στον Σέρβερ με όνομα ${message.guild.name} έγινε με επιτυχία!.`);
  })
  db.close();
}

function dbPrefix(message,prefix, newprefix){
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  db.serialize(function(){
   var smmt = db.prepare("UPDATE channelid SET prefix = REPLACE(prefix,?,?) WHERE serverid = ?");
    smmt.run(prefix, newprefix , message.guild.id);
    smmt.finalize();
    message.author.send(`Το σύμβολο άλλαξε απο ${prefix} σε ${newprefix}`);
  })
 db.close();
}

function registerMe(message){
  nickname = message.guild.members.cache.get(message.author.id).displayName
  var words= nickname.split(' ');
  var name = words[0];
  var serverid = message.guild.id;
  var commandline = message.content.split(' ');
  var friendcode = ""
  i=1;
  while(i < 100 && friendcode == ""){
    var friendcode= commandline[i]
    i=i+1;
  }
  i=0;
  
  if (!name == ""){
    name = name.toUpperCase();
    name = name.replace(/[^a-zA-Z0-9]/g, "")
  }else{
    message.reply("Δεν μπόρεσα να διαβάσω το όνομα σου.")
    return;
  }
  if (!friendcode == ""){
    friendcode = friendcode.replace(/[^a-zA-Z0-9 ]/g, "")
  }else{
    message.reply("Πρέπει να γράψεις το friend code σου, χωρίς κενά ανάμεσα στους αριθμούς.")
    return;
  }
  if ((name.length > 15) || isNaN(friendcode) || friendcode.length != 12){
    message.delete();
    message.author.send(`Η εγγραφή δεν έγινε σωστά, αυτό οφείτεται μάλλον στο γεγονός οτί: το friend code δεν ειναι αριθμός, το username του χρήστη δεν έχει διαβαστεί σωστά, ή το friendcode είναι πάνω απο 9 χαρακτήρες.`)
    return;
  }
  let db = new sqlite.Database('./databases/playerdb', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  const sql = 'SELECT friendcode FROM playerdb WHERE username = ? AND serverid = ?';
  db.all(sql,[name,message.guild.id], function(error,rows){
    if (rows.length > 0){
      message.author.send(`Το όνομα ${name} υπάρχει ήδη στην βάση δεδομένων. Αν το Friend Code σου δεν είναι σωστό, ενημέρωσε ένας Admin ή mod του Σερβερ για να το αλλάξουν.`).then(message.delete());
      db.close()
      return; 
    }else{
      db.serialize(function(){
     var smmt = db.prepare("INSERT OR REPLACE INTO playerdb VALUES(?,?,?)");
     smmt.run(name, friendcode,serverid);
     smmt.finalize();
     message.delete();
     message.author.send(`Η εγγραφή σου έγινε με επιτυχία.`);
     db.close();
    })
    }
  })
} 

function dbRegister(message){
  var words = message.content.split(' ');
  var i=1
  var username = ""
  var friendcode = ""
  while(i<100 && username == ""){
    var username= words[i]
    i= i+1
  }
  while(i < 100 && friendcode == ""){
    var friendcode= words[i]
    i=i+1;
  }
  i=0;
  
  if (!username == ""){
    username = username.toUpperCase();
    username = username.replace(/[^a-zA-Z0-9- ]/g, "")
  }else{
    message.reply("Πρέπει να γράψεις το όνομα του χρήστη και το friend code του.")
    return;
  }
  if (!friendcode == ""){
    friendcode = friendcode.replace(/[^a-zA-Z0-9 ]/g, "")
  }else{
    return;
  }

  if ((username.length > 15) || isNaN(friendcode) || friendcode.length != 12){
    message.delete();
    message.author.send(`Η εγγραφή του χρήστη ${username} δεν έγινε σωστά, αυτό οφείτεται μάλλον στο γεγονός οτί: το friend code δεν ειναι αριθμός, το username του χρήστη είναι πάνω απο 15 χαρακτήρες, ή το friendcode είναι πάνω απο 9 χαρακτήρες.`)
    return;
  }
  
  let db = new sqlite.Database('./databases/playerdb', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
  db.serialize(function(){
    var smmt = db.prepare("INSERT OR REPLACE INTO playerdb VALUES(?,?,?)");
    smmt.run(username, friendcode,message.guild.id);
    smmt.finalize();
    message.delete();
    message.author.send(`Η εγγραφή του χρήστη ${username} έγινε με επιτυχία. Αν ο χρήστης η το friend code υπάρχει ήδη στην βάση, θα αντικατασταθούν από την νέα καταχώριση`);
  })
  db.close();
}

function dbGivedata(message){
  var words = message.content.split(' ');
  var i=1
  var username = ""
  while(i<100 && username == ""){
    var username= words[i]
    i= i+1
  }

  if (!username == ""){
   username = username.replace(/[^a-zA-Z0-9- ]/g, "")
   username = username.toUpperCase();
  }else{
    message.reply("Πρέπει να γράψεις το όνομα του παίκτη μετά την εντολή για να σου δώσω το Friend code του")
    return;
  }

  if (!isNaN(username)){
    username = message.guild.members.cache.get(username).displayName 
    username = username.split(" | ")
    username = username[0]
    username = username.toUpperCase();
  }

  let db = new sqlite.Database('./databases/playerdb', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  const sql = 'SELECT friendcode FROM playerdb WHERE username = ? AND serverid = ?';
  db.all(sql,[username,message.guild.id], function(error,rows){
    if (!rows.length > 0){
      message.delete()
      message.author.send(`Το όνομα ${username} δεν υπάρχει στην βάση δεδομένων.`);
      return;
    }
    if (error){
      throw error;
    }
    
    //το αποτέλεσμα που βρίσκει στην βάση δεδομένων για friendcode, το χωρίζει σε 3 μέρη και βάζει μια παύλα ανάμεσα για την είναι πιο εύκολή η ανάγνωσή του απο τον χρήστη
    rows.forEach(function(row){
      let dbresult = row.friendcode.toString();
      part1 = dbresult.slice(0,4);
      part2 = dbresult.slice(4,8);
      part3 = dbresult.slice(8,12);
      finalresult = `${part1}-${part2}-${part3}`
      message.delete()
      message.author.send(`Το Friendcode του χρήστη ${username} είναι :`).then(message.author.send(finalresult));
      db.close(); 
   })
  })
}


function welcomechannelid(member,randomizer,client,welcometable){
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
  const sql = 'SELECT welcome FROM channelid WHERE Serverid = ?';
  db.all(sql,[member.guild.id], function(error,rows){
    if (rows.length <= 0){
      return;
    }
    if (error){
      throw error;
    }
    //το αποτέλεσμα που βρίσκει στην βάση δεδομένων για friendcode, το χωρίζει σε 3 μέρη και βάζει μια παύλα ανάμεσα για την είναι πιο εύκολή η ανάγνωσή του απο τον χρήστη
    rows.forEach(function(row){
      let dbresult = row.welcome
      db.close();
      setTimeout(()=> { client.channels.cache.get(dbresult).send(welcometable[randomizer])},3000);
      return;
   })
  })
}


function corrector(message,prefix){
  var words = message.content.split(' ');
    //Χρησιμο: αλγόριθμος που διαβαζει το κειμενο οσα κενα και να υπαρχουν
    i=1
    channel = ""
    channeltoid = ""
  while(i<100 && channel == ""){
    var channel = words[i]
    i= i+1
  }
  
  while(i < 100 && channeltoid == ""){
    var channeltoid = words[i]
    if (channeltoid == "=" || channeltoid == " ="|| channeltoid == "= "){
      channeltoid = ""
    }
  }
  i=i+1;

  if (!channeltoid ==""){
    channeltoid = channeltoid.replace(/[^a-zA-Z0-9 ]/g, "")
  }else{
    message.reply("Πρέπει να γράψεις το όνομα του καναλιού δεξιά απο το =")
  }

  if (!channel == ""){
  channel = channel.replace(/[^a-zA-Z0-9 ]/g, "")
  channel = channel.toLowerCase()
  }else{
    message.reply(`Η εντολή αυτή λειτουργεί με λέξεις κλειδιά για να διορθώσεις ένα κανάλι που έκανες λάθος η δεν αναγνώρισα στο ${prefix}init.\n Η εντολή λειτουργεί γράφοντας την λέξη "correct", όπως πολύ σωστά έκανες, μετά κενό το κανάλι ή τον ρόλο που θες να δηλώσεις και μετά ίσον (=) το πως λέγεται αυτός ο ρόλος/κανάλι στον σέρβερ σου, να προσέχεις τα κενά, δεν θέλω κενά ανάμεσα στον ίσον. (πχ: ${prefix} welcome=kaloston.\n οι λέξεις κλειδια για τα κανάλια είναι: welcome , friendship, showoff, hundo, levelchange, levelchangereport. Και απο ρόλους έχουμε admin , mod , instinct , valor και mystic )`)
    return;
  }
  i=0;

  if (channel === "admin" || channel === "mod" || channel === "valor" || channel === "mystic" || channel === "instinct"){
    var value = message.guild.roles.cache.find(r => r.name === channeltoid) || "missing";
    if (value == "missing"){
      message.author.send("Δεν μπόρεσα να βρω το όνομα του ρολου στον σερβερ")
      return;
    }
  }else{
    var value = message.guild.channels.cache.find(channel => channel.name == channeltoid) || "nochannel";
    if (value == "nochannel"){
      message.author.send("Δεν μπόρεσα να βρω το όνομα του καναλιού στον σερβερ")
      return;
    }
  }

  var id = value.id
  var sid = message.guild.id
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)

  const sql = `UPDATE channelid SET ${channel} = ?  WHERE Serverid = ?`
  db.all(sql,[/*channel,*/id, sid], function(error,rows){
    if (error){
      throw error;
    }
    message.delete()
    message.author.send("Το κανάλι ή ο ρόλος που επέλεξες διορθώθηκε.")
    db.close();
  }) 
}

function blockMessage(message){
  let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
var serverid = message.guild.id
const sql = 'SELECT * FROM blacklist WHERE userid = ? AND serverid = ?';
db.all(sql,[message.author.id , serverid ], function(error,rows){
  if (rows.length > 0){
    message.author.send(`Οι admin/mods σε αυτόν τον Σερβερ σε έβαλαν στην μαύρη την λίστα.`).then(message.delete())
  }
})
db.close()
}

function blackList(message,client){
var words = message.content.split(' ');
        var i=1
        var username = ""
        while(i<100 && username == ""){
          var username = words[i]
         i= i+1
        }
        if (!username == ""){
        let user = client.users.cache.find(user => user.username == username);
        if (user == null){
          message.reply("Δεν μπόρεσα να διαβάσω το όνομα του χρήστη.\nΣυμβουλή: Πρόσεχε τα κενά και τα κεφαλαία γράμματα")
          return;
        }
        let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
        db.serialize(function(){
          var smmt = db.prepare("INSERT OR REPLACE INTO Blacklist VALUES(?,?,?)");
          smmt.run(username,user.id,message.guild.id);
          smmt.finalize();
          db.close()
          message.author.send(`Ο χρήστης ${username} μπήκε στην μαύρη την λίστα.`);
         }); 
        }else{
          message.reply("Πρέπει να γράψεις το όνομα του παίκτη μετά την εντολή για να σου δώσω το Friend code του")
          return;
        }
      }

      function whiteList(message,client){
      var words = message.content.split(' ');
      var i=1
      var username = ""
      while(i<100 && username == ""){
        var username = words[i]
       i= i+1
      }
      let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
      let user = client.users.cache.find(user => user.username == username);
      if (user == null){
        message.reply("Δεν μπόρεσα να διαβάσω το όνομα του χρήστη.\nΣυμβουλή: Πρόσεχε τα κενά και τα κεφαλαία γράμματα")
        return;
      }
      db.serialize(function(){
        var smmt = db.prepare("DELETE FROM Blacklist WHERE Username = ? AND userid = ? AND serverid = ?");
        smmt.run(username, user.id ,message.guild.id);
        smmt.finalize();
       db.close();
       message.author.send(`Ο χρήστης ${username} αφαιρέθηκε από την μαύρη την λίστα.`);
       });
      }

      function showList(message){
        let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
        const sql = 'SELECT Username FROM Blacklist WHERE serverid = ?';
        db.all(sql,[message.guild.id], function(error,rows){
          if (!rows.length > 0){
            message.delete()
            message.author.send(`Η μαύρη λίστα είναι άδεια`);
            return;
          }
          if (error){
            throw error;
          }
          
          //το αποτέλεσμα που βρίσκει στην βάση δεδομένων για friendcode, το χωρίζει σε 3 μέρη και βάζει μια παύλα ανάμεσα για την είναι πιο εύκολή η ανάγνωσή του απο τον χρήστη
          message.author.send("Ορίστε τα άτομα που έχουν μπει στην μαύρη την λίστα:")
          rows.forEach(function(row){
            message.author.send(row.Username)
         })
         db.close(); 
        })
      }

module.exports = {dbRegister,dbGivedata,dbInit,dbPrefix,welcomechannelid,corrector,blockMessage,blackList,whiteList,showList,registerMe}