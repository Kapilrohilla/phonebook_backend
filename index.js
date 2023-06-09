const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const Person = require('./models/mongo');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', function (req) {
  return JSON.stringify(req.body);
});
const morganForPost = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(morganForPost));

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

app.get('/api/persons', (req, res) => {
  Person.find({}).then(r => {
    res.status(200).json(r);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findById(id).then(aContact => {
    if (aContact) {
      res.status(200).json(aContact);
    } else {
      res.status(404).end();
    }
  }).catch(err => next(err));
});

app.get('/info', (_, res) => {
  Person.find({}).then((r) => {
    const data = r;
    res.header({ 'Content-type': 'text/html' });
    if (data) {
      res.send(`<p>Phonebook has info of ${data.length} people</p><p>${Date()}</p>`);
    }

  });

  // console.log(data);
  // res.header({ 'Content-type': 'text/html' });
  // if (data)
  //     res.send(`<p>Phonebook has info of ${data.length} people</p><p>${Date()}</p>`);
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    }).catch(err => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (Object.keys(body).length < 1)
    res.status(500).end('body not detected');

  const newContact = new Person({
    name: body.name,
    number: body.number
  });
  newContact.save().then(() => {
    console.log('contact saved');
    res.status(200).end();
  }).catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const updatedContact = {
    name: body.name,
    number: Number.parseInt(body.number)
  };
  Person.findByIdAndUpdate(req.params.id, updatedContact, { runValidators: true, context: 'query' })
    .then(() => res.json(updatedContact))
    .catch(err => next(err));

});
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listning at post:${PORT}`);
});
