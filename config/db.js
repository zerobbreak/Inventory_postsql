const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "inventory_app",
    password: "Uthacker244$",
    port: 5432,
});

//Function to test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error("Error acquiring client", err.stack);
    }

    client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        console.log("Connection successful:", result.rows);
    });
});

module.exports = pool;