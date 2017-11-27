const { Client } = require('pg');
const prompt = require('prompt');
const client = new Client("pg://postgres:9110@localhost:5432/SheetMusicDatabase");

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
      required: true
    },
    instrument: {
      description: 'Enter the instrument the song was written for',
      required: true
    },
    type: {
      description: 'Enter the type of sheet this is',
      pattern: /^Sheet$|^Tab$|^GuitarPro$/,
      message: 'Options are: Sheet, Tab, or GuitarPro (case sensitive)',
      required: true
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
  console.log('Link: ' + responses.link);

  client.connect();
  client.query('SELECT * FROM main.MainTable;')
    .then(res => {
      res.rows.forEach(x => {
        console.log(JSON.stringify(x) );
      });
      client.end();
    })
    .catch(e => {
      console.log(e);
      client.end();
    });

// Connecting to Postgres database and inserting into table
//   client.connect();
//   let querytext = 'INSERT INTO main.MainTable VALUES($1, $2, $3, $4, $5, $6, $7)';
//   let responseArray = [responses.id,responses.song,responses.artist,responses.year,responses.instrument,responses.type,responses.link];
//   client.query(querytext, responseArray, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log("Successfully added to SheetMusicDatabase!");
//     client.end();
//   });
});
