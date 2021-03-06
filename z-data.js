const flatfile = require('flat-file-db');
var db = flatfile('pushups.db');
//TODO: Migrate to postgresql.. flat file was only temporary

module.exports = {
  updatePushupCount: function (username, num) {
    return updatePushupCount(username, num);
  },
  getPushupCount: function (username) {
    return getPushupCount(username);
  },
  getDataDump: function() {
    return getDataDump();
  }
};

var updatePushupCount = function(username, num) {
  let currentPushups = db.get(username) ? db.get(username).pushups : 0;
  let newPushups = currentPushups + num;
  db.put(username, {pushups:newPushups});
  return newPushups;
};

var getPushupCount = function(username) {
  return flatfile.sync('pushups.db').get(username);
}

var getDataDump = function() {
  let keys = db.keys();
  let data = [];
  for (let k in keys) {
    let name = keys[k];
    let value = db.get(keys[k]);
    let obj = {name, value}
    data.push(obj);
  }
  console.log(data);
  return data;
}

/* Example pushups.db. TODO: proper data persistance + backups
[14,"luke",{"pushups":49}]
                                                                                                                                                                                                                                    	[13,"bruce",{"pushups":70}]
                                                                                                                                                                                                                                   	[15,"bruce",{"pushups":80}]
                                                                                                                                                                                                                                   	[16,"luke",{"pushups":56}]
*/
