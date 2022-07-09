module.exports = {
  async up(db, client) {
    const query = db.createCollection("r_teams", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["recruiter_id", "recruited_id", "date_created"],
          properties: {
            recruiter_id: {
              bsonType: "string",
            },
            recruited_id: {
              bsonType: "string",
            },
            date_created: {
              bsonType: "date",
            },
            date_updated: {
              bsonType: "string",
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
    return await db.collection("r_teams").drop();
  }
};
