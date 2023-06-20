const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const Person = require('./models/mongo');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// const morganForGet = ':method :url :status :res[content-length] - :response-time ms';
// app.use(morgan(morganForGet));

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
})
const morganForPost = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(morganForPost));

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
    // res.status(200).json(data);
    Person.find({}).then(r => {
        res.status(200).json(r);
    })
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
    const alreadyPerson = data.filter(person => person.name === body.name);
    if (alreadyPerson.length > 0) {
        return res.status(400).json({
            "error": "name or number must be unique"
        })
    }
    if (!body.name || !body.number) {
        console.log("name or number is missing");
        return res.status(400).json({
            "content": "name or number is missing"
        });
    } else {
        const note = {
            id: Math.floor(Math.random() * 10000),
            name: body.name,
            number: body.number
        }

        data = data.concat(note);
        res.json(note);
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listning at post:${PORT}`);
})
