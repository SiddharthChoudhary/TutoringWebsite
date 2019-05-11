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
  seeder.clearModels(['user'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'user',
        'documents': [
          {
            email: "seed1@gmail.com",
            username: "seed1",
            hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq", // I think it's "asd123" ? could be wrong
            createdAt: '2019-05-10 19:04:56.260',
            updatedAt: '2019-05-10 19:04:56.260'
          }
        ]
    },
    {
      'model': 'user',
      'documents': [
        {
          email: "seed2@gmail.com",
          username: "seed2",
          hashedPassword: "$2a$10$/8p/dzNqYbUkGhBdGhNMve8A4KSPbYt1CMbL4kqXTT3EG1aj0kKSq", // I think it's "asd123" ? could be wrong
          createdAt: '2019-05-10 19:04:56.260',
          updatedAt: '2019-05-10 19:04:56.260'
        }
      ]
  }
];