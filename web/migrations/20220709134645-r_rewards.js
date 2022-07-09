module.exports = {
  async up(db, client) {
    db.createCollection(
      "r_rewards",
      {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "percent", "date_created"],
            properties: {
              name: {
                bsonType: "string",
              },
              date_created: {
                bsonType: "date",
              },
              date_updated: {
                bsonType: "date",
              },
              percent: {},
            },
          },
        },
        validationLevel: "strict",
        validationAction: "error",
      }
    );
    const now = new Date();
    const query = db.collection("r_rewards").insertMany([
      {
        name: "Buyer",
        percent: 20,
        date_created: now,
      },
      {
        name: "Recruiter",
        percent: 20,
        date_created: now,
      },  
      {
        name: "Recruiter Upline",
        percent: 40,
        date_created: now,
      },
      {
        name: "Hypr",
        percent: 20,
        date_created: now,
      },
      {
        name: "Reverse Day",
        percent: 1,
        date_created: now,
      },
    ]);

    return await query;
  },

  async down(db, client) {
    return await db.collection("r_rewards").drop();
  },
};
