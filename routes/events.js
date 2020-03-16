const router = require('express').Router();
const Events = require('../model/Events');
const { eventsValidation } = require('../validation');
const verify = require('./verifytoken');

router.post('/insertEvent', verify, async (req, res) => {
    let userId = req.user._id;
        console.log(req.body)
       //Validation before creating an event
       const { error } = eventsValidation(req.body);
       if(error) return res.status(400).send(error.details[0].message);

       const event = new Events({
        title: req.body.title,
        description: req.body.description,
        isDone: req.body.isDone,
        userId: userId
        });
        console.log(event)

        try{
            const savedEvent = await event.save();
            console.log('saved',savedEvent)
            res.send(savedEvent);
        } catch(err) {
            res.status(400).send(err);
        }
        
})

router.get('/getEvents', verify, async (req, res) => {
    let userId = req.user._id;
    console.log(userId);

    const events = await Events.find({ userId: userId});
    console.log(events)
    if(events.length === 0) return res.status(400).send('No events');
    res.send(events);
})

router.post('/updateEvent', verify, async (req, res) => {
    let eventData = {
        title: req.body.title,
        description: req.body.description,
        isDone: req.body.isDone
    }
    const { error } = eventsValidation(eventData);
    if(error) return res.status(400).send(error.details[0].message);
    
    const updatedEvent = await Events.findOneAndUpdate
                                        ({_id : req.body.eventId},
                                        {$set: {title: req.body.title, description: req.body.description, isDone: req.body.isDone}}
                                        );
   if(updatedEvent) res.send('Event Updated!');
})

router.post('/deleteEvent', verify, async (req, res) => {
    let eventIds = req.body.eventId;
   
    const DeletedEvent = await Events.deleteMany( { eventId : eventIds } );
   if(DeletedEvent) res.send('Event Deleted!');
})

module.exports = router;