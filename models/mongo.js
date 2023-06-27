const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

mongoose.connect(url).then(r => {
    console.log("connected to Mongodb " + url);
}).catch(err => {
    console.log(err);
})

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-?\d{3,}-?\d{3,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})
const Person = mongoose.model('Person', contactSchema);

mongoose.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject["id"] = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

// const name = process.argv[2];
// const num = process.argv[3];

// if ((name && num) === undefined) {
//     console.log("phonebook: ");
//     Person.find({}).then(contacts => {
//         contacts.forEach(contact => {
//             console.log(`${contact.name} ${contact.number}`);
//         })
//         mongoose.connection.close();
//     })
// } else {
//     contact.save().then(r => {
//         console.log(`added ${name} number ${num} to phonebook`);
//         mongoose.connection.close();
//     })
// }

module.exports = Person;