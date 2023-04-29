const express = require('express');
const app = express();
const PORT = 3001;

const data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(data);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = data.filter(obj => obj.id === Number.parseInt(id));
    if (!person.length > 0) {
        res.status(404).send(`<p>person with id ${id} not found</p>`);
    } else {
        res.send(person);
    }
})

app.get('/info', (req, res) => {
    res.header({ "Content-type": "text/html" });
    res.send(`<p>Phonebook has info of ${data.length} people</p><p>${Date()}</p>`)
});

app.listen(PORT, () => {
    console.log(`listning at post:${PORT}`);
})