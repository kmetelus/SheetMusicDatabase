const { Client } = require('pg');
const prompt = require('prompt');
const client = new Client("pg://postgres:9110@localhost:5432/SheetMusicDatabase");

// client.connect();
// client.query('SELECT * FROM main.Song;')
//   .then(res => {
//     res.rows.forEach(x => {
//       console.log(JSON.stringify(x) );
//     });
//     client.end();
//   })
//   .catch(e => {
//     console.log(e);
//     client.end();
//   });

// Creating  a hash for the ID of the entry
const Hashids = require('hashids');
let lpad = (value) => {
    let zeroes = new Array(4).join("0");
    return (zeroes + value).slice(-3);
}
let timestamp = lpad(new Date().getUTCMilliseconds());
let hashids = new Hashids("this is my salt", 8, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

// Object that will store all prompt vales
let responses = {};
let id = hashids.encode(timestamp);

// Prompt schema
let schema = {
  properties : {
    song: {
      description: 'Enter the song title',
      required: true
    },
    artist: {
      description: 'Enter the name of the artist',
      required: true
    },
    year: {
      description: 'Enter the year the song was written',
      pattern: /^\d{4}$/,
      message: 'Input a valid year',
      required: true
    },
    instrument: {
      description: 'Enter the instrument the song was written for',
      required: true
    },
    type: {
      description: 'Enter the type of sheet this is',
      pattern: /^Sheet$|^MIDI$|^Tab$|^GuitarPro$/,
      message: 'Options are: Sheet, Tab, or GuitarPro (case sensitive)',
      required: true
    },
    collection: {
      description: 'Enter the collection or album this song is a part of',
      required: false
    },
    link: {
      description: 'Provide a link to the sheet',
      required: true
    }
  }
};

// Initiating prompts
prompt.get(schema, (err, result) => {
  responses = result;
  responses.id = id;
  console.log('ID: ' + responses.id);
  console.log('Song: ' + responses.song);
  console.log('Artist: ' + responses.artist);
  console.log('Year: ' + responses.year);
  console.log('Instrument: ' + responses.instrument);
  console.log('Type: ' + responses.type);
  console.log('Collection: ' + responses.collection);
  console.log('Link: ' + responses.link);

  // Connecting to Postgres database and inserting into table
  client.connect();

  // For putting into Song table
  let intoSong = 'INSERT INTO Song VALUES($1, $2, $3, $4, $5, $6, $7)';
  let songParams = [responses.id,responses.song,responses.artist,responses.year,responses.instrument,responses.type,responses.link];

  // For putting into Collection table
  let collectionCheck = `SELECT "Songs" FROM Collection WHERE "Title" = '${responses.collection}'`;
  let songsInCollection = [responses.id];

  // Insertion into Song table
  client.query(intoSong, songParams, (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Successfully added to Songs table!");
  });

  // Insertion into Collection table
  if (responses.collection) {
    client.query(collectionCheck)
      .then(res => {
        res.rows.forEach(x => {
          songsInCollection = x.Songs.replace(/{/g, '').replace(/}/g, '').split(',');
          songsInCollection.push(responses.id);
          client.query(`DELETE FROM Collection WHERE "Title" = '${responses.collection}'`);
        });

        let intoCollection = 'INSERT INTO Collection VALUES($1, $2, $3)';
        let collectionParams = [songsInCollection, responses.collection, responses.artist];

        client.query(intoCollection, collectionParams, (err, result) => {
          if (err) {
            throw err;
          }
          console.log("Successfully added to Collections table!");
          client.end();
        });
      })
      .catch(e => {
        console.log(e);
        client.end();
      });
    } else {
      client.end();
    }
});
