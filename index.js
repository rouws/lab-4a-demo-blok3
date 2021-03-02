const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb')
const dotenv = require('dotenv').config();
const categories = ["action", "adventure", "sci-fi", "animation", "horror", "thriller", "fantasy", "mystery", "comedy", "family"];

// set database variable to null
let db = null;
// function connectDB
async function connectDB () {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
// call function connectDB
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log('We have a connection to Mongo!')
  })
  .catch( error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', async (req, res, next) => {
    // create an empty list of movies
    let movies = {}
    // look for alle movies in database and sort them by year and name into an array
    movies = await db.collection('movies').find({},{sort: {year: -1, name: 1}}).toArray();
    // render the page of template 'movieList'
    res.render('movielist', {title: 'List of all movies', movies})
});
app.get('/movies/add', (req, res) => {
  res.render('add', {title: "Add movie", categories});
});
app.post('/movies/add', async (req,res) => {
  const id = slug(req.body.name);
  const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
  await db.collection('movies').insertOne(movie);
  res.render('moviedetails', {title: "Added a new movie", movie});
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