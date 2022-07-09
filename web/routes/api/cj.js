const app = require('@forkjs/group-router');

const ApiController = require('./../controllers/cj/APIController');

const isAuth = (req, res, next) => {

    fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({email: "hyprweb@gmail.com", password: "02cf4f3d305f4312b865f8e8eed59c64"})
  })
    .then((response) => {
        if (!response.ok) {
            throw 'error on fetching token';
        }
        return response.json();
    })
    .then((response) => {
        if (!response.data.accessToken) return res.status(401).send("Access denied");

        // if (document.cookie.split(';').some((item) => item.trim().startsWith('auth='))) {
        //     res.clearCookie('auth');
        // }

        if(response.data.accessToken) {
            res.cookie('auth', response.data.accessToken);
            next();
        }   
    })
    .catch(err => {
      if(err.name === 'AbortError') {
          console.log('Timed out');
      }}
  )
};

//URL mapping
app.group("/cj/api/v1", () => {
    app.post("/search-products", ApiController.searchProducts);
    app.router.use(isAuth);
    app.post("/get-token", ApiController.getToken);
    // products and variants

    app.get("/get-products", ApiController.getProducts);
    app.get("/get-variants", ApiController.getVariants);

    // shopping
    app.post("/create-order", ApiController.createOrder);
    app.get("/list-order", ApiController.listOrder);
    app.get("/fetch-order", ApiController.getOrder);
    app.post("/delete-order", ApiController.deleteOrder);
    app.post("/confirm-order", ApiController.confirmOrder);

    // logistics
    app.post("/freight-calculate", ApiController.FreightCalculate);
    app.get("/countries", ApiController.getCountryCode);
    app.get("/logistics", ApiController.getLogistics);
    app.get("/tracking-details", ApiController.trackingDetails);

    app.post("/products-sync", ApiController.productSync);
    app.post("/get-sync-products", ApiController.getSyncProducts);
});

module.exports = app.router;