const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');

let now = new Date();

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://node-firebase-example-bab32-default-rtdb.firebaseio.com/'
});

const db = admin.database();

router.get('/', (req, res) => {
    db.ref('contacts').once('value', (snapshot) => {
        const data = snapshot.val();
        res.render('index', { contacts: data});
    });
});

router.post('/new-contact', (req, res) => {
    console.log(req.body);
    
    const newContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        date: now.toUTCString()
    };
    db.ref('contacts').push(newContact);
    res.redirect('/');
})

router.get('/delete-contact/:id', (req, res) => {
    db.ref('contacts/' + req.params.id).remove();
    res.redirect('/');
})

module.exports = router;

