function bulkdelete(message,prefix){

  let cont = message.content.slice(prefix.length).split(" ");
  let args = cont.slice(1);
  var bdelete = message.content.split(' ');
  var numberpart = bdelete[1];
  if (isNaN(numberpart)){
    message.author.send("Το δεύτερο στοιχείο που έγραψες πρέπει να είναι ο αριθμός των μυνημάτων που θες να διαγράψεις.");
    message.delete()
    return(message);
  }
  numberpart = numberpart + 1
  async function purge(){
    message.delete();
    const fetched = await message.channel.messages.fetch({limit: args[0]});
    console.log(fetched.size + ' message found, deleting...');
    message.channel.bulkDelete(fetched)
    .catch(error => message.author.send(`Error: ${error}`));
  }
  purge();
  return(message);
}
module.exports = {bulkdelete}