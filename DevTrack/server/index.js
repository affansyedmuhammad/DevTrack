import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import fs from 'fs'; // Required to log errors to a file

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "devtrack123!",
    database: "devtrack_db"
};

// Function to log errors to a file
const logErrorToFile = (error) => {
    const errorMessage = `[${new Date().toISOString()}] ${error.stack || error}\n`;
    fs.appendFileSync('error_log.txt', errorMessage, 'utf8');
};

// Root Route
app.get('/', (req, res) => {
    res.end("Welcome to DevTrack");
});

// Get User Tasks
app.get('/users', (req, res) => {
    let text = "";
    const username = req.query.username;

    if (!username) {
        return res.status(400).send("Username is required");
    }

    const con = mysql.createConnection(dbConfig);
    con.connect((err) => {
        if (err) {
            console.error("Database connection error:", err);
            logErrorToFile(err);
            return res.status(500).send("Internal Server Error");
        }

        const query = "SELECT task, date FROM tasks WHERE username = ?";
        con.query(query, [username], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                logErrorToFile(err);
                return res.status(500).send("Internal Server Error");
            }

            result.forEach((row, index) => {
                text += `${index + 1}. "${row.task}" => ETA: ${row.date}\n`;
            });

            text = text.trim(); // Remove trailing newline
            res.send(text);
        });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and Password are required");
    }

    const con = mysql.createConnection(dbConfig);
    con.connect((err) => {
        if (err) {
            console.error("Database connection error:", err);
            logErrorToFile(err);
            return res.status(500).send("Internal Server Error");
        }

        const query = "SELECT password FROM user WHERE username = ?";
        con.query(query, [username], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                logErrorToFile(err);
                return res.status(500).send("Internal Server Error");
            }

            if (result.length > 0 && result[0].password === password) {
                res.redirect(`http://localhost:3000/users?username=${username}`);
            } else {
                res.redirect('http://localhost:3000/invalid');
            }
        });
    });
});

// Create Task
app.post('/createtask', (req, res) => {
    const { newtask: task, compdate: date, username } = req.body;

    if (!task || !date || !username) {
        return res.status(400).send("Task, Date, and Username are required");
    }

    const con = mysql.createConnection(dbConfig);
    con.connect((err) => {
        if (err) {
            console.error("Database connection error:", err);
            logErrorToFile(err);
            return res.status(500).send("Internal Server Error");
        }

        const query = "INSERT INTO tasks (username, task, date) VALUES (?, ?, ?)";
        con.query(query, [username, task, date], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                logErrorToFile(err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`http://localhost:3000/users?username=${username}`);
        });
    });
});

// Create Account
app.post('/createacc', (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    if (!username || !email || !password || password !== confirmpassword) {
        return res.status(400).send("Invalid input or passwords do not match");
    }

    const con = mysql.createConnection(dbConfig);
    con.connect((err) => {
        if (err) {
            console.error("Database connection error:", err);
            logErrorToFile(err);
            return res.status(500).send("Internal Server Error");
        }

        const query = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
        con.query(query, [username, email, password], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                logErrorToFile(err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect("http://localhost:3000/acccreated");
        });
    });
});

// Delete Task
app.post('/deletetask', (req, res) => {
    let { task, username } = req.body;

    if (!task || !username) {
        return res.status(400).send("Task and Username are required");
    }

    task = task.substring(2).split("=>")[0]; // Parse task

    const con = mysql.createConnection(dbConfig);
    con.connect((err) => {
        if (err) {
            console.error("Database connection error:", err);
            logErrorToFile(err);
            return res.status(500).send("Internal Server Error");
        }

        const query = "DELETE FROM tasks WHERE task = ?";
        task = task.substring(2, task.length - 2);
        console.log("task"+task)
        con.query(query, [task], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                logErrorToFile(err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect(`http://localhost:3000/users?username=${username}`);
        });
    });
});

// Start Server
app.listen(9000, () => {
    console.log("Server is running on port 9000");
});
