var seeder = require('mongoose-seed');
const UserDB = require('../modals/user').model;
const shortid = require("shortid");
var data;



// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost/tutoringwebsite', async function() {
  // const data = await s2h.sdhelper();
  const user1 = await UserDB.findOne({'email':'seed1@gmail.com'});
  // console.log(user1);
  // console.log(user1._id);
  const user2 = await UserDB.findOne({'email':'seed2@gmail.com'});
  const user3 = await UserDB.findOne({'email':'seed3@gmail.com'});
  const t1id = shortid.generate();
  const t1c1id = shortid.generate();
  const t1c2id = shortid.generate();
  const t2id = shortid.generate();
  const t3id = shortid.generate();
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
      },
      {
        'model': 'request',
        'documents': [
          {
            day: 25,
            month: 4,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's 420",
            description: "seed2 requests 10 minutes of 420 with seed1, should involve tutor:seed1, student: seed2",
            location: "Flavor town",
            tutor: user1._id,
            student: user2._id,
            state: 0
          }
        ]
      },
      {
        'model': 'request',
        'documents': [
          {
            day: 26,
            month: 4,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's 420",
            description: "seed2 requests another 10 minutes of 420 with seed1, should involve tutor:seed1, student: seed2",
            location: "Flavor town",
            tutor: user1._id,
            student: user2._id,
            state: 2
          }
        ]
      },
      {
        'model': 'request',
        'documents': [
          {
            day: 5,
            month: 5,
            year: 2019,
            start_time: "4:20pm",
            end_time: "4:30pm",
            title: "It's 420",
            description: "seed3 requests 10 minutes of 420 with seed1, should involve tutor:seed1, student: seed3",
            location: "Flavor town",
            tutor: user1._id,
            student: user3._id,
            state: 0
          }
        ]
      },
      {
        'model': 'resource',
        'documents': [
          {
            title: "Seed1Upload1",
            description: "yes",
            link: "https://www.youtube.com/watch?v=TUjSn5NMZ-o",
            creator: user1._id
          }
        ]
      },
      {
        'model': 'resource',
        'documents': [
          {
            title: "Seed1Upload2",
            description: "true",
            link: "https://www.youtube.com/watch?v=ydmPh4MXT3g",
            creator: user1._id
          }
        ]
      },
      {
        'model': 'resource',
        'documents': [
          {
            title: "Seed1Upload3",
            description: "actualStudyMaterial",
            link: "https://www.w3schools.com/howto/howto_make_a_website.asp",
            creator: user1._id
          }
        ]
      },
      {
        'model': 'topic',
        'documents': [
          {
            id: t1id,
            creator: "seed2",
            title: "Looking for a buddy",
            description: "FOR 420",
            postDate: Date.now(),
            category: "health",
            comments: [t1c1id, t1c2id]
          }
        ]
      },
      {
        'model': 'comment',
        'documents': [
          {
            id: t1c1id,
            creator: "seed1",
            content: "YA YEET",
            postDate: Date.now(),
            topicId: t1id
          }
        ]
      },
      {
        'model': 'comment',
        'documents': [
          {
            id: t1c2id,
            creator: "seed4",
            content: "YA YEEEET",
            postDate: Date.now(),
            topicId: t1id
          }
        ]
      },
      {
        'model': 'topic',
        'documents': [
          {
            id: t2id,
            creator: "seed3",
            title: "I'm sad",
            description: "Somebody talk to me, please?",
            postDate: Date.now(),
            category: "social",
            comments: []
          }
        ]
      },
      {
        'model': 'topic',
        'documents': [
          {
            id: t3id,
            creator: "seed3",
            title: "Hi",
            description: "Anybody want to be my friend?",
            postDate: Date.now(),
            category: "social",
            comments: []
          }
        ]
      }
      
  ];    

      
  // Load Mongoose models
  seeder.loadModels([
    'modals/event.js',
    'modals/request.js',
    'modals/resource.js',
    'modals/topic.js',
    'modals/comment.js'
  ]);
 
  // Clear specified collections
  // **** this clears the current userdb, so seeding multiple times gives you the same db.
  seeder.clearModels(['event', 'request', 'resource', 'topic', 'comment'], function() {
    
    // console.log("data is: ")
    // console.log(data);
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
  
});

 
