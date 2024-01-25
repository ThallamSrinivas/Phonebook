//import express and fs module
const express = require('express');
const fs = require('fs')
// create an instance of express and declare port
const app = express();
const port = 8000;

let data = fs.readFileSync('./contacts.json', 'utf8');
data = JSON.parse(data)

app.use(express.json())    // <==== parse request body as JSON
//home page
app.get('/', function(req, res){  
    console.log('Hello from get home page')
    res.send("Welcome to phonebook app");
 });

// get a contact by phonenumber(if given) else return all contacts
app.get('/contacts', function(req, res){ 
    console.log('Hello from contacts page')
    const phonenumber=req.query.phonenumber
    if(phonenumber){
        data.forEach((item)=>{
            if(item.phone==phonenumber){
                return res.send(item);
            }
        })
        return res.send('phone number not found');
    } 
    res.send(data);
 });

// search the contact by first name or last name 
app.get('/search', function(req, res){ 
    console.log('Hello from search page')
    let name=req.query.Name
    data.forEach(element => {
        if(element.firstName===name || element.lastName===name){
            return res.send(element);
        }
    });
    return res.send(`${name} not found in the contacts list`)
 });

// function to check if the new contact already exist in contacts 
function duplicate(data,new_data){
    let flag=0
    data.forEach((item)=>{if(item.phone===new_data.phone){flag=1}})
    return flag
}
// add new contact to the contacts list
app.post('/add_contact', function(req, res){
    console.log('Hello from add_contact page')
    const new_data=req.body;
    if (duplicate(data,new_data)){
    console.log('number already exist in contact list');
    }
    else{
        data.push(new_data);
        fs.writeFile('./contacts.json', JSON.stringify(data), {
            encoding: "utf8",flag: "w",mode: 0o666}, err => {
            if (err) {
              console.error(err);
            } else {
                console.log('contact added successfully'); 
            }
          });
    }
    res.send(data);
 });
// delete the given contact from contact list 
app.delete('/delete',function(req,res){
    console.log('Hello from delete page')
    const phonenumber=req.query.phonenumber
    updated_data=[]
    data.forEach((item)=>{
        if(item.phone==phonenumber){
            //pass
        }
        else{
            updated_data.push(item)  
        }
    })
    if (updated_data.length==data.length){
        res.send('contact not found')
        return 
    }
    fs.writeFile('./contacts.json', JSON.stringify(updated_data), {
        encoding: "utf8", flag: "w", mode: 0o666}, err => {
        if (err) {
          console.error(err);
        } else {
            console.log('contact deleted successfully'); 
        }
      });
    return res.send(updated_data);
});
// start the server at given port
app.listen(port,(error)=>{
    if(error){console.log(`Can't start server, ${error}`)}
    else{console.log(`Server is up and running at port:${port}`)}
})
