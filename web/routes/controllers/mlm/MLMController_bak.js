const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const methods = {};
const _ = require("lodash");
const mongo = require("mongodb");
const { order } = require("paypal-rest-sdk");
const { reject, compose } = require("async");
const { use } = require("passport");
const ObjectId = require("mongodb").ObjectId;

methods.insertRewards = async (req, res) => {
  const percentIndex = 4;
  const users = [];
  const markUp = 2.1; // req.body.markUp;
  const orderId = 1121; // req.body.orderId;
  // const userId = "62936cbe78de8a9e0588bab0"; // employee id
  const userId = "62936cbe78de8a9e0588bab3"; // member id

  const query = await db
    .collection("r_rewards")
    .find({})
    .project({ name: 1, percent: 1, _id: 0 });

  query.toArray(function (err, docs) {
    try {
      if (_.isString(docs[percentIndex].percent)) {
        const day = _.toNumber(docs[percentIndex].percent);
        // const is_reverse_day = reverseDay(day);
        const is_reverse_day = reverseDay(day);

        if (is_reverse_day) {
          const recruit = db
            .collection("r_teams")
            .find({ recruiter_id: { $eq: userId } })
            .project({ id: "$recruited_id", _id: 0 });

          recruit.toArray(function (err, recruitData) {
            recruitData.forEach((documents) => {
              users.push(documents);
            });

            _isReverseDay(docs, is_reverse_day, users, markUp, orderId, userId);
          });
        } else {
          _isNormalDay(docs, userId, is_reverse_day, markUp, orderId);
        }
      }

      if (err) return res.status(500).send({ error: err });
      res.json({ response: users });
    } catch (error) {
      console.log(error);
    }
  });
};

function _isReverseDay(docs, is_reverse_day, users, markUp, orderId, userId) {
  try {
    _disseminateRewards(docs, users, is_reverse_day, markUp, orderId, userId);
  } catch (error) {
    console.log(error);
  }
}

