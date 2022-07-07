function updateLevel (message, client, levelreport_ch, talkedRecently){
  var words = message.content.split(' ');
  var i=1
  var newlevel = ""
  while(i<100 && newlevel == ""){
  var newlevel= words[i]
  
  i= i+1
  }
  if (!newlevel == ""){
    newlevel = newlevel.replace(/[^a-zA-Z0-9- ]/g, "")
  }else{
    message.reply("Πρέπει να γράψεις κάτι μετά το 'levelup' για να σου αυξομειώσω επίπεδο.")
    return;
  }

  if (newlevel > 50 || isNaN(newlevel) || newlevel <=0){
    message.author.send("To επίπεδο που έγραψες δεν είναι σωστό.")
    message.delete();
    return;
  }
  nickname = message.guild.members.cache.get(message.author.id).displayName
  var words= nickname.split(' ');
  var name = words[0];
  var oldlevel = words[2];
  if ((typeof words[2] === "undefined") || (isNaN(oldlevel))){
    message.author.send("Υπάρχει κάποιο λάθος στον τρόπο γραφής του ψευδώνυμού σου. Παρακαλώ μίλα με τους διαχειριστές η συντονιστές.")
    message.delete();
  }
  else if (newlevel == oldlevel){
    message.author.send("Το νέο σου επίπεδο και το παλιό σου επίπεδο δεν μπορούν να είναι τα ίδια.")
    message.delete();
  }
  else if (oldlevel == 50){
    message.author.send("Είσαι ήδη στο ανώτατο επίπεδο στο pokemon-go δεν μπορείς να αυξομειώσεις επίπεδα.")
    message.delete();
  }
  message.member.setNickname(name+" | "+newlevel)
  message.delete();
  if (newlevel < oldlevel){
    message.author.send(`Το επίπεδο σου έπεσε στο ${newlevel}`)
    client.channels.cache.get(levelreport_ch).send(`ο ${message.author} έπεσε απο επίπεδο ${oldlevel} σε επίπεδο ${newlevel}`)
  }
  else if(newlevel > oldlevel){
    message.author.send(`Το επίπεδο σου ανέβηκε στο ${newlevel}`)
    client.channels.cache.get(levelreport_ch).send(`ο ${message.author} ανέβηκε απο επίπεδο ${oldlevel} σε επίπεδο ${newlevel}`)
  }
}

module.exports = {updateLevel}