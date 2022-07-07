var sqlite = require('sqlite3').verbose();
var Twit = require('twit')

function tweet(client){

var T= new Twit({
    consumer_key: 'gXHcpoPJ1q0JR52Xj8G3xvTGC',
    consumer_secret: 'FSeFP0XqOPkCeYKS21dyf0xHibKdWantjkVmJI3loIRf7D0tfy',
    access_token: '798658462431449089-RIncF7MtFb1lPGLqfy0dlPYg9iK2PC0',
    access_token_secret: '7kfBlD5Do3kC54jF982zcpjBWzoV0JxiR618kArosCFxz'
  })
  
  var stream = T.stream('statuses/filter', {follow: '798658462431449089'/*'840992778020630531'*/});
  
  stream.on('tweet', tweet => { 
    let db = new sqlite.Database('./databases/Serverinfo', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    const sql = 'SELECT newsid FROM news';
    db.all(sql, function(error,rows){
      if (rows.length <= 0){
        return;
      }
      if (error){
        throw error;
      }
      rows.forEach(function(row){
        let dbresult = row.newsid
       let channel = client.channels.cache.get(dbresult.toString());
       channel.send(`O χρήστης ${tweet.user.screen_name} έκανε ένα tweet:\n ${tweet.text}`);
     })
     db.close();
    })
  });
}

module.exports = {tweet}