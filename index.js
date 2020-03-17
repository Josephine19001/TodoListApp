const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/getdate.js");
//creating app using express
const app = express();

//variables
let items = [];
let workItems = [];

// //inport
// import getdate from '/getdate.js'

//setting app engine to ejs(templateing)
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname+"/public"))

app.get("/", (req, res) => {
  
let day = date.getDay();
    res.render('list',
        {
            listTitle:day,
            newListItem: items
        }
     );
});
app.post("/", (req, res) => {
    let item =req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work")
        console.log(workItems);
    }else{
        items.push(item);
        res.redirect("/");
    }
    
    
})
app.get("/work" , (req,res) => {
    res.render('list',
    {
        listTitle:"Work List",
        newListItem: workItems
    }

    )
})
app.get("/about", (req,res) =>{
    res.render("about");
})
//listening ports
app.listen(3000, () => {
    console.log("Server started on port 3000");
})
