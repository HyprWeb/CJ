const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const methods = {};
const _ = require("lodash");
const ObjectId = require("mongodb").ObjectId;

async function _isNormalDay(params) {
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
                                  _disseminateRewards(_formatData(params, users));
                                }
                              }
                            );
                          } else {
                            _disseminateRewards(_formatData(params, users));
                          }
                        });
                      } else {
                        _disseminateRewards(_formatData(params, users));
                      }
                    });
                  } else {
                    _disseminateRewards(_formatData(params, users));
                  }
                });
              } else {
                _disseminateRewards(_formatData(params, users));
              }
            });
          } else {
            _disseminateRewards(_formatData(params, users));
          }
        });
      }
    });
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
  }
}

function _distributeRewards(userId, amount, orderId) {
  _insertBalance(userId, amount, orderId);
  _updateBalance(userId, amount, orderId);
}

async function _insertBalance(userId, amount, orderId) {

  const query = db.collection("t_rewards").insertMany([
    {
      user_id: userId,
      reward_balance: amount,
      order_id: orderId,
      reward_status: "pending",
      date_created: new Date(),
    },
  ]);

  return await query;
}

async function _updateBalance(userId, amount, orderId) {
  const u_id = new ObjectId(userId);

  const query = await db.collection("users").find({ _id: u_id });

  query.toArray(function (err, docs) {
    docs.forEach((documents) => {
      const updated_reward = documents.reward + amount;
      db.collection("users").updateOne(
        { _id: u_id },
        { $set: { reward: updated_reward } }
      );

      db.collection("t_rewards_history").insertMany([
        {
          user_id: userId,
          order_id: orderId,
          old_reward: documents.reward,
          new_reward: updated_reward,
          date_created: new Date(),
        },
      ]);
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

methods.insertRewards = async (req, res) => {
  allRewards()
    .then((result) => processRewards(result, req))
    .catch((error) => {
      console.log(error);
    });

  res.json({ response: "success" });
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
  }
}

function ifHasReverseParams(request) {

}

async function processRewards(items, request) {
  try {
    return new Promise(function (resolve, reject) {
      const markUp = request.body.markUp;
      const orderId = request.body.orderId;
      const userId = request.body.userId;
      const reverse = request.body.reverse;

      const lastItem = items.find(
        (item) => item.name.toLowerCase() === "reverse day"
      );
      const day = _.toNumber(lastItem.percent);
      const is_reverse_day = (reverse === undefined) ? isReverseDay(day) : reverse;

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
            _disseminateRewards(params);
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
          _isNormalDay(params);
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function _disseminateRewards(params) {
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
    hyprId: "62936cbe78de8a9e0588bab4", //
  };

  params[values].docs.map((item, index) => {

    let amount = _.round( (accessibles.markUp * _.toNumber(item.percent)) / 100, 2);

    if (_.toLower(item.name) === accessibles.recruiter && accessibles.is_reverse_day) {
      if (accessibles.userCount > 0) {
        const totalPercent = accessibles.rIndex + accessibles.uIndex;

        amount =
        _.round( (accessibles.markUp * (totalPercent / 100)) / accessibles.userCount, 2);

        accessibles.users.map((userItem) => {
          console.log(`recruited: ${userItem.id}, amount: ${amount}`);
          _distributeRewards(userItem.id, amount, accessibles.orderId);
        });
      }
    } else if (_.toLower(item.name) === accessibles.recruiter_upline) {
      if (accessibles.userCount === accessibles.recruiterUplineCount) {
        return;
      }

      amount =
      _.round (amount / (accessibles.userCount - accessibles.recruiterUplineCount), 2);

      for (let i = index; i < accessibles.userCount; i++) {
        console.log(
          `recuiter upline: ${accessibles.users[i].id}, amount: ${amount}`
        );
        _distributeRewards(accessibles.users[i].id, amount, accessibles.orderId);
      }
    } else if (_.toLower(item.name) === accessibles.hypr) {
      // _distributeRewards(accessibles.hyprId, amount, accessibles.orderId);
      console.log(`hypr: ${accessibles.hyprId}, amount: ${amount}`);
    } else {
      if (
        accessibles.userCount === accessibles.isOnlyOneUser &&
        index === accessibles.isOnlyOneUser
      ) {
        return;
      }

      if (accessibles.is_reverse_day) {
        console.log(`reverse day: ${accessibles.userId}, amount: ${amount}`);
        _distributeRewards(accessibles.userId, amount, accessibles.orderId);
      } else {
          if (accessibles.users[index] !== undefined) {
            console.log(
              `normal: ${accessibles.users[index].id}, amount: ${amount}`
            );
            _distributeRewards(accessibles.users[index].id, amount, accessibles.orderId);
          }
        
      }
    }
  });
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
  }
}

methods.recruiteMember = async (req, res) => {
  
  const data = req.body.team;

  const team = data.map(v => ({...v, date_created: new Date() }))

  const query = db.collection("r_teams").insertMany(team);

  (query) ? res.json({ response: "success" }) : res.status(500).send({ error: "500" });

};

methods.updator = async (req, res) => {

  const userId = req.body.userId;
  const collectionName = req.body.collection;
  const valuesToUpdate = req.body.values;

  const u_id = new ObjectId(userId);

  const query = db.collection(collectionName).updateOne(
    { _id: u_id },
    { $set: valuesToUpdate }
  );
  
  (query) ? res.json({ response: "success" }) : res.status(500).send({ error: "500" });

};

module.exports = methods;
