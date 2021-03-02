const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const port = 3000;
const mongo = require('mongodb')
const dotenv = require('dotenv').config();
const categories = ["action", "adventure", "sci-fi", "animation", "horror", "thriller", "fantasy", "mystery", "comedy", "family"];

let db = null;
const url = process.env.DB_URI
const options = { useUnifiedTopology: true };
mongo.MongoClient.connect(url, options, (err, client) => {
  if (err) { throw err }
  db = client.db(process.env.DB_NAME)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', async (req, res, next) => {
    const movies = await db.collection('movies').find({},{sort: {year: -1, name: 1}}).toArray();
    res.render('movielist', {title: 'List of all movies', movies})
});
app.get('/movies/add', (req, res) => {
  res.render('add', {title: "Add movie", categories});
});
app.post('/movies/add', (req,res) => {
  // const id = slug(req.body.name);
  // const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
  // movies.push(movie);
  // res.render('moviedetails', {title: "Added a new movie", movie})
});
app.get('/movies/:movieId', async (req, res) => {
    const movie = await db.collection('movies').findOne({ id: req.params.movieId });
    res.render('moviedetails', {title: "Movie details", movie})
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});