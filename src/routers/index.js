const { Router } = require('express');
const { body, validationResult } = require('express-validator')
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
        res.render('index', { contacts: data });
    });
});

router.post('/new-contact', [
    body('firstname', 'Ingrese un nombre completo')
        .exists()
        .isLength({ min: 5 }),
    body('lastname', 'Ingrese un apellido completo')
        .exists()
        .isLength({ min: 5 }),
    body('email', 'Ingrese un E-mail válido')
        .exists()
        .isEmail(),
    body('phone', 'Ingrese un valor numérico')
        .exists()
        .isNumeric()
], (req, res) => {
    console.log(req.body);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(req.body)
        res.redirect('/');
    } else {
        const newContact = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            date: now.toUTCString()
        };
        db.ref('contacts').push(newContact);
        res.redirect('/');
    }

})

router.get('/delete-contact/:id', (req, res) => {
    db.ref('contacts/' + req.params.id).remove();
    res.redirect('/');
})

module.exports = router;

