# Boomerang server
Hackaton 2019 backend server

## Description
Server provides REST interface to
- create user
- delete user
- check user authorization
- save new report
- request report by report id
- send 1 MB data
- request 1 MB data

There are two versions of server. **server-in-memory.js** is a server without persistent storage. server.js stores data in MongoDB database.