const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const port = 3000;
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');

const categories = ["action", "adventure", "sci-fi", "animation", "horror", "thriller", "fantasy", "mystery", "comedy", "family"];


const client = new MongoClient(process.env.DB_URI);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to Mongo DB server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// dit is tijdelijk totdat we echt een database hebben waar we
// de films uithalen
// bron: https://github.com/mikeleguedes/json-movie-list.git
const movies = [
  { "id": "black-panther", "name": "Black Panther", "year": 2018, "categories": ["action","adventure","sci-fi"],"storyline": "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past."},
  { "id": "incredibles-3", "name": "Incredibles 2", "year": 2018, "categories": ["animation","action","adventure"],"storyline": "While the Parr family has accepted its collective calling as superheroes, the fact remains that their special heroism is still illegal. After they are arrested after unsuccessfully trying to stop the Underminer, their future seems bleak. However, the wealthy Deavor siblings of Devtech offer new hope with a bold project to rehabilitate the public image and legal status of Supers, with Elastigirl being assigned on point to be the shining example. Now having agreed for now to stay at home to care of the kids, Mr. Incredible finds domestic life a daunting challenge, especially with baby Jack-Jack's newly emerged powers making him almost impossible to manage. However, Elastigirl soon has her own concerns dealing with the menace of a new supervillain, Screenslaver, who is wreaking havoc with his mind control abilities. Now, Elastigirl must solve the mystery of this enemy, who has malevolent designs on the world with the Parr family and friends key targets of this evil. Written by Kenneth Chisholm (kchishol@rogers.com)"},
  { "id": "halloween", "name": "Halloween", "year": 2018, "categories": ["horror","thriller"],"storyline": "Laurie Strode comes to her final confrontation with Michael Myers, the masked figure who has haunted her since she narrowly escaped his killing spree on Halloween night four decades ago."},
  { "id": "ad-astra", "name" : "Ad Astra", "year" : 2019, "categories" : ["adventure","fantasy","mystery","thriller","sci-fi"], "storyline" : "Thirty years ago, Clifford McBride led a voyage into deep space, but the ship and crew were never heard from again. Now his son -- a fearless astronaut -- must embark on a daring mission to Neptune to uncover the truth about his missing father and a mysterious power surge that threatens the stability of the universe."},
  { "id": "toy-story-4", "name" : "Toy Story 4", "year" : 2019, "categories" : ["animation","adventure","comedy","family","fantasy"],  "storyline" : "When a new toy called Forky joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy."}
];

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', (req, res) => {
    res.render('movielist', {title:'List of all movies', movies})
})
app.get('/movies/add', (req, res) => {
  res.render('add', {title: "Add movie", categories});
});
app.post('/movies/add', (req,res) => {
  const id = slug(req.body.name);
  const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
  movies.push(movie);
  res.render('moviedetails', {title: "Added a new movie", movie})
});
app.get('/movies/:movieId', (req, res) => {
    const movie = movies.find( movie => movie.id == req.params.movieId);
    res.render('moviedetails', {title: "Movie details", movie})
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});