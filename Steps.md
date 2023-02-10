## Steps for the Workshop

While this workshop is designed to be run in person, you can still attempt to run through it on your own. If you want to
try that, this section will guide you through the steps. If you get stuck on any of the steps, you can check out a branch
by the name of that step to see how it's implemented.

### Introduction

There are many articles and blog posts that explain the concepts of Event Sourcing and most of them will do it better
than I can. This workshop is designed to be a hands-on introduction to Event Sourcing by implementing it in code, rather
than an introduction in the why's of it all. 

With that said, there are still probably some important things that you should know before you start this workshop. The
first one is that this workshop is not designed to convince you to implement Event Sourcing in your system. Event Sourcing
will instantly 10x the complexity of your application, and it's not a decision that should be taken lightly. Rather, the
aim of this workshop is to introduce a different perspective on the meaning of "Source of Truth" and how we think about
the data in our systems.

In Event Sourcing, rather than just treating the records in our database as the source of truth we think of them as
artifacts of our real data: The Events. The events are the source of truth and the records in the database are just
one way of representing them. 

Take for example a simple TODO List. In a traditional system, you simply create a TODO Item
record in the database. If you want to mark that item as complete, you update the record in the database. If you want to
delete that item, you delete the record in the database. In an Event Sourcing system, none of those actions directly touch
the TODO item in the database. Instead, you create an event that says "TODO Item Created", "TODO Item Completed", and
"TODO Item Deleted". Those events get saved to our main store, and to get the current state of the TODO item, we simply
loop over the events and apply them to the state.

If you think this sounds like it makes reading our data more complicated, you're right! But this workshop will show you
how we use various tools of Event Sourcing to not only make that process easier, but also to make it more flexible than
the traditional approach.

### Step 1: Implementing an Event Reducer

Event sourcing, at it's core, is about creating your end state from a list of events. In Event Sourcing, we treat this
list of events as the source of truth for our system. This means that we can always recreate the state of our system by
looping over the list of events and applying them to our state. In this workshop, we will call this the "event reducer".

The event reducer is a function that takes a list of events and a state and returns a new state. For the first step of
this workshop, take a look at [`BankAccount.spec.ts`](./src/BankAccount.spec.ts). It's a test file which contains the
tests for an event reducer function that you will implement.

### Step 2: Implementing an Event Reducer for Multiple Entities

With your reducer implemented, you can see that the events we have defined are all for a single entity. In a real system
we may want to have events that we can apply to multiple entities. For example, we may want to have an event that
transfers money from one account to another.

An important concept of both Domain Driven Design and Event Sourcing is that of Aggregate Roots. In Event Sourcing, and
in DDD, two sibling entities should not be able to act on each other directly. For example, one bank account should not
be able to transfer money to another bank account. Instead, we look at their "Parent" which is the "Aggregate Root". All
actions that can be taken on the sibling entities should be taken through the Aggregate Root. 

In this step, we will implement an Aggregate Root which is our Bank. The Bank Aggregate Root will contain the multiple
Bank Accounts and will be responsible for applying events to the Bank Accounts. If you look at [`Bank.spec.ts`](./src/Bank.spec.ts),
you will see that the first step is to implement an event reducer that can accept banking events for multiple accounts
all as one stream. 

Your task for this step is to implement the reducer that will pass the tests. After that is done, implement a new event
to transfer money from one account to another. The reducer should throw an error if you attempt to transfer money from
a closed account or to a closed account. It should also throw an error if the account the money is being transferred from
doesn't have sufficient balance.

### Step 3: Storing our Events in the Database

Being able to recreate our state from a list of events is great, but it's not very useful if we can't persist those events
to a database. In this step, we will implement an event store that will persist our events to a database. As you may have
already noticed, we are using TypeORM to persist our entities to the database. As this workshop is concerned with Event 
Sourcing rather than the specifics of TypeORM, you may find it convenient to check out the `src/infrastructure/entities` 
and `src/infrastructure/migrations` directories from the `step-3` branch.

Whether you choose to check out the entity and migrations already provided or implement them yourself, the **starting**
point for this step should have your database with a table for the events. For this step, all that's required is to 
create an EventStore with two functionalities:

1. `getEvents()` - Get all events from the database
2. `applyEvents(events)` Apply the events and save them to the database

An important thing to note is that the `applyEvents()` method should be transactional. This means that if the events fail
to apply to the state, the events should not be saved to the database. A good example the transfer funds event that you
implemented in the previous step. If we simply saved the event to the database before checking if applying them would
throw an error, we would end up with an event in the database that would throw an error when we attempt to rebuild the
state.

### Step 4: Implementing Projections

If you remember in the Introduction I mentioned that Event Sourcing makes our data harder to read, this is the point 
where we start looking at the tools that Event Sourcing provides to make that easier. More specifically, we're now going
to look at Projections. Think of Projections similar to making shadow puppets on the wall. They're based on the events,
but we can reshape them to make them look however we want, without loosing our original data.

We do this by publishing our events into what we call an "Event Bus". Our projections will then subscribe to certain
types of events on that bus and then act on them to store the data in a way that is easier to read. By doing this, we
can easily and flexibly create representations of our data that are easier to read. 

For example, if you want to get a list of all the TODO items that are currently incomplete, you would create a projection 
that listens to your events and when a "Create TODO Item" event is published, it would write that item to a separate
database table. When a "Complete TODO Item" event is published, it would remove that item from the table. This way, you
end up with a table of all the TODO items that are currently incomplete. If you've got a large database with millions of
rows, this can be a much more efficient way of getting that data than querying the entire database for all TODO items and
filtering them in memory.

An additional benefit of this approach is that it allows us to create projections after the fact. Because they are built
up by listening to events, when we create a new projection, it will automatically loop over all the events that have
published and apply them to the projection, as if it had been listening to them all along.

The first step to this is, naturally, to create an Event Bus. If you take a look at [`EventBus.spec.ts`](./src/EventBus.spec.ts),
you'll see a set of tests that you will need to pass. The EventBus should have the following functionality:

1. Handlers should be able to subscribe to events
2. Handlers should be able to subscribe to multiple events
3. Handlers should be able to subscribe to the same event multiple times
4. Multiple handlers should be able to subscribe to the same event
5. You should be able to publish an event that has no handlers

Once you've got the EventBus passing all the tests, try to make a simple projection that listens to the events of 
opening and closing bank accounts, and stores a list of only currently open accounts in an array. In the real world, we
would then write that array to a database table, but for this workshop, we'll just keep it in memory.
