const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + "./public/"));
app.use(express.json())

const methodOverride = require('method-override')

const mongoose = require('mongoose');
const Comment = require('./models/comment');
// mongoose.connect('mongodb://localhost:27017/iic-event', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Mongo Open');
//     })
//     .catch(err => {
//         console.log('Mongo error! Close');
//     });
// const db = 'mongodb+srv://nithya-user:nithya-user@cluster0.r2cay.mongodb.net/iic-event?retryWrites=true&w=majority'
mongoose.connect('mongodb+srv://nithya-user:nithya-user@cluster0.r2cay.mongodb.net/iic-event?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false });
// mongoose.connect(db).then(() => {
//     console.log('success');
// }).catch((err) => console.log('error!', err));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    res.render('comments/home');
})
app.get('/event', async (req, res) => {
    res.render('comments/event');
})


app.get('/event/:id', async (req, res) => {

    const { id } = req.params;
    if( !mongoose.Types.ObjectId.isValid(id) ) return false;

    const solution = await Comment.findById(id)
    res.render('comments/show', { solution });
})
app.get('/event/:id/edit', async (req, res) => {
    const { id } = req.params;
    if( !mongoose.Types.ObjectId.isValid(id) ) return false;

    const solution = await Comment.findById(id)
    res.render('comments/edit', { solution });
})
app.put('/event/:id', async (req, res) => {
    const { id } = req.params;
    if( !mongoose.Types.ObjectId.isValid(id) ) return false;

    let newSolution = {
        uname: req.body.uname,
        email: req.body.email,
        branch: req.body.branch,
        semester: req.body.semester,
        USN: req.body.usn,
        wrongSol: req.body.wrongSol,
        solution: req.body.solution
    }
    const solution = await Comment.findByIdAndUpdate(id, newSolution,{ runValidators: true, new: true });
    res.redirect(`/event/${solution._id}`);

})
app.post('/', async (req, res) => {
    let newSolution = new Comment({
        uname: req.body.uname,
        email: req.body.email,
        branch: req.body.branch,
        semester: req.body.semester,
        USN: req.body.usn,
        wrongSol: req.body.wrongSol,
        solution: req.body.solution
    })
    await newSolution.save();
    res.redirect(`/event/${newSolution._id}`);
})
const server = app.listen(3000, () => {
    console.log('Listening on 3000')
})