async function _isNormalDay(docs, userId, is_reverse_day, markUp, orderId) {
  try {
    const users = [];
    const resultIndex = 0;
    let temporaryUserId = userId;
    let checkHasDownlines = false;

    for (let i = 0, j = 7; i < j; i++) {
      const allRecruits = await db
        .collection("r_teams")
        .find({ recruited_id: { $eq: temporaryUserId } })
        .project({ id: "$recruiter_id", _id: 0 });

      allRecruits.toArray(function (err, recruitData) {
        recruitData.forEach((documents) => {
          // console.log(documents);
          users.push(documents);
        });

        if (i == j - 1) {
          // console.log(users);
          // _disseminateRewards(docs, users, is_reverse_day, markUp, orderId, userId);
        }
      });

      const files = await db
        .collection("r_teams")
        .find({ recruited_id: { $eq: temporaryUserId } })
        .project({ id: "$recruiter_id", _id: 0 })
        .toArray();

      if (files[resultIndex] !== undefined) {
        temporaryUserId = files[resultIndex].id;
      } else {
        console.log("undefined");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function _isNormalDayV2(params) {
  const value = 0;
  const accessibles = {
    docs: params[value].docs,
    userId: params[value].userId,
    orderId: params[value].orderId,
    markUp: params[value].markUp,
    is_reverse_day: params[value].is_reverse_day,
    downlineCount: 7,
  };
  const users = [];
  let data = null;
  _getCurrentRecruiter(accessibles.userId)
    .then((first) => {
      if (checkResultCount(first)) {
        users.push(...first);
        _getCurrentRecruiter(first[value].id).then((second) => {
          if (checkResultCount(second)) {
            users.push(...second);
            _getCurrentRecruiter(second[value].id).then((third) => {
              if (checkResultCount(third)) {
                users.push(...third);
                _getCurrentRecruiter(third[value].id).then((fourth) => {
                  if (checkResultCount(fourth)) {
                    users.push(...fourth);
                    _getCurrentRecruiter(fourth[value].id).then((fifth) => {
                      if (checkResultCount(fifth)) {
                        users.push(...fifth);
                        _getCurrentRecruiter(fifth[value].id).then((sixth) => {
                          if (checkResultCount(fifth)) {
                            users.push(...sixth);
                            _getCurrentRecruiter(sixth[value].id).then(
                              (seventh) => {
                                if (checkResultCount(seventh)) {
                                  users.push(...seventh);
                                  _disseminate(_formatData(params, users));
                                }
                              }
                            );
                          } else {
                            _disseminate(_formatData(params, users));
                          }
                        });
                      } else {
                        _disseminate(_formatData(params, users));
                      }
                    });
                  } else {
                    _disseminate(_formatData(params, users));
                  }
                });
              } else {
                _disseminate(_formatData(params, users));
              }
            });
          } else {
            _disseminate(_formatData(params, users));
          }
        });
      } else {
        return false;
      }
    })
    .then(console.log("success"));
}

function checkResultCount(data) {
  return data.length !== 0 ? true : false;
}

function _formatData(params, users) {
  const value = 0;
  const data = [
    {
      docs: params[value].docs,
      users: users,
      is_reverse_day: params[value].is_reverse_day,
      markUp: params[value].markUp,
      orderId: params[value].orderId,
      userId: params[value].userId,
    },
  ];

  return data;
}

async function _getCurrentRecruiter(_id) {
  try {
    return new Promise(function (resolve, reject) {
      db.collection("r_teams")
        .find({ recruited_id: { $eq: _id } })
        .project({ id: "$recruiter_id", _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("clean resources");
  }
}

function _disseminateRewards(
  docs,
  users,
  is_reverse_day,
  markUp,
  orderId,
  userId
) {
  const userCount = users.length,
    recruiterIndex = 1,
    recruiterUplineIndex = 2;
  const recruiterUplineCount = 2;

  _.forEach(docs, function (value, index) {
    let amount = (markUp * _.toNumber(value.percent)) / 100;
    if (_.toLower(value.name) === "recruiter") {
      if (userCount > 0) {
        const rIndex = docs[recruiterIndex].percent;
        const uIndex = docs[recruiterUplineIndex].percent;

        amount = _.round((markUp * ((rIndex + uIndex) / 100)) / userCount, 2);

        _.forEach(users, function (uval, uindex) {
          console.log(`recuiter: ${uval.id}, amount: ${amount}`);
        });
      }
    } else if (_.toLower(value.name) === "recruiter upline") {
      if (userCount === recruiterUplineCount) {
        return false;
      }
      amount = amount / (userCount - recruiterUplineCount);

      for (let i = index; i < userCount; i++) {
        console.log(`recuiter upline: ${users[i].id}, amount: ${amount}`);
      }
    } else if (_.toLower(value.name) === "hypr") {
      const hyprId = "628ce4aba8e2e706bb30dc78";
      console.log(`hypr: ${hyprId}, amount: ${amount}`);
    } else {
      if (userCount === 1 && index === 1) {
        return false;
      }

      if (is_reverse_day) {
        console.log(`reverse day: ${userId}, amount: ${amount}`);
        // _distributeRewards(currentLoggedId, amount, orderId);
      } else {
        // _distributeRewards(users[index].id, amount, orderId);
        console.log(`normal: ${users[index].id}, amount: ${amount}`);
      }
    }
  });
}

function _distributeRewards(userId, amount, orderId) {
  _insertBalance(userId, amount, orderId);
  _updateBalance(userId, amount);
}

async function _insertBalance(userId, amount, orderId) {
  const now = new Date();
  const query = db.collection("t_rewards").insertMany([
    {
      user_id: userId,
      reward_balance: amount,
      order_id: orderId,
      reward_status: "pending",
      date_created: now.toISOString(),
      date_updated: "",
    },
  ]);

  return await query;
}

async function _updateBalance(userId, amount) {
  const u_id = new ObjectId(userId);

  const query = await db.collection("users").find({ _id: u_id });

  query.toArray(function (err, docs) {
    docs.forEach((documents) => {
      const updated_reward = documents.reward + amount;
      db.collection("users").updateOne(
        { _id: u_id },
        { $set: { reward: updated_reward } }
      );
    });
  });
}

function findAll(col, saerch, callback) {
  db.collection(col)
    .find({ recruiter_id: { $eq: 16 } })
    .project({ id: "$recruited_id", _id: 0 })
    .toArray((err, docs) => {
      if (err) {
        console.log(err);
      }

      console.log(docs);
      callback(docs);
    });
}

function isReverseDay(day) {
  const today = new Date();
  return day === today.getDay() ? true : false;
}

methods.insertRewardsV2 = async (req, res) => {
  allRewards()
    .then((result) => processRewards(result))
    .catch();

  res.json({ response: [] });
};

async function users() {
  try {
    return new Promise(function (resolve, reject) {
      db.collection("users")
        .find()
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("clean resources");
  }
}

async function getAllRecuits(userId) {
  try {
    return new Promise(function (resolve, reject) {
      db.collection("r_teams")
        .find({ recruiter_id: { $eq: userId } })
        .project({ id: "$recruited_id", _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("clean resources");
  }
}

async function processRewards(items) {
  try {
    return new Promise(function (resolve, reject) {
      const markUp = 2.1; // req.body.markUp;
      const orderId = "1110"; // req.body.orderId;
      // const userId = "62936cbe78de8a9e0588bab2"; // employee id
      const userId = "62936cbe78de8a9e0588bab5"; // member id

      const lastItem = items.find(
        (item) => item.name.toLowerCase() === "reverse day"
      );
      const day = _.toNumber(lastItem.percent);
      const is_reverse_day = false;
      try {
        if (is_reverse_day) {
          getAllRecuits(userId).then((result) => {
            const params = [
              {
                docs: [...items],
                users: [...result],
                is_reverse_day: is_reverse_day,
                markUp: markUp,
                orderId: orderId,
                userId: userId,
              },
            ];

            _disseminate(params);
            resolve();
          });
        } else {
          const params = [
            {
              docs: [...items],
              is_reverse_day: is_reverse_day,
              markUp: markUp,
              orderId: orderId,
              userId: userId,
            },
          ];

          _isNormalDayV2(params);
        }
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("clean resources");
  }
}

async function _disseminate(params) {
  const values = 0;
  const accessibles = {
    recruiter: "recruiter",
    recruiter_upline: "recruiter upline",
    hypr: "hypr",
    userCount: params[values].users.length,
    rIndex: parseInt(params[values].docs[1].percent),
    uIndex: parseInt(params[values].docs[2].percent),
    markUp: params[values].markUp,
    is_reverse_day: params[values].is_reverse_day,
    userId: params[values].userId,
    users: params[values].users,
    orderId: params[values].orderId,
    recruiterUplineCount: 2,
    isOnlyOneUser: 1,
    destroy: false,
    hyprId: "62936cbe78de8a9e0588bab4", //
  };

  console.log(params[values].users);
  // params[values].docs.map((item, index) => {
  //   if (accessibles.destroy) {
  //     return;
  //   }

  //   let amount = (accessibles.markUp * _.toNumber(item.percent)) / 100;

  //   if (_.toLower(item.name) === accessibles.recruiter) {
  //     if (accessibles.userCount > 0) {
  //       const totalPercent = accessibles.rIndex + accessibles.uIndex;

  //       amount =
  //         (accessibles.markUp * (totalPercent / 100)) / accessibles.userCount;

  //       accessibles.users.map((userItem) => {
  //         console.log(`recruited: ${userItem.id}, amount: ${amount}`);
  //         // _distributeRewards(userItem.id, amount, accessibles.orderId);
  //       });
  //     }
  //   } else if (_.toLower(item.name) === accessibles.recruiter_upline) {
  //     if (accessibles.userCount === accessibles.recruiterUplineCount) {
  //       destroy = true;
  //       return;
  //     }

  //     amount =
  //       amount / (accessibles.userCount - accessibles.recruiterUplineCount);

  //     for (let i = index; i < accessibles.userCount; i++) {
  //       console.log(
  //         `recuiter upline: ${accessibles.users[i].id}, amount: ${amount}`
  //       );
  //       // _distributeRewards(accessibles.users[i].id, amount, accessibles.orderId);
  //     }
  //   } else if (_.toLower(item.name) === accessibles.hypr) {
  //     // _distributeRewards(accessibles.hyprId, amount, accessibles.orderId);
  //     console.log(`hypr: ${accessibles.hyprId}, amount: ${amount}`);
  //   } else {
  //     if (
  //       accessibles.userCount === accessibles.isOnlyOneUser &&
  //       index === accessibles.isOnlyOneUser
  //     ) {
  //       destroy = true;
  //       return;
  //     }

  //     if (accessibles.is_reverse_day) {
  //       console.log(`reverse day: ${accessibles.userId}, amount: ${amount}`);
  //       // _distributeRewards(accessibles.userId, amount, accessibles.orderId);
  //     } else {
  //       console.log(
  //         `normal: ${accessibles.users[index].id}, amount: ${amount}`
  //       );
  //       // _distributeRewards(accessibles.users[index].id, amount, accessibles.orderId);
  //     }
  //   }
  // });
}

async function allRewards() {
  try {
    return new Promise(function (resolve, reject) {
      db.collection("r_rewards")
        .find()
        .project({ name: 1, percent: 1, _id: 0 })
        .toArray(function (err, items) {
          err ? reject(err) : resolve(items);
        });
    });
  } catch (error) {
    console.log(error);
  } finally {
    // console.log("clean resources");
  }
}
module.exports = methods;
