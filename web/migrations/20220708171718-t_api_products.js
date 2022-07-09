module.exports = {
  async up(db, client) {
    const collectionName = "t_api_products";

    db.createCollection(`${collectionName}`, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "pid",
            "product_information",
            "page_number",
            "category_name",
            "product_name",
            "price",
          ],
          properties: {
            pid: {
              bsonType: "string",
            },
            product_information: {
              bsonType: "object",
            },
            page_number: {
              bsonType: "string",
            },
            category_name: {
              bsonType: "string",
            },
            product_name: {
              bsonType: "string",
            },
            product_sku: {
              bsonType: "string",
            },
            price: {
              bsonType: "string",
            },
            cache_key: {
              bsonType: "string",
            },
            shop: {
              bsonType: "string",
            },
            product_add_price: {},
            markup_price: {}
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    const data = require('../collections/t_api_products');
    db.collection(`${collectionName}`).insertMany(data);
    // TODO learn tags and weight when creating index
    return await db
      .collection(`${collectionName}`)
      .createIndex({
        product_name: "text",
        category_name: "text",
        product_sku: "text",
      });
  },

  async down(db, client) {
    return await db.collection("t_api_products").drop();
  },
};
