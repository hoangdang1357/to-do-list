const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
    user: 'TaskManagerUser',
    password: 'StrongPassword123!',
    server: 'localhost',
    database: 'TaskManager',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};

sql.connect(dbConfig).catch(err => console.log(err));

app.get('/tasks', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT Tasks.id, Tasks.name, Tasks.dueDate, Descriptions.description
            FROM Tasks
            LEFT JOIN Descriptions ON Tasks.id = Descriptions.taskId
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/tasks', async (req, res) => {
    const { name, description, dueDate } = req.body;
    try {
        const taskResult = await sql.query`
            INSERT INTO Tasks (name, dueDate) OUTPUT INSERTED.id VALUES (${name}, ${dueDate})
        `;
        const taskId = taskResult.recordset[0].id;
        await sql.query`
            INSERT INTO Descriptions (taskId, description) VALUES (${taskId}, ${description})
        `;
        res.status(201).send('Task added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, dueDate } = req.body;
    try {
        await sql.query`
            UPDATE Tasks SET name = ${name}, dueDate = ${dueDate} WHERE id = ${id}
        `;
        await sql.query`
            UPDATE Descriptions SET description = ${description} WHERE taskId = ${id}
        `;
        res.send('Task updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`
            DELETE FROM Descriptions WHERE taskId = ${id}
        `;
        await sql.query`
            DELETE FROM Tasks WHERE id = ${id}
        `;
        res.send('Task deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
