// Creates an application user with readWrite on memesdb
db = db.getSiblingDB('memesdb');
db.createUser({
  user: 'memes',
  pwd: 'memespass',
  roles: [{ role: 'readWrite', db: 'memesdb' }],
});
