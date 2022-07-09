module.exports = {
  async up(db, client) {
    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["reward", "firstname", "lastname", "role"],
          properties: {
            profile_image: {
              bsonType: "string",
            },
            firstname: {
              bsonType: "string",
            },
            lastname: {
              bsonType: "string",
            },
            role: {
              bsonType: "string",
            },
            email: {
              bsonType: "string",
            },
            phone_number: {
              bsonType: "string",
            },
            birthday: {
              bsonType: "string",
            },
            country: {
              bsonType: "string",
            },
            country_name: {
              bsonType: "string",
            },
            address: {
              bsonType: "string",
            },
            shipping_address: {
              bsonType: "string",
            },
            area: {
              bsonType: "string",
            },
            city: {
              bsonType: "string",
            },
            landmark: {
              bsonType: "string",
            },
            state: {
              bsonType: "string",
            },
            about: {
              bsonType: "string",
            },
            username: {
              bsonType: "string",
            },
            password: {
              bsonType: "string",
            },
            referral_link: {
              bsonType: "string",
            },
            referral_user_id: {
              bsonType: "string",
            },
            access_token: {
              bsonType: "string",
            },
            signupType: {
              bsonType: "string",
            },
            startDate: {
              bsonType: "string",
            },
            verified_date: {
              bsonType: "date",
            },
            date_created: {
              bsonType: "date",
            },
            date_updated: {
              bsonType: "date",
            },
            status: {},
            reward: {},
            pincode: {},
            otp: {},
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    const now = new Date();
    const query = db.collection("users").insertMany([
      {
        reward: 2.8,
        firstname: "niño",
        lastname: "gunda",
        role: "ceo",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.8,
        firstname: "edcel",
        lastname: "zenarosa",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.2,
        firstname: "farjan",
        lastname: "dechali",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.4,
        firstname: "niranjan",
        lastname: "bujisat",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.6,
        firstname: "atom",
        lastname: "macalla",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 4.8,
        firstname: "rodel",
        lastname: "duterte",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 4.6,
        firstname: "yessiwi",
        lastname: "bussiwi",
        role: "employee",
        date_created: now,
        status: 1,
      },
    ]);

    return await query;
  },

  async down(db, client) {
    return await db.collection("users").drop();
  }
};