## Event Sourcing in Typescript

This is a simple step-by-step workshop to get you started with event sourcing in Typescript. Following this workshop
should take you through the following steps:

1. First you'll learn how to implement an event reducer to create a state from a list of events.
2. Then you'll expand that event reducer to handle events that happen across multiple entities.
3. You'll then learn how to implement an event store to persist events to a database.

Once you're ready to start the workshop, please check out the "starting-point" branch which will be the starting point
of the workshop

### Our example domain
For this workshop, we will be using a simple banking domain. We will be implementing a simple set of events for opening
bank accounts, moving money between accounts, and closing bank accounts. While there are many arguments for and against
using event sourcing in a banking domain, the intuitive value for being able to fully audit transactions and not having
the ability to "lose" transactions makes it a good domain to demonstrate event sourcing.

### Going through the workshop alone

While the workshop is designed to be run in person, you can still attempt to run through it on your own. Instructions
for going through the workshop alone are available in the [Steps.md](./Steps.md) file.

### Prerequisites
This workshop has the following prerequisites:
 - Git
 - Node.js 14.x or newer
 - Postgres
 - Yarn
 - A Postgres Database created by the name of "eventsourcing"

To check if you meet those prerequisites, run the following commands:

```bash
./check.sh
```

If you want to adjust your database name or credentials, edit the [`ormconfig.json`](./ormconfig.json) file and run
the `./check.sh` script again.
