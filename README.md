# node-pouch

Easily read/write data to multiple databases using PouchDB.

**ToDo:**

Allow deleting of records.

---------------------------------

**Usage:**

```
var nodePouch = require("node-pouch");
var pouch = new nodePouch(name, base);
```

- name (optional): Database name/link.
- base (optional): Any base name like folder name to store the database inside that folder. Can be a link too in case of remote database.

Both arguments can be ignored if you want to specify full database name/link everytime in each function.

-------------------------------

**Methods:** (All methods return promises with useful data & errors)

*.get(id, name);*

```
pouch.get(id, name);
```

- id: Unique record ID.
- name: Database name/link. Optional if already provided when creating a new instance of the module. Useful if you want to use a different database name/link.

Example:

```
pouch.get("unique-record-id");
```

---------------------------------------

*.save(record, name);*

```
pouch.save(record, name);
```

- record: A record object like: `{_id: "unique-reqcord", name: "Apple", ...}`. If `_id` is not provided, it will be randomly created for you.
- name: Database name/link. Optional if already provided when creating a new instance of the module. Useful if you want to use a different database name/link.

Example:

```
pouch.save({
  _id: "unique-record-id",
  name: "Apple",
  description: "Macbooks, iPads, iPhones"
  ...
});
```

If a record already exists with that `_id`, then it will be fetched first and all old record object values will also be included for incremental saving. For example, if a record had only `name` & `decription` earlier and you now want to save `model` also, then doing this will be sufficient and your old data will be preserved.

```
pouch.save({
  _id: "unique-record-id",
  model: "APPLE-001"
  ...
});
```

-----------------------------------------

*.index(fields, name)*

```
pouch.index(fields, name);
```

Makes search faster if you use indexes.  
Indexes are automatically created when you fetch record/records.

- fields: Fields to combine to make a search index.
- name: Database name/link. Optional if already provided when creating a new instance of the module. Useful if you want to use a different database name/link.

Example:

```
pouch.index(["name", "description']);
```

-----------------------------------------

*.record(keyOrObject, name)*

```
pouch.record(keyOrObject, name);
```

- keyOrObject: Unique record ID or search object.
- name: Database name/link. Optional if already provided when creating a new instance of the module. Useful if you want to use a different database name/link.

```
pouch.record("unique-record-id");
```

Search indexes are created automatically if search is an object.

```
pouch.record({name: "Apple", model: "APPLE-001"});
```

----------------------------------------

*.records(searchObject, name)*

```
pouch.records(searchObject, name);
```

- searchObject: Same as the request object provided here: https://pouchdb.com/api.html#query_index  
If selector is not provided in searchObject, then it uses the searchObject itself as selector.
- name: Database name/link. Optional if already provided when creating a new instance of the module. Useful if you want to use a different database name/link.

```
pouch.records({name: "Apple", model: "APPLE-001"});
```

```
pouch.records({
  selector: {name: "Apple", model: "APPLE-001"},
  fields: ['_id', 'name'],
  sort: ['name']
});
```