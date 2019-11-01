# Boomerang server
Hackathon 2019 backend server

## Description
The server allows the mobile application and WEB applications to work with reports. User authorization is implemented on the server. Any user can request a report, while only authorized users can send a report.
Server provides REST interface to
- create user
- delete user
- check user authorization
- save new report
- request report by report id
- send 1 MB data
- request 1 MB data

There are two versions of server. **server-in-memory.js** is a server without persistent storage. server.js stores data in MongoDB database.
## API
### Add new user
*POST* request */rest/user*. 

Request body: 
```
{
    name: String,
    email: String,
    hash: String
}
```

Response:
```
{
    error: String,
    value: String,
    status: Number
}
```


### Request users list
*GET* request */rest/users*

Response:
```
[
    {
        name: String, 
        email: String,
        id: Number
    }
]
```

### Delete user
*DELETE* request */rest/users/{id}*

### Check user data
*POST* request  */rest/auth*

Request body:
```
{
    email:  String,
    password: String
}
```

### Send report
*PUT* request */rest/measurements*
Request:
```
{
    account: {
        email: String,
        password: String
    },
    value: Object
}
```
Request value field has no defined structure. Only registered users can put new report.

Response:
```
{
    value: Number,
    status: 200
}
```

### Request report by id
*GET* request */rest/measurements/:id*

### Request report by user email and dates interval

*POST* request */rest/measurements*

Request body:
```
{
    email: String,
    startTime: "DD-MM-YYYY HH:mm:ss",
    endTime: "DD-MM-YYYY HH:mm:ss"
}
```

### Request 1 MB of data

*GET* request */rest/1mb/*

### Send 1 MB of data

*PUT* request */rest/1mb/*
Actually there is no limitation of data but the task required reading 1 MB of data.
