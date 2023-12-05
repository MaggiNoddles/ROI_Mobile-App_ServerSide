//import all of the required node modules
const express = require('express');
var cors = require('cors');
const staffService = require('./staffService.js');
const port = 3333;

//create an async 
(async () => {

    //call on init function from staffService to centralise data 
    await staffService.init();
    //initialize new express app
    const app = express();
    //register body parser
    app.use(cors());
    app.use(express.json());

    //convert existing data to storage database and remember to turn off staff.js (if not in use)
    //so no duplication occurs after initial bulk addition
    //Postman Test - http://localhost:3333/api/addstaff
    app.get('/api/addstaff', async (req, res) => {
        const staffData = require('./initialData/staff.js');        
        for(const staff of staffData){
            await staffService.add(staff);
        }
        //console log to confirm bulk upload of existing data 
        console.log(`Bulk upload success: ${staffData}`);
        //Postman Test - should show all existing data in new database
        res.json(staffData);
    });

    //REGISTER and GET, all users handler
    //Postman Test - http://localhost:3333/api/staff
    app.get('/api/staff', async (req, res) => {
        let staff = await staffService.getAll();
        //Postman Test - all staff data should show in response
        res.json(staff);
    });

    //REGISTER and GET (VIEW) single user data, by id handler
    //Postman Test - http://localhost:3333/api/staff/30592138-6c92-4020-8df1-118a6dd97bd5
    app.get('/api/staff/:id', async (req, res) => {
        const id = req.params.id;
        const staff = await staffService.getById(id);
        //console log to confirm user specific data (by ID) retrieved successfully
        console.log("Retrieved staff data by ID successfully");      
        //Postman Test - all data for specific user should show in response (based on user ID)
        res.json(staff);
    });
    

    //REGISTER and POST (ADD), new user handler, automatically generate ID, API and store with centralised data location
    //Postman Test - http://localhost:3333/api/staff
    app.post('/api/staff', async (req, res) => {
        const staffData = req.body;

        const staff = {
            id: null,
            name: staffData.name,
            phone: staffData.phone,
            deptID: staffData.deptID,
            deptName: staffData.deptName,
            street: staffData.street,
            city: staffData.city,
            state: staffData.state,
            zip: staffData.zip,
            country: staffData.country
        };

        await staffService.add(staff);
        //console log for success new addition of staff
        console.log("New staff added successfully");
        //Postman Test - new user data should show in response
        res.json(staff);
    });

    //REGISTER and UPDATE single user, by id handler
    //Postman Test - http://localhost:3333/api/staff/924cf8f9-b33d-4f2d-bf03-6db9198e7359
    app.put('/api/staff/:id', async (req, res) => {
        const id = req.params.id;

        const staffData = req.body;

        const staff = {
            id: id,
            name: staffData.name,
            phone: staffData.phone,
            deptID: staffData.deptID,
            deptName: staffData.deptName,
            street: staffData.street,
            city: staffData.city,
            state: staffData.state,
            zip: staffData.zip,
            country: staffData.country
        };
        
        await staffService.update(staff);
        //console log for success
        console.log(`${staff} data sucessfully updated`);
        //Postman Test - new user data should show in response
        res.json(staff);
    });

    //REGISTER and DELETE single user, by id handler (Function Only Available by Server Administrator)
    //Postman Test - http://localhost:3333/api/staff
    app.delete('/api/staff/:id', async (req, res) => {
        const id = req.params.id;
        await staffService.remove(id);
        //console log for deletion success
        console.log("Staff deletion success");
        //Postman Test - deletion success response should display
        res.json("Staff deletion success");
    });

    //confirmation web server is up and running displays in console
    app.listen(port, () => {
        console.log(`ROI Staff API listening on port ${port}!`);
    });
})(); 