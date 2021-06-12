const express =  require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define path for express config
const publicDirectory = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup handlebars engine and view location
app.set('views', viewsPath);
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)


//Setup static directory to serve
app.use(express.static(publicDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title : 'Weather',
        name: 'Handlebars'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About Page'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Post your queries'
    })
})


app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide address term'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}) => {
        if(error){
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }
            res.send({
                forecast:forecastData,
                location,
                address: req.query.address
            })
        })
        
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage : 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage : 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})