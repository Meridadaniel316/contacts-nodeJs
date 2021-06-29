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
    body('firstname', 'Por favor ingrese un nombre valido. - Min: 3')
        .exists()
        .isLength({ min: 3 }),
    body('lastname', 'Por favor ingrese un apellido valido. - Min: 3')
        .exists()
        .isLength({ min: 3 }),
    body('email', 'Por favor ingrese un E-mail válido')
        .exists()
        .isEmail(),
    body('phone', 'Por favor ingrese un teléfono valido - Min: 7 (fijos) - Max: 10 (móvil)')
        .exists()
        .isNumeric()
        .isLength({ min: 7, max: 10 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        db.ref('contacts').once('value', (snapshot) => {
            const valores = req.body
            const data = snapshot.val();
            const validaciones = errors.array()
            res.render('index', {contacts: data, validaciones:validaciones, valores: valores})
        });

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

router.get('/update/:id', ( req, res) =>{
    db.ref('contacts/' + req.params.id).once('value', (snapshot) => {
        let data = snapshot.val();
        res.render('update', {contact: data, id: req.params.id}) 
    })
})

router.post('/update-contact', [
    body('firstname', 'Por favor ingrese un nombre valido. - Min: 3')
        .exists()
        .isLength({ min: 3 }),
    body('lastname', 'Por favor ingrese un apellido valido. - Min: 3')
        .exists()
        .isLength({ min: 3 }),
    body('email', 'Por favor ingrese un E-mail válido')
        .exists()
        .isEmail(),
    body('phone', 'Por favor ingrese un teléfono valido - Min: 7 (fijos) - Max: 10 (móvil)')
        .exists()
        .isNumeric()
        .isLength({ min: 7, max: 10 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        db.ref('contacts').once('value', (snapshot) => {
            const valores = req.body
            const data = snapshot.val();
            const validaciones = errors.array()
            res.render('update', {contacts: data, validaciones:validaciones, valores: valores})
        });
    } else {
        const contact = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone
        }
        const id = {id: req.body.id}
        db.ref('contacts/' + id.id).update(contact);
        res.redirect('/');
    }
    
});


module.exports = router;

