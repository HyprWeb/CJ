const app = require('@forkjs/group-router');

const MLMController = require('./../controllers/mlm/MLMController');

app.group("/mlm/api/v1", () => {
    app.post("/mlm-disseminate-rewards", MLMController.insertRewards);
    app.post("/mlm-insert-team", MLMController.recruiteMember);
    app.post("/updator", MLMController.updator);
});

module.exports = app.router;

// const userId = "62936cbe78de8a9e0588bab2"; // employee id
// const userId = "62936cbe78de8a9e0588bab5"; // member id