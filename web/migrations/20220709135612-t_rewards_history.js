module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    const query = db.createCollection("t_rewards_history", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user_id", "order_id", "old_reward", "new_reward", "date_created"],
          properties: {
            user_id: {
              bsonType: "string",
            },
            order_id: {
              bsonType: "string",
            },
            old_reward: {},
            new_reward: {},
            date_created: {
              bsonType: "date",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    return await query;

  },

  async down(db, client) {
    return await db.collection("t_rewards_history").drop();
  }
};
