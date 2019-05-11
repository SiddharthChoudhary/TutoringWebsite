const userData = require("./routes/events");
var mongoose = require('mongoose');
// var ObjectId = mongoose.Schema.Types.ObjectId;

async function main() {

  
  mongoose.connect('mongodb://localhost:27017/tutoringwebsite', {useNewUrlParser: true});

  var day=1
  var month=4
  var year=2019
  var start_time=12
  var end_time= 13
  var title="test1"
  var description="test1"
  var location="test1"
  var tutor="5cd495a8ba45e7dd984de5fa"
  var student = "5cd495c3ba45e7dd984de5fb"
  const attendees=[
    "5cd495a8ba45e7dd984de5fa","5cd495c3ba45e7dd984de5fb"
  ]
  await userData.create(day, month, year, start_time, end_time, title, description, location, tutor, student, attendees);
  

  day=5 // same month different day
  title="test2"
  description="test2"
  location="test2"
  await userData.create(day, month, year, start_time, end_time, title, description, location, tutor, student, attendees);

  start_time = 15 // same day differnt time
  end_time = 16
  title="test3"
  description="test3"
  location="test3"
  await userData.create(day, month, year, start_time, end_time, title, description, location, tutor, student, attendees);

  month=5 // different month
  title="test4"
  description="test4"
  location="test4"
  await userData.create(day, month, year, start_time, end_time, title, description, location, tutor, student, attendees);
  
  console.log("Done seeding database");
}

main();