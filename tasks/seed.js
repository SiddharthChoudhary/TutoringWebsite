var seeder = require('mongoose-seed');
 
// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost/tutoringwebsite', function() {
 
  // Load Mongoose models
  seeder.loadModels([
    'modals/user.js'
    // 'app/model2File.js'
  ]);
 
  // Clear specified collections
  // **** this clears the current userdb, so seeding multiple times gives you the same db.
  seeder.clearModels(['User'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'User',
        'documents': [
          {
            email: "seed1@gmail.com",
            username: "seed1",
            hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq", // it's "asd123"
            profile: {
              firstname: "Seed",
              lastname: "One",
              bio: "I am Seed One. I am a student as well as a tutor. I tutor maths. I have a number of posts, and requests",
              gender: "Male",
              tutor_position: "Taken",
              subject: "Maths"
            }
          }
        ]
    },
    {
      'model': 'User',
      'documents': [
        {
          email: "seed2@gmail.com",
          username: "seed2",
          hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq", // It's "asd123"
          profile: {
            firstname: "Seed",
            lastname: "Two",
            bio: "I am Seed Two. I am a student but not a tutor.",
            gender: "Male",
            tutor_position: "None",
            subject: "None"
          }
        }
      ]
    },
    {
      'model': 'User',
      'documents': [
        {
          email: "seed3@gmail.com", // this one does not have a profile. But can be added after logging in
          username: "seed3",
          hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq" // It's "asd123"
        }
      ]
    },
    {
      'model': 'User',
      'documents': [
        {
          email: "seed4@gmail.com",
          username: "seed4",
          hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq", // it's "asd123"
          profile: {
            firstname: "Seed",
            lastname: "Four",
            bio: "I am Seed Four. I am a student as well as a tutor. I tutor maths. I am a dummy tutor account",
            gender: "Male",
            tutor_position: "Taken",
            subject: "Maths"
          }
        }
      ]
  }
];