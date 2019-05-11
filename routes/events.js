const mongoCollections = require("../config/mongoCollections");
const eventCollection = mongoCollections.events;
const userCollection = mongoCollections.users; // the user database. Technically should be the "User Profile" database? Where it stores the user info like name, position, etc.
const {ObjectId} = require('mongodb');

const checkObjectId = function checkObjectId(id) {
  if (!(id instanceof ObjectId)){
    try{
      if(typeof id === 'undefined') throw 'Specified Id is undefined';
      id = ObjectId(id);
    } catch (e) {
      throw 'Unable to parse ObjectId';
    }
  }
  return id;
}

const getAll = async function getAll(){
  const events = await eventCollection();
  const allEvents = await events.find().toArray();

  return allEvents;
}

const getById = async function getById(id) {
  const checkedId = checkObjectId(id);
  const events = await eventCollection();
  const foundEvent = await events.findOne({ _id: checkedId });
  if(!foundEvent) throw `Event (${checkedId}) was not found!`;
  const users = await userCollection();
  const eventCreator = await users.findOne(
    { _id: foundEvent.creator },
    { projection: { _id: 1, firstName: 1, lastName: 1 } }
  );

  foundEvent.creator = eventCreator;
  return foundEvent;
}

// find event(s) related to the user(attendee of event), return an Array of events
const getByAttendee = async function getByAttendee(uid){
    const checkedId = checkObjectId(uid);
    const events = await eventCollection();
    //const users = await userCollection();
    const foundEvents = await events.find({ "attendees": {_id: checkedId} }).toArray(); // Reference -> https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
    return foundEvents;
}
// we can use the result of this function to highlight dates on each user's calendar

// helper function for *create*, check if a user exists
const chkuid = async function chkuid(id){
    const users = await userCollection();
    const user = await users.findOne({ _id: id });
    if (!user) throw `Specified creator (${id}) does not exist!`;
}


// @parem: creator(id), day(num), month(num), year(num), start_time(num), end_time(num), title(string), description(string), location(string), attendees(array of id)
const create = async function create(creator, day, month, year, start_time, end_time, title, description, location, attendees){
  const events = await eventCollection();
  //const checkedId = checkObjectId(creator);

  //chkuid(checkedId); // check if user exists

  // type check
  //if(typeof day !== "number" || month !== "number" || year !== "number" || start_time !== "number" || end_time !== "number") throw 'day, month, year, start_time and end_time must be numbers';
  if(typeof title !== 'string' || typeof description !== 'string' || typeof location !== 'string') throw 'Title, description and location must be strings!';
  // type check attendees array
  /*attendees.forEach(function(value){
    var aId = checkObjectId(value);
    chkuid(aId);
  })*/
  // passed type check
  
  const result = await events.insertOne({ creator, day, month, year, start_time, end_time, title, description, location, attendees});
  return result.ops[0];
}

// does not support *update* yet

const remove = async function remove(id){
  const checkedId = checkObjectId(id);
  const events = await eventCollection();
  const deletedEvent = await getById(checkedId);
  await events.deleteOne({ _id: checkedId });
  return {
    deleted: true,
    data: deletedEvent
  }
}


module.exports = {
  getAll,
  getById,
  getByAttendee,
  create,
  remove
};
// getAll -> gets all the events in db
// getById -> gets the event with given ID
// getByAttendee -> gets an ARRAY of events that all contain the given ID of attendee
// create -> creates an event, with all the info provided
// remove -> removes an event by its ID