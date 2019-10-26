"use strict";
const express = require('express');
const moment = require('moment');
const app = express();
const port = 8080;

let reportId = 0;
let userId = 0;
let reports = [];
let users = [];

const data1mb = "x".repeat(1024 * 1024);

app.use(express.json());

app.get('/rest', (req, res) => res.json({status: 'Boomerang server'}));

function addReport(report) {
    let result = {error: "Can't add report", status: 400};
    if (report.hasOwnProperty("account")
        && report.account.hasOwnProperty("email")
        && report.account.hasOwnProperty("password")
        && checkAuth(report.account.email, report.account.password).value === true) {
        report.id = reportId;
        report.account.password = null;
        report.measurementTime = moment().format("DD-MM-YYYY HH:mm:ss").toString(); // "23-10-2019 12:28:32"
        reports.push(report);
        result = {value: reportId, status: 200};
        reportId++;
    }
    return result;
}

function getReport(id) {
    let result = {error: "Unknown report report", status: 404};
    if (reports[id] !== undefined) {
        result = {value: reports[id], status: 200};
    }
    return result;
}

function addUser(name, email, password) {
    const userPresent = users.filter(user => user.email === email).length !== 0;
    let result = {error: "User already exists", status: 400};
    if (!userPresent) {
        users = users.filter(user => user.email !== email);
        users.push({name: name, email: email, password: password, id: userId++});
        result = {value: "User added", status: 200};
    }
    return result;
}

function getUser(email) {
    const filteredUsers = users.filter(user => user.email === email);
    return filteredUsers.length !== 0 ? filteredUsers[0] : null;
}

function deleteUser(id) {
    users = users.filter(user => user.id !== +id);
    return {value: "User deleted", status: 200};
}

function checkAuth(email, password) {
    return {value: users.filter(user => user.email === email && user.password === password).length !== 0, status: 200};
}

app.put('/rest/measurements', (req, res) => {
    console.log(new Date().toString() + '\t' + "Received report");
    res.json(addReport(req.body));
});

app.get('/rest/measurements/:id', (req, res) => {
    console.log(new Date().toString() + '\t' + "Requested report");
    res.json(getReport(req.params.id));
});

app.post('/rest/measurements', (req, res) => {
    console.log(new Date().toString() + '\t' + "Requested report");
    const userReports = reports.filter((report) => {
        return report.account.email === req.body.email
            && moment(req.body.startTime, "DD-MM-YYYY HH:mm:ss").unix() <= moment(report.measurementTime, "DD-MM-YYYY HH:mm:ss").unix()
            && moment(report.measurementTime, "DD-MM-YYYY HH:mm:ss").unix() <= moment(req.body.endTime, "DD-MM-YYYY HH:mm:ss").unix();
    });
    res.json({value: userReports});
});

app.post('/rest/users', (req, res) => {
    res.json(addUser(req.body.name, req.body.email, req.body.hash));
});

app.delete('/rest/users/:id', (req, res) => {
    res.json(deleteUser(req.params.id));
});

app.get('/rest/users', (req, res) => {
    res.json(users.map((user) => {
        return {name: user.name, email: user.email, id: user.id};
    }));
});

app.post('/rest/auth', (req, res) => {
    res.json(checkAuth(req.body.email, req.body.password));
});

app.get('/rest/1mb/', (req, res) => {
    console.log(new Date().toString() + '\t' + "Requested 1mb");
    res.send(data1mb);
});

app.put('/rest/1mb/', (req, res) => {
    console.log(new Date().toString() + '\t' + "Received 1mb");
    res.send({"status": "success"});
});

app.listen(port, () => console.log(`Boomerang server listening on port ${port}`));