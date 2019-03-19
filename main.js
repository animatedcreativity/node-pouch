exports = module.exports = function(name, base) {
  if (typeof base === "undefined") base = "";
  var PouchDB = require("pouchdb");
  var lib = {
    sanitize: require("node-sanitize-options"),
    name: name,
    list: {},
    db: function(name) {
      if (typeof name === "undefined") name = lib.name;
      if (typeof lib.list[name] !== "undefined") return lib.list[name];
      lib.list[name] = new PouchDB(base + name);
      return lib.list[name];
    },
    index: function(fields, name) {
      return lib.db(name).createIndex({
        index: {fields: fields}
      });
    },
    get: function(id, name) {
      return new Promise(function(resolve, reject) {
        lib.db(name).get(id).then(function(doc) {
          resolve(doc);
        }).catch(function(error) {
          reject(error);
        });
      });
    },
    record: function(key, name) {
      return new Promise(function(resolve, reject) {
        if (typeof key === "string") {
          lib.get(key, name).then(function(data) {
            resolve(data);
          }).catch(function(error) {
            reject(error);
          });
        } else {
          lib.records({selector: key}, name).then(function(docs) {
            if (docs.length > 0) {
              resolve(docs[0]);
            } else {
              reject({status: 404, reason: "missing"});
            }
          }).catch(function(error) {
            reject(error);
          });
        }
      });
    },
    records: function(options, name) {
      options = lib.sanitize.options(options, {});
      if (typeof options.selector === "undefined") options = {selector: lib.sanitize.options(options, {})};
      options.selector = lib.sanitize.options(options.selector, {});
      return new Promise(function(resolve, reject) {
        var done = function() {
          lib.find(options, name).then(function(result) {
            if (typeof result.docs !== "undefined") {
              resolve(result.docs);
            } else {
              reject(result);
            }
          }).catch(function(error) {
            reject(error);
          });
        };
        if (typeof options.selector !== "undefined") {
          var fields = [];
          for (var selector in options.selector) {
            fields.push(selector);
          }
          if (fields.length > 0) {
            lib.index(fields, name).then(function(result) {
              done();
            }).catch(function(error) {
              reject(error);
            });
          } else {
            done();
          }
        }
      });
    },
    find: function(options, name) {
      options = lib.sanitize.options(options, {
        include_docs: false,
        attachments: false
      });
      return new Promise(function(resolve, reject) {
        lib.db(name).find(options).then(function(result) {
          resolve(result);
        }).catch(function(error) {
          reject(error);
        });
      });
    },
    save: function(obj, name) {
      return new Promise(function(resolve, reject) {
        var done = function(obj) {
          lib.db(name).put(obj).then(function(response) {
            if (response.ok === true) {
              resolve(response);
            } else {
              reject(response);
            }
          }).catch(function(error) {
            reject(error);
          });
        }
        if (obj._id !== "undefined") {
          lib.db(name).get(obj._id).then(function(doc) {
            obj._rev = doc._rev;
            for (var key in doc) {
              if (typeof obj[key] === "undefined") obj[key] = doc[key];
            }
            done(obj);
          }).catch(function(error) {
            if (error.status === 404) {
              done(obj);
            } else {
              reject(error);
            }
          });
        } else {
          done(obj);
        }
      });
    }
  };
  return lib;
};