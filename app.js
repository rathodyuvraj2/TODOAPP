const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path'); // Import the 'path' module.

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port :"3307",
    database: 'taskmanager'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err);
        return;
    }
    console.log('Connected to MySQL');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure the correct path to the views folder.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            res.render('index', { tasks: rows });
        }
    });
});

app.post('/tasks', (req, res) => {
    const task = req.body.task;
    connection.query('INSERT INTO tasks (description) VALUES (?)', [task], (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.get('/complete-task/:id', (req, res) => {
    const taskId = req.params.id;
    connection.query('SELECT completed FROM tasks WHERE id = ?', [taskId], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            const currentStatus = rows[0].completed;
            const newStatus = currentStatus === 0 ? 1 : 0;

            connection.query('UPDATE tasks SET completed = ? WHERE id = ?', [newStatus, taskId], (err) => {
                if (err) {
                    console.error(err);
                }
                res.redirect('/');
            });
        }
    });
});



/*  if only you have to add the task and not undo it

app.get('/complete-task/:id', (req, res) => {
    const taskId = req.params.id;
    connection.query('UPDATE tasks SET completed = 1 WHERE id = ?', [taskId], (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});
*/


app.get('/remove-task/:id', (req, res) => {
    const taskId = req.params.id;
    connection.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Start the server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
