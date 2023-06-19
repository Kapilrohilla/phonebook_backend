const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://kapilrohilla:${password}@phonebook.6ebawsh.mongodb.net/`
mongoose.connect(url);

const contactSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', contactSchema);

const name = process.argv[3];
const num = process.argv[4];

const contact = new Person({
    name: name,
    number: num
})

if ((name && num) === undefined) {
    console.log("phonebook: ");
    Person.find({}).then(contacts => {
        contacts.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`);
        })
        mongoose.connection.close();
    })
} else {
    contact.save().then(r => {
        console.log(`added ${name} number ${num} to phonebook`);
        mongoose.connection.close();
    })
}
