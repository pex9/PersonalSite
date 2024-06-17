'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('db.db', (err) => {
    if(err) throw err;
});


exports.getImages = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM meme ORDER BY RANDOM()';
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows.length === 0) {
        resolve({ error: 'No meme found.' });
      } else {
        const memes = rows.map(row => ({ id: row.id, url: row.image_url }));
        resolve(memes);
      }
    });
  });
};
exports.getCaptions = (memeid) => {
  console.log(memeid);
  return new Promise((resolve, reject) => {
    const query1 = 'SELECT * FROM didascalie WHERE meme_id = ? ORDER BY RANDOM() LIMIT 2';
    db.all(query1, [memeid], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const result = rows.map((row, index) => ({
          ...row,
          isCorrect: true // Setting isCorrect to true for the first two rows
        }));

        const query2 = 'SELECT * FROM didascalie WHERE meme_id != ? ORDER BY RANDOM() LIMIT 5';
        db.all(query2, [memeid], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const additionalRows = rows.map((row, index) => ({
              ...row,
              isCorrect: false // Setting isCorrect to false for the additional rows
            }));

            const allRows = result.concat(additionalRows);
            resolve(shuffleArray(allRows)); // Shuffle the combined rows
          }
        });
      }
    });
  });
};
exports.saveGame = (userId, score,date,listmeme) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO partite (user_id, score,created_at,listmeme) VALUES (?, ?, ?, ?)';
    db.run(query, [userId, score,date,listmeme], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};
exports.getGames = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM partite where user_id = ? ORDER BY created_at DESC';
    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getGame = (gameId, userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM partite WHERE id = ? AND user_id = ?';
    console.log(query);
    db.get(query, [gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
