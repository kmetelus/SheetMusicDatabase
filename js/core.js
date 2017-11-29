const { Client } = require('pg');
const prompt = require('prompt');
const client = new Client("pg://postgres:9110@localhost:5432/SheetMusicDatabase");
let argv = process.argv[2] || "error";
const COMMAND = argv.toUpperCase();

if (COMMAND === "SELECT") {
  console.log("Selecting from SheetMusicDatabase...");

  let selectSchema = {
    properties : {
      table: {
        description: 'Which table would you like to retrieve from?',
        pattern: /^[Ss][Hh][Ee]{2}[Tt]$|^[Cc][Oo][Ll]{2}[Ee][Cc][Tt][Ii][Oo][Nn]$/,
        message: 'The tables available are "sheet" and "collection"',
        required: true
      },
      columns: {
        description: 'Which columns would you like to extract data from?',
        pattern: /^[Aa][Ll]{2}$|^id$|^song$|^artist$|^year$|^instrument$|^type$|^link$|^Songs$|^Title$|^Artist$/,
        message: 'Your options are "all", "id", "song", "artist", "year", "instrument", "type", "link", "Songs", "Title", "Artist"',
        required: true
      },
      condition: {
        description: 'Enter a condition you would to narrow the search',
        pattern: /^"[a-zA-Z]+"='[a-zA-Z]+'$/,
        message: `Enter the conditions as: "<column_name>"='<value>'`,
        required: false
      },
    }
  }
  prompt.get(selectSchema, (err, result) => {
    if (result.columns.toUpperCase() === 'ALL') {
      result.columns = '*';
    } else {
      result.columns = '"' + result.columns + '"';
    }

    let queryString = `SELECT ${result.columns} FROM ${result.table}`;
    if (result.condition) {
      queryString += " WHERE " + result.condition + ";";
    } else {
      queryString += ";";
    }

    client.connect();
    client.query(queryString)
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
  })
} else if (COMMAND === "INSERT") {
  console.log("Inserting into SheetMusicDatabase...")

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
  let insertSchema = {
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
  prompt.get(insertSchema, (err, result) => {
    responses = result;
    responses.id = id;
    console.log('ID: ' + responses.id);
    console.log('Song: ' + responses.song);
    console.log('Artist: ' + responses.artist);
    console.log('Year: ' + responses.year);
    console.log('Instrument: ' + responses.instrument);
    console.log('Type: ' + responses.type);
    if (responses.collection) {
      console.log('Collection: ' + responses.collection);
    }
    console.log('Link: ' + responses.link);

    // For putting into Sheet table
    let intoSong = 'INSERT INTO Sheet VALUES($1, $2, $3, $4, $5, $6, $7)';
    let songParams = [responses.id,responses.song,responses.artist,responses.year,responses.instrument,responses.type,responses.link];


    // Connecting to Postgres database and inserting into table
    client.connect();

    // Insertion into Sheet table
    client.query(intoSong, songParams)
      .then(() => console.log("Successfully added to Sheets table!"))
      .catch(e => console.log(e))
      .then(() => {
        // Insertion into Collection table
        if (responses.collection) {

          // For putting into Collection table
          let collectionCheck = `SELECT "Songs" FROM Collection WHERE "Title" = '${responses.collection}'`;
          let songsInCollection = [responses.id];
          let intoCollection = '';
          let collectionParams = [];

          client.query(collectionCheck)
            .then(res => {
              res.rows.forEach(x => {
                songsInCollection = x.Songs.replace(/{/g, '').replace(/}/g, '').split(',');
                songsInCollection.push(responses.id);
                client.query(`DELETE FROM Collection WHERE "Title" = '${responses.collection}'`);
              });

              intoCollection = 'INSERT INTO Collection VALUES($1, $2, $3)';
              collectionParams = [songsInCollection, responses.collection, responses.artist];

            })
            .catch(e => console.log(e))
            .then(() => {
              client.query(intoCollection, collectionParams)
                .then(() => console.log("Successfully added to Collections table!"))
                .catch(e => console.log(e))
                .then(() => client.end())
            })
          } else {
            client.end();
          }
      })
  });
} else {
  console.log("AN ERROR HAS OCCURRED");
  console.log("Usage (FROM ROOT) = node js/core.js <COMMAND>");
  console.log("COMMANDS: select, insert");
}
