### Postman
https://api.postman.com/collections/25112428-4a876b50-ff8e-4631-9e9b-5e25f68cdc58?access_key=PMAT-01HQXRD67XSKSNTRYE06DDKPKH

# Design ideas
- With the size of thousands of tasks, user can experience better in loading time if user get the list by pagination. This adds an ability for user to jump to certain pages without much scrolling

# Possible enhancements
- convert project to typescript
- move APIs to `/api` route for better clarity and possible api versioning
- database collection should be moved to middleware
- implement caching for better performance and less hitting on database
- improve validation schema

# How to run
1. create new `.env` file using the `.env.example` content
2. start the server by running `yarn dev`
