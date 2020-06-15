const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const app = express();
const _ = require('lodash')

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true, useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Please put the name todoItem, name not specified"]
  }
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: 'Eat'
})

const item2 = new Item({
  name: 'Drink'
})

const defaultItems = [item1, item2]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model('List', listSchema)


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  Item.find({}, function (error, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log("Successfully saved default items to database")
        }
      })
      res.redirect('/')
    } else {

      res.render('list',
        {
          listTitle: "Today",
          newListItem: foundItems
        }
      );
    }
  })

});

app.get("/:customListName", function (req, res) {
  let customListName = req.params.customListName
  customListName = _.capitalize(customListName)

  List.findOne({ name: customListName }, function (error, foundList) {
    if (!error) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save()
        res.redirect(`/${customListName}`)
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items
        })
      }
    }
  })
})

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listTitle = req.body.list

  const item = new Item({
    name: itemName
  })
  if (listTitle === "Today") {
    item.save()
    res.redirect('/')
  } else {
    List.findOne({ name: listTitle }, function (error, foundList) {
      foundList.items.push(item)
      foundList.save()
      res.redirect(`/${listTitle}`)
    })
  }

})
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkBox
  const listName = req.body.listName

  if (listName === 'Today') {
    Item.findByIdAndRemove({ _id: `${checkedItemId}` }, function (error) {
      if (error) {
        console.log(error)
      } else {
        console.log(`Successfully deleted item with ${checkedItemId}`)
        res.redirect('/')
      }
    })
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (error, foundList) {
      if (!error) {
        res.redirect(`/${listName}`)
      }
    })
  }

})


app.get("/about", (req, res) => {
  res.render("about");
})
//listening ports
app.listen(8000, () => {
  console.log("Server started on port 8000");
})
