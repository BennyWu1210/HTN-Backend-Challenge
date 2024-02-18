import database from "./connection.js";
import fs from "fs";

const dataFile = "database/data.json";

// Create schema for the users table
const createUsersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT
    );
  `;

  database.run(query, (err) => {
    if (err) {
      console.error("User table Error: ", err.message);
    } else {
      console.log("Users table created!");
    }
  });
};

// We do the same for the skills table
const createSkillsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    skill TEXT NOT NULL,
    rating INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `;

  database.run(query, (err) => {
    if (err) {
      console.error("Skills table error", err.message);
    } else {
      console.log("Skills table created!");
    }
  });
};

// A table to keep track of scanned events
const createScannedTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS scan_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_name TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TYIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  database.run(query, (err) => {
    if (err) {
      console.error("Scanned table error", err.message);
    } else {
      console.log("Scanned table created!");
    }
  });
};

// A table to keep track of hardware loas
const createHardwareTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS hardware_loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        hardware_item TEXT NOT NULL,
        status TEXT CHECK(status IN ('borrowed', 'returned')) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  database.run(query, (err) => {
    if (err) {
      console.error("Hardware table error", err.message);
    } else {
      console.log("Hardware table created!");
    }
  });
};

// populate both tables
const importData = () => {
  // populate scanned events table (mock data)
  const scannedEventsDummy = [
    { user_id: 1, event_name: "Intro to Computer Vision" },
    { user_id: 2, event_name: "Free food" },
    { user_id: 1, event_name: "Closing Ceremony" },
  ];

  scannedEventsDummy.forEach((scannedEvent) => {
    database.run(
      `INSERT INTO scan_events (user_id, event_name) VALUES (?, ?)`,
      [scannedEvent.user_id, scannedEvent.event_name],
      (err) => {
        if (err) {
          console.error("Error during insertion: ", err.message);
        }
      }
    );
  });



  // populate user and skills table
  database.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (err) {
      console.error("Error checking users table: ", err.message);
    } else if (row.count === 0) {
      // only fill table if it is originally empty
      const data = JSON.parse(fs.readFileSync(dataFile));

      // insert users into the database
      data.forEach((user) => {
        database.run(
          `INSERT INTO users (name, company, email, phone) VALUES (?, ?, ?, ?)`,
          [user.name, user.company, user.email, user.phone],

          function (err) {
            if (err) {
              console.error("Error during insertion: ", err.message);
            } else {
              // extract the user ID from each row, insert a skills row
              const userId = this.lastID;
              user.skills.forEach((skill) => {
                database.run(
                  `INSERT INTO skills (user_id, skill, rating) VALUES (?, ?, ?)`,
                  [userId, skill.skill, skill.rating],
                  (err) => {
                    if (err) {
                      console.error(err.message);
                    }
                  }
                );
              });
            }
          }
        );
      });
    }
  });
};

// Execute the setup
database.serialize(() => {
  createUsersTable();
  createSkillsTable();
  createScannedTable();
  createHardwareTable();
  importData();
});
