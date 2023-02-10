//jshint esversion:6

const express = require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { urlencoded } = require("body-parser");

const app=express();
app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",
mongoose.connect("mongodb+srv://admin-pintu:1397pintu@maketodolist.ejaqkj4.mongodb.net/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to DB");
}).catch((err)=> console.log(err));

const itemsSchema = {
    name:String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name:"Welcome to your todolist!"
});
const item2 = new Item({
    name:"Hit the + button to add a new item."
});
const item3 = new Item({
    name:"Hit checkbox to delete an item."
});

const defaultItems =[item1,item2,item3];



const listSchema = {
    name:String,
    items:[itemsSchema]
}
const List = mongoose.model("List",listSchema);


app.get("/", function(req, res) {
   
    Item.find({},function(err,foundItems){
        if(foundItems.length ===0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully saved default items to DB");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
        
    });
    
  });

  app.get("/:customeListName",function(req,res){
    const customeListName = _.capitalize(req.params.customeListName);
    List.findOne({name:customeListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create new list
                const list= new List ({
                    name:customeListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customeListName);
            }else{
                //show existing list
                res.render("list", {listTitle:foundList.name, newListItems: foundList.items});
            }
        }
    });
    
  });

//   app.get("/:customListName",function(req,res){
//     const customListName = req.params.customListName;
//     List.findOne({name:customListName},function(err,foundlist){
//         if(!err){
//             if(!foundlist){
//                 console.log("Does")
//             }
//         }
//     })
    
//     const list = new List({
//        name:customListName,
//        items:defaultItems 
//     });
//     list.save();
//   });


app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name:itemName
    });
    if(listName=="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
    
    
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName=="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("Successfully deleted checked item");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
   
});

app.get("/work" , function(req,res){
    res.render("list", {listTitle: "Work List" , newListItems : workItems });
});



app.post("/work", function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req,res){
    res.render("about");
});

app.listen(4040,function(){
    console.log("server is running at 4040");
});