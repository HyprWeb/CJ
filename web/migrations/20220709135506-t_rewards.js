module.exports = {
  async up(db, client) {
    db.createCollection("t_rewards", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["order_id", "user_id", "reward_balance", "reward_status", "date_created"],
          properties: {
            order_id: {
              bsonType: "string",
            },
            user_id: {
              bsonType: "string",
            },
            reward_status: {
              bsonType: "string",
            },
            date_created: {
              bsonType: "date",
            },
            date_updated: {
              bsonType: "date",
            },
            reward_balance: {},
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
  },

  async down(db, client) {
    return await db.collection("t_rewards").drop();
  }
};
