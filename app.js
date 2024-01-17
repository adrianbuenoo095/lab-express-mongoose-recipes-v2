const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";
const Recipe = require("./models/Recipe.model")
// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
mongoose
    .connect(MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch((err) => console.error("Error connecting to mongo", err));

// ...

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async (request, response) => {
    // Get back the data from the request
    console.log(request.body)
    const payload = request.body
    try {
        const newRecipe = await Recipe.create(payload)
        // return the new Recipe into the response
        response.status(201).json(newRecipe)
    } catch (error) {
        response.status(500).json({ error, message: 'Error while creating new Recipe' })
    }
})

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (request, response) => {
    const recipes = await Recipe.find()
    response.json(recipes)
})
//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:recipeId', async (request, response) => {
    const { recipeId } = request.params
    const oneRecipe = await Recipe.findById(recipeId)

    response.json(oneRecipe)
})

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:recipeId', async (request, response) => {
    console.log(request.body)
    const payload = request.body
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(request.params.recipeId, payload, { new: true })
        response.status(200).json(updatedRecipe)
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Something bad happened' })
    }
})

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete('/recipes/:recipeId', async (request, response) => {
    const { recipeId } = request.params
    try {
        const recipeToDelete = await Recipe.findByIdAndDelete(recipeId)
        response.status(204).json({ message: `${recipeToDelete.title} was remove from the db` })
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: 'Something bad happened' })
    }
})

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
