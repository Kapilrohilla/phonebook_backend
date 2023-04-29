const express = require('express');
const app = express();
const PORT = 3001;

let data = [
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

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const cnfrmId = data.filter(obj => {
        return obj.id === Number(id);
    })
    data = data.filter(obj => {
        return obj.id !== Number.parseInt(id)
    });
    if (!cnfrmId.length > 0) {
        res.send("person not found");
    } else {
        console.info("person data deleted");
        res.status(204);
        res.send('person data deleted');
    }
})
app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body) {
        res.end("body not detected");
    }
    console.log(req.headers);
    const note = {
        id: Math.random() * 10000,
        name: body.name,
        number: body.number
    }
    console.log(note);
    data = data.concat(note);
    res.status(200).json(data);
})

app.listen(PORT, () => {
    console.log(`listning at post:${PORT}`);
})