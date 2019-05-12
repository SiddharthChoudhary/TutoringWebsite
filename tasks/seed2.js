var seeder = require('mongoose-seed');
const UserDB = require('../modals/user').model;
var data;

 
// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost/tutoringwebsite', async function() {
  // const data = await s2h.sdhelper();
  const user1 = await UserDB.findOne({'email':'seed1@gmail.com'});
  // console.log(user1);
  // console.log(user1._id);
  const user2 = await UserDB.findOne({'email':'seed2@gmail.com'});
  const user3 = await UserDB.findOne({'email':'seed3@gmail.com'});
    // Data array containing seed data - documents organized by Model
    data = [
      {
        'model': 'event',
        'documents': [
          {
            day: 20,
            month: 3,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's 420",
            description: "10 minutes of 420, should involve tutor:seed1, student: seed2",
            location: "Flavor town",
            tutor: user1._id,
            student: user2._id,
            attendees: [{_id:user1._id}, {_id:user2._id}]
          }
        ]
      },
      {
        'model': 'event',
        'documents': [
          {
            day: 20,
            month: 3,
            year: 2019,
            start_time: "4:30pm",
            end_time: "4:40pm",
            title: "It's NOT 420, but...",
            description: "ANOTHER 10 minutes of 420, should involve tutor:seed1, student: seed2",
            location: "Flavor town",
            tutor: user1._id,
            student: user2._id,
            attendees: [{_id:user1._id}, {_id:user2._id}]
          }
        ]
      },
      {
        'model': 'event',
        'documents': [
          {
            day: 21,
            month: 3,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's NOT 420, but...",
            description: "SAME SHIT DIFFERENT DAY, should involve tutor:seed1, student: seed2",
            location: "Flavor town",
            tutor: user1._id,
            student: user2._id,
            attendees: [{_id:user1._id}, {_id:user2._id}]
          }
        ]
      },
      {
        'model': 'event',
        'documents': [
          {
            day: 13,
            month: 4,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's 420, but...",
            description: "Just a regular meeting, should involve tutor:seed1, student: seed3",
            location: "Flavor town",
            tutor: user1._id,
            student: user3._id,
            attendees: [{_id:user1._id}, {_id:user3._id}]
          }
        ]
      }
  ];    
      
  // Load Mongoose models
  seeder.loadModels([
    'modals/event.js'
  ]);
 
  // Clear specified collections
  // **** this clears the current userdb, so seeding multiple times gives you the same db.
  seeder.clearModels(['event'], function() {
    
    console.log("data is: ")
    console.log(data);
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
  
});

 
