const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

//middleware

app.use(cors());
app.use(express.json())

//mongoDb altes

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;

    // console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


 
              //JWT verifyToken 


async function verifyJWT(req, res, next) {
    const authHeder = req.headers.authorization;
    if (!authHeder) {
        return res.status(401).send('This person unAuthorization access')
    }

    const token = authHeder.split(' ')[1];
    jwt.verify(token, process.env.ACCSS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(402).send({ message: "forbidden access" })
        }

        req.decoded = decoded;
        next()
    })

}

async function run() {

    try {
        const CetegoriesCars = client.db('Car-Shop_Datas').collection('Categories_Cars');
        const allCarCollection = client.db('Car-Shop_Datas').collection('All-Products');
        const BookingCar = client.db('Car-Shop_Datas').collection('BookingCar');
        const AllUser = client.db('Car-Shop_Datas').collection('All-Users');
        const adverticCollection = client.db('Car-Shop_Datas').collection('All-Advertic');

         //  all categories collections

        app.get('/cetegories', async (req, res) => {
            const query = {};
            const result = await CetegoriesCars.find(query).toArray();
            res.send(result);
        })

    
        // categories/:Id filter

        app.get('/cetegories/:id', async (req, res) => {
            const product = req.params.id;
            const query = { id: product };
            const result = await allCarCollection.find(query).toArray();
            res.send(result);
        })

         // all review person add

         app.post('/productAdd', async (req, res) => {
            const review = req.body;
            const result = await allCarCollection.insertOne(review);
            res.send(result)
        })

        app.get('/allProduct/:email', async (req, res) => {
            const user = req.params.email
            const query = { email: user };
            const result = await allCarCollection.find(query).toArray();
            res.send(result)
        })

            // all collection

         app.get('/allProduct', async (req, res) => {
            const query = {};
            const result = await allCarCollection.find(query).toArray();
            res.send(result)
        })

             // Booking Car Modal information

        app.post('/booking', async (req, res) => {
            const boking = req.body;
            const result = await BookingCar.insertOne(boking);
            res.send(result);
        })


        //Advertise Car Modal information


        app.post('/advertic', async (req, res) => {
            const boking = req.body;
            const result = await adverticCollection.insertOne(boking);
            res.send(result);
        })


            //Booking receive on email user 

        app.get('/advertic/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await adverticCollection.find(query).toArray();
            res.send(result);
        })


            //Booking receive on email user 

        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await BookingCar.find(query).toArray();
            res.send(result);
        })

                //get booking

        app.get('/bookings', async (req, res) => {
            const query = {};
            const result = await BookingCar.find(query).toArray();
            res.send(result);
        })

              //Admin panel users

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await AllUser.insertOne(users);
            res.send(result);
        })

        // all user  information mongodb add

        app.get('/users', async (req, res) => {
            const query = {};
            const result = await AllUser.find(query).toArray();
            res.send(result)
        })

        // seller emaill

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email: email };
            const result = await AllUser.find(query).toArray();
            res.send(result)
        })

     


    }
    catch (error) {
        console.log(error.name, error.message, error.stack);
    }

}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('DeshiCar server is running well')
})
app.listen(port, () => console.log(`DeshiCar server is running ${port}`))