const storage = require('node-persist');
const { v4: uuidv4 } = require('uuid');

//define and set centralised location for staff data to be stored and retrieved from
async function init() {
    //define options for node persist
    const options = {
        dir: './storage/staffData',
        stringify: JSON.stringify,
        parse: JSON.parse
    };

    await storage.init(options);
}
//Search function to return all staff details to staff contact directory list
async function getAll() {
    return await storage.values();
}

//Search function to return staff details by ID
async function getById(id) {
    const staff = await storage.getItem(id);
    if (staff) {
        return staff;
    } else {
        console.log(`Staff with id ${id} was not found.`);
        return null;
    }
}

//Create new user including ID and add to existing staff list
async function add(staff) {
    const id = uuidv4();
    staff.id = id; //=Id
    staff.updated = new Date();

    await storage.setItem(id, staff);
}

//Update existing user by ID and save to existing staff list
async function update(staff) {
    const existingStaff = await getById(staff.id);
    if (existingStaff) {

        // Update staff details
        existingStaff.name = staff.name;
        existingStaff.phone = staff.phone;
        existingStaff.deptID = staff.deptID;
        existingStaff.deptName = staff.deptName;
        existingStaff.street = staff.street;
        existingStaff.city = staff.city;
        existingStaff.state = staff.state;
        existingStaff.zip = staff.zip;
        existingStaff.country = staff.country;
        existingStaff.updated = new Date();

        // If updated successfully - create log success
        console.log(`Update ${staff.name} ${staff.id} details - successfully`);
        await storage.updateItem(existingStaff.id, existingStaff);
    } else {
        // If cannot save - create log error.
        console.log(`Could not update ${staff.name} ${staff.id} details.`);
        // console.log(`Could not update ${existingStaff.name} ${existingStaff.id} details.`);
        return null;    
    }
}

//server side function only - delete existing staff from database
async function remove(id) {
    const result = await storage.removeItem(id);
}

//call and export functions to app.js
module.exports = {
    init,
    getAll,
    getById,
    add,
    update,
    remove
};