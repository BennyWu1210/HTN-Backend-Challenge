import sqlite3 from "sqlite3";

// Create a database if none exists
const database = new sqlite3.Database("./database/hackers.db", (err) => {
  if (err) {
    console.error("Unsuccessful connection: ", err.message);
  }
  console.log("Connected to the hackers database");
});

export default database;
