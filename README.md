## Greetings fellow Astroneer!

As a game I've sunken almost 100 hours into now, it should go without saying that I am totally in love with Astroneer. In all these hours of playing though I've noticed that I spend a lot of time trying to optimise my resource gathering when aiming to build some particular thingy.

For example let's say we want to focus on spacefaring as soon as possible. What does that entail? Let's see:
- At a mininum that means we need a Small Shuttle, plus a Solid-Fuel Thruster and seat.
- Researching and building a Vehicle Bay = Bytes and Compound
- Researching and building a Small Shuttle = Bytes and Aluminum
- But Aluminum also requires Laterite and a Smelting Furnace
- A Smelting Furnace requires Bytes, Compound and a platform to build it on
- etc. etc...
...and as you can see this can become quite complex - especially for late-game items! (The list for NanoCarbon Alloy for example is insane)

So in an attempt to make my life a little easier, I built a tool that - given some item name - spits out a list of all the resources you need to build a certain thingy, and draws some cute little interactive graphs showing what items depend on what other items. They look a little like constellations which I thought was pretty apt. Here's some screenshots:

### Large Platform B
![Large Platform B](https://i.imgur.com/2HzLwx0.png)

### Research Chamber
![Research Chamber](https://i.imgur.com/Gb88zkv.png)

### Iron
![Iron](https://i.imgur.com/ic2YThK.png)

### Atmospheric Condenser
![Atmospheric Condenser](https://i.imgur.com/0GqT3V1.png)

### NanoCarbon Alloy (INSANITY)
![NanoCarbon Alloy (INSANITY)](https://i.imgur.com/FggbEFs.png)

It's at a super early stage at the moment but I think it already provides some good value to the community, so I thought I thought I'd share it and get as much feedback as I can! You can play with it at: http://astroneer.panthalassa.digital.

Some known issues and planned improvements are:
- Some of the dependencies are wrong (Smelting Furnace doesn't require Resin, etc.) but I'll get those issues ironed out
- Include some useful information about certain resources i.e. only available on Arid
- Take some of these dependencies into account - e.g. it's unlikely you'll find enough Iron on Terran to build a Large Platform C, so maybe make spacefaring a "suggested" dependency?
- At the moment some dependencies are summed up when they shouldn't be - you don't need more than one printer for a big long chain of items that all require a printer.
- Make some dependencies optional, based on whether or not you already have them - you always start with a medium printer so it shouldn't strictly be applied as a dependency. 
