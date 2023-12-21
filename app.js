const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

//specifies location of static files
app.use(express.static("public"));

//  Establishing a connection to database , doesn't work while using localhost use 0.0.0.0
mongoose.connect("mongodb://127.0.0.1:27017/toDoList",{useNewUrlParser: true});

//  Create a schema for database
const itemSchema = {
  name : String
};

//  Create a model using the above schema
//  Takes two parameters singular collection name , schema 
const Item = mongoose.model("Item" , itemSchema);

//  Mongoose Document
const item1 = new Item({
  name : "item 1"
});
const item2 = new Item({
  name : "item 2"
});
const item3 = new Item({
  name : "item 3"
});

const defaultItems = [item1 , item2 , item3];

//  Schema for list
const listSchema = {
  name : String,
  items : [itemSchema]
};

//  Create a model for list
const List = mongoose.model("List",listSchema);

//  home route
app.get("/",function(req,res){
  
  let day = date.getDate();

  //  fetch the items from the database, to console log use then( call back function)
  Item.find({}).then((items) => {

    // sends the data to the file list.ejs in views folder
    if( items.length === 0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }else{
      res.render("list",{listTitle: day, newListItems: items});
    }
  });
});

//  Custom route
app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;
  
  List.findOne({name : customListName}).then((err,foundList) =>{
    if (!err){
      if (!foundList){
        //  create a new List item and save it
        const list = new List({
          name : customListName,
          items : defaultItems
        });
      
        list.save();
        res.redirect("/" + customListName);
      }
    }
    else{
      // res.render("list",{listTitle: foundList.name, newListItems : foundList.items})
      console.log(foundList);
    }
  })  
  
});

//  To handle the post request
app.post("/",function (req,res) {

  let itemName = req.body.newItem; 
  
  const item = new Item({
    name : itemName
  });

  item.save();
  res.redirect("/");
});


//  To handle work route
app.get("/work",function(req,res){
  
  res.render("list",{listTitle:"Work List",newListItems: workItems});
});

//  To handle post request from work route
app.post("/work",function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


//  To handle about route
app.get("/about",function(req,res){
  res.render("about");
})

//  To handle delete route

app.post("/delete",function(req,res){
  
  const checkedItem = req.body.checkedItem;

  //  Find element by id passed and remove it
  Item.findByIdAndRemove(checkedItem).exec();

  res.redirect('/');
});

app.listen(3000,function(){
  console.log("server up and running");
})