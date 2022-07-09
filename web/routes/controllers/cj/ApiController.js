const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const redis = require("redis");
const redisPort = 6379;
const client = redis.createClient({ host: "redis", port: redisPort });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const methods = {};

var Shipping = function (
  fccode,
  logistic,
  products,
  address,
  city,
  country,
  sccode,
  name,
  phone,
  prov,
  zip
) {
  this.fromCountryCode = fccode;
  this.logisticName = logistic;
  this.products = products;
  this.shippingAddress = address;
  this.shippingCity = city;
  this.shippingCountry = country;
  this.shippingCountryCode = sccode;
  this.shippingCustomerName = name;
  this.shippingPhone = phone;
  this.shippingProvince = prov;
  this.shippingZip = zip;
};

var Freight = function (sccode = "CN", eccode, products) {
  this.startCountryCode = sccode;
  this.endCountryCode = eccode;
  this.products = products;
};

var Country = function () {
  const countryArray = countriesArray();
  const codeArray = countryCodeArray();

  const len = countryArray.length;

  let countries = [];
  for (let i = 0; i < len; i++) {
    countries[i] = new CountryObject(countryArray[i], codeArray[i]);
  }
  this.data = countries;
};

var CountryObject = function (name, code) {
  this.name = name;
  this.code = code;
};

var Logistics = function () {
  const logisticArray = logisticsArray();
  const dayArray = daysArray();

  const len = logisticArray.length;

  let logistics = [];
  for (let i = 0; i < len; i++) {
    logistics[i] = new LogisticsObject(logisticArray[i], dayArray[i]);
  }

  this.data = logistics;
};

var LogisticsObject = function (name, days) {
  this.name = name;
  this.days = days;
};

function logisticsArray() {
  return [
    "Wedenpost",
    "ePacket",
    "Pos Malaysia",
    "MYSG",
    "Bpost",
    "Singpost",
    "HKpost",
    "Turkey Post",
    "Swiss Post",
    "PostNL",
    "ePacket+",
    "USPS",
    "La Poste",
    "Yodel",
    "DHL Paket",
    "China Post Registered Air Mail",
    "AliExpress Standard Shipping",
    "Aliexpress Premium Shipping",
    "BPost+",
    "USPS+",
    "DHL",
    "Korea Post",
    "CJPacket Liquid",
    "YunExpress Germany Direct Line	",
    "YunExpress Italy Direct Line",
    "YunExpress Spain Direct Line",
    "YunExpress Austria Direct Line",
    "YunExpress Europe Direct Line",
    "CJPacket YT US",
    "YunExpress Canada Direct Line",
    "YunExpress Netherlands Direct Line",
    "YunExpress Brazil Direct Line",
    "YunExpress Denmark Direct Line",
    "YunExpress Britain Driect Economical Line",
    "YunExpress France Direct Economical Line",
    "YunExpress Australia Direct Line",
    "CJPacket Liquid Line",
    "CJPacket Liquid Post",
    "Grand Slam",
    "S.F. Express",
    "YanWen",
    "S.F China Domestic",
    "YTO China Domestic",
    "South Africa Special Line",
    "Brazil special line",
    "Liquid USPS",
    "BH DHL",
    "Electric PostNL",
    "FedEx-SmartPost",
    "CJPacket",
    "DHL+",
    "CJ Normal Express",
    "DHL Official",
    "DHL eCommerce",
    "Jewel Shipping",
    "CJPacket Australia",
    "Jewel Shipping+",
    "YunExpress Germany Economic Line",
    "China EMS",
    "Euro Post",
    "AUEXPIE",
    "SFC Canada Express Line",
    "DEEXP",
    "DEEXPLS",
    "MXEXP",
    "YunExpress Sweden Direct Line",
    "Spain special line",
    "DHL HongKong",
    "YTxpress-G",
    "Korea special line",
    "Yanwen Special Line Tracking Pack",
    "Jewel Shipping Flat",
    "DG Epacket",
    "SFC Brazil Line",
    "BJ cosmetics epacket",
    "YL Columbia Line",
    "YL Peru Line",
    "CJ to Shopee Facility China",
    "CJ to Lazada Facility China",
    "CJCOD",
    "EMS Guangzhou",
    "SFCQMDER",
    "CJPacket-Supplier",
    "SFC France Express Line",
    "CJPacket JL Express",
    "CJ France Quick Line",
    "CJ American Economic Line",
    "CJPacket-Tha",
    "CJ to Shopee Facility Thailand",
    "CJ to Lazada Facility Thailand",
    "Jewel Shipping Flat+",
    "Shenzhen  EUB",
    "CJ Special Line",
    "CJPacket Sea",
    "UPS",
    "Deutsche Post",
    "CJPacket Australia Line",
    "CJPacket YW Airline Ordinary",
    "DHL DE",
    "FedEx official",
    "CJPacket MY Sensitive",
    "ePacket Beijing Cream",
    "CJPacket-Sea Sensitive",
    "ePacket Yiwu",
    "CJPacket YW Ordinary",
    "CJPacket YW Sensitive",
    "CJPacket Sensitive GB",
    "CJPacket YDS US",
    "CJ to Shopee Facility Indonesia",
    "CJ to Lazada Facility Indonesia",
    "CJPacket Air",
    "CJPacket Railway",
    "CJPacket Land",
    "CJPacket Euro Ordinary",
    "CJPacket Liquid US",
    "CJPacket Sensitive JP",
    "CJPacket Euro Sensitive",
    "Other",
    "CJPacket Liquid AU",
    "CJPacket Special line",
    "CJPacket YT Euro",
    "CODCN",
    "CJPacket Sensitive CA",
    "CJPacket Oversize",
    "CJPacket Fast Line",
    "CJPacket Ordinary",
    "CJPacket Sensitive",
    "CJ Fulfillment Lazada Local",
    "CJ Fulfillment Shopee Local",
    "CJ Changhe",
    "CJPacket SFE US",
    "CJPacket  MY Sensitive",
  ];
}

function daysArray() {
  return [
    "7-20",
    "7-20",
    "10-45",
    "10-45",
    "7-20",
    "7-20",
    "7-20",
    "11-35",
    "15-60",
    "15-45",
    "5-15",
    "10-20",
    "4-12",
    "4-12",
    "4-12",
    "25-55",
    "19-39",
    "7-15",
    "15-25",
    "4-10",
    "3-7",
    "7-12",
    "7-30",
    "5-10",
    "5-10",
    "5-7",
    "5-10",
    "7-15",
    "12-22",
    "5-7",
    "5-10",
    "10-20",
    "7-15",
    "5-8",
    "5-12",
    "7-15",
    "20-60",
    "10-30",
    "7-9",
    "3-7",
    "2-3",
    "2-3",
    "2-3",
    "5-15",
    "16-25",
    "7-12",
    "6-9",
    "10-30",
    "10-15",
    "7-17",
    "3-7",
    "8-18",
    "3-7",
    "2-7",
    "5-15",
    "14-20",
    "3-6",
    "7-12",
    "5-15",
    "15-25",
    "5-12",
    "6-12",
    "6-12",
    "6-12",
    "7-10",
    "7-10",
    "4-10",
    "3-5",
    "5-12",
    "4-6",
    "6-10",
    "5-15",
    "7-20",
    "15-20",
    "7-20",
    "10-15",
    "15-17",
    "10-15",
    "10-15",
    "10-15",
    "15-40",
    "6-8",
    "3-5",
    "6-12",
    "6-18",
    "5-10",
    "10-18",
    "2-3",
    "2-3",
    "2-3",
    "5-7",
    "60",
    "22-40",
    "30-60",
    "6-10",
    "3-6",
    "10-22",
    "15-28",
    "1-2",
    "3-5",
    "14-30",
    "30-50",
    "10-20",
    "12-50",
    "10-18",
    "12-18",
    "12-18",
    "10-22",
    "2-3",
    "2-3",
    "9-22",
    "22-35",
    "10-25",
    "12-18",
    "18-35",
    "15-20",
    "12-20",
    "18-35",
    "15-28",
    "12-25",
    "14-25",
    "6-15",
    "12-18",
    "12-28",
    "7-12",
    "8-12",
    "10-15",
    "2-5",
    "2-5",
    "10-15",
    "10-25",
    "14-30",
  ];
}

function countriesArray() {
  return [
    "Andorra",
    "United Arab Emirates(the)",
    "Afghanistan",
    "Antigua and Barbuda",
    "Anguilla",
    "Albania",
    "Armenia",
    "Angola",
    "Antarctica",
    "Argentina",
    "American Samoa",
    "Austria",
    "Australia",
    "Aruba",
    "Åland Islands",
    "Azerbaijan",
    "Bosnia and Herzegovina",
    "Barbados",
    "Bangladesh",
    "Belgium",
    "Burkina Faso",
    "Bulgaria",
    "Bahrain",
    "Burundi",
    "Benin",
    "Saint Barthélemy",
    "Bermuda",
    "Brunei Darussalam",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Brazil",
    "Bahamas(the)",
    "Bhutan",
    "Bouvet Island",
    "Botswana",
    "Belarus",
    "Belize",
    "Canada",
    "Cocos (Keeling) Islands(the)",
    "Congo (the Democratic Republic of OD",
    "Central African Republic (the)",
    "Congo (the)",
    "Switzerland",
    "Côte d`Ivoire",
    "Cook Islands (the)",
    "Chile",
    "Cameroon",
    "China",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Cabo Verde",
    "Curaçao",
    "Christmas Island",
    "Cyprus",
    "Czechia",
    "Germany",
    "Djibouti",
    "Denmark",
    "Dominica",
    "Dominican Republic (the)",
    "Algeria",
    "Ecuador",
    "Estonia",
    "Egypt",
    "Western Sahara*",
    "Eritrea",
    "Spain",
    "Ethiopia",
    "Finland",
    "Fiji",
    "Falkland Islands (the) [Malvinas]",
    "Micronesia (Federated States of)",
    "Faroe Islands (the)",
    "France",
    "Gabon",
    "United Kingdom of Great Britain and Northern Irela	",
    "Grenada",
    "Georgia",
    "French Guiana",
    "Guernsey",
    "Ghana",
    "Gibraltar",
    "Greenland",
    "Gambia (the)",
    "Guinea",
    "Guadeloupe",
    "Equatorial Guinea",
    "Greece",
    "South Georgia and the South Sandwich Islands",
    "Guatemala",
    "Guam",
    "Guinea-Bissau",
    "Guyana",
    "Hong Kong",
    "Heard Island and McDonald Islands",
    "Honduras",
    "Croatia",
    "Haiti",
    "Hungary",
    "Indonesia",
    "Ireland",
    "Israel",
    "Isle of Man",
    "India",
    "British Indian Ocean Territory (the)",
    "Iraq",
    "Iran (Islamic Republic of)",
    "Iceland",
    "Italy",
    "Jersey",
    "Jamaica",
    "Jordan",
    "Japan",
    "Kenya",
    "Kyrgyzstan",
    "Cambodia",
    "Kiribati",
    "Comoros (the)",
    "Saint Kitts and Nevis",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Cayman Islands (the)",
    "Kazakhstan",
    "Lao People's Democratic Republic (the)",
    "Lebanon",
    "Saint Lucia",
    "Liechtenstein",
    "Sri Lanka",
    "Liberia",
    "Lesotho",
    "Lithuania",
    "Luxembourg",
    "Latvia",
    "Libya",
    "Morocco",
    "Monaco",
    "Moldova (the Republic of)",
    "Montenegro",
    "Saint Martin (French part)",
    "Madagascar",
    "Marshall Islands (the)",
    "Macedonia (the former Yugoslav Republic of)",
    "Mali",
    "Myanmar",
    "Mongolia",
    "Macao",
    "Northern Mariana Islands (the)",
    "Martinique",
    "Mauritania",
    "Montserrat",
    "Malta",
    "Mauritius",
    "Maldives",
    "Malawi",
    "Mexico",
    "Malaysia",
    "Mozambique",
    "Namibia",
    "New Caledonia",
    "Niger (the)",
    "Norfolk Island",
    "Nigeria",
    "Nicaragua",
    "Netherlands (the)",
    "Norway",
    "Nepal",
    "Nauru",
    "Niue",
    "New Zealand",
    "Oman",
    "Panama",
    "Peru",
    "French Polynesia",
    "Papua New Guinea",
    "Philippines (the)",
    "Pakistan",
    "Poland",
    "Saint Pierre and Miquelon",
    "Pitcairn",
    "Puerto Rico",
    "Palestine, State of",
    "Portugal",
    "Palau",
    "Paraguay",
    "Qatar",
    "Réunion",
    "Romania",
    "Serbia",
    "Russian Federation (the)",
    "Rwanda",
    "Saudi Arabia",
    "Solomon Islands",
    "Seychelles",
    "Sudan (the)",
    "Sweden",
    "Singapore",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Slovenia",
    "Svalbard and Jan Mayen",
    "Slovakia",
    "Sierra Leone",
    "San Marino",
    "Senegal",
    "Somalia",
    "Suriname",
    "South Sudan",
    "Sao Tome and Principe",
    "El Salvador",
    "Sint Maarten (Dutch part)",
    "Syrian Arab Republic",
    "Swaziland",
    "Turks and Caicos Islands (the)",
    "Chad",
    "French Southern Territories (the)",
    "Togo",
    "Thailand",
    "Tajikistan",
    "Tokelau",
    "Timor-Leste",
    "Turkmenistan",
    "Tunisia",
    "Tonga",
    "Turkey",
    "Trinidad and Tobago",
    "Tuvalu",
    "Taiwan (Province of China)",
    "Tanzania, United Republic of",
    "Ukraine",
    "Uganda",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Holy See (the)",
    "Saint Vincent and the Grenadines",
    "Venezuela (Bolivarian Republic of)",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Viet Nam",
    "Vanuatu",
    "Wallis and Futuna",
    "Samoa",
    "Yemen",
    "The Republic of Kosovo",
    "Mayotte",
    "South Africa",
    "Zambia",
    "Zimbabwe",
  ];
}

function countryCodeArray() {
  return [
    "AD",
    "AE",
    "AF",
    "AG",
    "AI",
    "AL",
    "AM",
    "AO",
    "AQ",
    "AR",
    "AS",
    "AT",
    "AU",
    "AW",
    "AX",
    "AZ",
    "BA",
    "BB",
    "BD",
    "BE",
    "BF",
    "BG",
    "BH",
    "BI",
    "BJ",
    "BL",
    "BM",
    "BN",
    "BO",
    "BQ",
    "BR",
    "BS",
    "BT",
    "BV",
    "BW",
    "BY",
    "BZ",
    "CA",
    "CC",
    "180",
    "CF",
    "CG",
    "CH",
    "CI",
    "CK",
    "CL",
    "CM",
    "CN",
    "CO",
    "CR",
    "CU",
    "CV",
    "CW",
    "CX",
    "CY",
    "CZ",
    "DE",
    "DJ",
    "DK",
    "DM",
    "DO",
    "DZ",
    "EC",
    "EE",
    "EG",
    "EH",
    "ER",
    "ES",
    "ET",
    "FI",
    "FJ",
    "FK",
    "FM",
    "FO",
    "FR",
    "GA",
    "GB",
    "GD",
    "GE",
    "GF",
    "GG",
    "GH",
    "GI",
    "GL",
    "GM",
    "GN",
    "GP",
    "GQ",
    "GR",
    "GS",
    "GT",
    "GU",
    "GW",
    "GY",
    "HK",
    "HM",
    "HN",
    "HR",
    "HT",
    "HU",
    "ID",
    "IE",
    "IL",
    "IM",
    "IN",
    "IO",
    "IQ",
    "IR",
    "IS",
    "IT",
    "JE",
    "JM",
    "JO",
    "JP",
    "KE",
    "KG",
    "KH",
    "KI",
    "KM",
    "KN",
    "KP",
    "KR",
    "KW",
    "KY",
    "KZ",
    "LA",
    "LB",
    "LC",
    "LI",
    "LK",
    "LR",
    "LS",
    "LT",
    "LU",
    "LV",
    "LY",
    "MA",
    "MC",
    "MD",
    "ME",
    "MF",
    "MG",
    "MH",
    "MK",
    "ML",
    "MM",
    "MN",
    "MO",
    "MP",
    "MQ",
    "MR",
    "MS",
    "MT",
    "MU",
    "MV",
    "MW",
    "MX",
    "MY",
    "MZ",
    "NA",
    "NC",
    "NE",
    "NF",
    "NG",
    "NI",
    "NL",
    "NO",
    "NP",
    "NR",
    "NU",
    "NZ",
    "OM",
    "PA",
    "PE",
    "PF",
    "PG",
    "PH",
    "PK",
    "PL",
    "PM",
    "PN",
    "PR",
    "PS",
    "PT",
    "PW",
    "PY",
    "QA",
    "RE",
    "RO",
    "RS",
    "RU",
    "RW",
    "SA",
    "SB",
    "SC",
    "SD",
    "SE",
    "SG",
    "SH",
    "SI",
    "SJ",
    "SK",
    "SL",
    "SM",
    "SN",
    "SO",
    "SR",
    "SS",
    "ST",
    "SV",
    "SX",
    "SY",
    "SZ",
    "TC",
    "TD",
    "TF",
    "TG",
    "TH",
    "TJ",
    "TK",
    "TL",
    "TM",
    "TN",
    "TO",
    "TR",
    "TT",
    "TV",
    "TW",
    "TZ",
    "UA",
    "UG",
    "UM",
    "US",
    "UY",
    "UZ",
    "VA",
    "VC",
    "VE",
    "VG",
    "VI",
    "VN",
    "VU",
    "WF",
    "WS",
    "YE",
    "YK",
    "YT",
    "ZA",
    "ZM",
    "ZW",
  ];
}

function productsJSONFormat(results) {
  return {
    code: 200,
    result: true,
    message: "Success",
    data: {
      list: results,
    },
  };
}

methods.getCountryCode = (req, res) => {
  let response = new Country();

  res.send(response);
};

methods.getLogistics = (req, res) => {
  let response = new Logistics();

  res.send(response);
};

methods.getToken = (req, res) => {
  fetch(
    "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "hyprweb@gmail.com",
        password: "02cf4f3d305f4312b865f8e8eed59c64",
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      if (response.data.accessToken) {
        const token = req.cookies.auth;
        return res.send({ nekot: token });
      }
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.getProducts = async (req, res) => {
  const page = checkParamsIfUndefined(req) ? "1" : req.query.pageNum;
  const results = [];

  try {
    client.get(page, async (err, products) => {
      if (err) throw err;

      if (products) {
        const format = productsJSONFormat(JSON.parse(products));
        res.status(200).send(format);
      } else {
        const query = await db
          .collection("t_api_products")
          .find({ page_number: { $eq: page } })
          .limit(20);
        
        query.toArray(function (err, docs) {
          docs.forEach((documents) => {
            results.push(documents.product_information);
          });

          client.setex(page, 600, JSON.stringify(results));
          const format = productsJSONFormat(results);
          res.status(200).send(format);
        });
      }
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

methods.getProductsInAPI = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/list?${search}`,
    {
      headers: {
        "CJ-Access-Token": token,
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.getVariants = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/variant/query?${search}`,
    {
      headers: {
        "CJ-Access-Token": token,
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

function checkParamsIfUndefined(req) {
  // temporary checking
  const _ = require("lodash");
  if (_.isUndefined(req.query.pageNum)) {
    return true;
  }
  return false;
}
function _getParamString(req) {
  let search = null,
    i = 0;
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      if (i++ == 0 && propName !== null) {
        search = `${propName}=${req.query[propName]}`;
      } else {
        search += `&${propName}=${req.query[propName]}`;
      }
    }
  }

  return search;
}

function _checkKeyValuePair(value) {
  if (value != null) {
    return true;
  }
  return false;
}

methods.listOrder = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);
  try {
    client.get(search, async (err, listOrder) => {
      if (err) throw err;

      if (listOrder) {
        res.status(200).send(JSON.parse(listOrder));
      }
      else {
        fetch(
          `https://developers.cjdropshipping.com/api2.0/v1/shopping/order/list?${search}`,
          {
            headers: {
              "CJ-Access-Token": token,
            },
            method: "GET",
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw "error on fetching token";
            }
            return response.json();
          })
          .then((response) => {
            client.setex(search, 600, JSON.stringify(response));
            return res.status(200).send(response);
          })
          .catch((err) => {
            res.send({ response: "something went wrong :<" });
            if (err.name === "AbortError") {
              res.send("Timed out");
            }
          });
      }
    });
  } catch (error) {
    res.status(500).send({error: error});
  }
};

methods.createOrder = (req, res) => {
  const token = req.cookies.auth;
  const body = req.body.products;
  const len = body.length;

  let products = [];

  for (let i = 0; i < len; i++) {
    products[i] = {
      quantity: body[i].quantity,
      sellPrice: body[i].sellPrice,
      shippingName: body[i].shippingName,
      vid: body[i].vid,
    };
  }

  let shipping = new Shipping(
    req.body.fccode,
    req.body.logistic,
    products,
    req.body.address,
    req.body.city,
    req.body.country,
    req.body.sccode,
    req.body.name,
    req.body.phone,
    req.body.province,
    req.body.zip
  );

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder`,
    {
      headers: {
        "CJ-Access-Token": token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(shipping),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: `something went wrong :< ${err}` });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.FreightCalculate = (req, res) => {
  const body = req.body.products;
  const len = body.length;

  let products = [];

  for (let i = 0; i < len; i++) {
    products[i] = { quantity: body[i].quantity, variantSku: body[i].sku };
  }

  let freight = new Freight(req.body.sccode, req.body.eccode, products);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(freight),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.getOrder = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/shopping/order/getOrderDetail?${search}`,
    {
      headers: {
        "CJ-Access-Token": token,
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.deleteOrder = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/shopping/order/deleteOrder?${search}`,
    {
      headers: {
        "CJ-Access-Token": token,
      },
      method: "DELETE",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.confirmOrder = (req, res) => {
  const token = req.cookies.auth;
  const orderId = req.body.orderId;

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/shopping/order/confirmOrder`,
    {
      headers: {
        "CJ-Access-Token": token,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ orderId: orderId }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.trackingDetails = (req, res) => {
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/logistic/getTrackInfo?${search}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.productSync = (req, res) => {
  const token = req.cookies.auth;
  const search = _getParamString(req);

  fetch(
    `https://developers.cjdropshipping.com/api2.0/v1/product/list?${search}`,
    {
      headers: {
        "CJ-Access-Token": token,
      },
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw "error on fetching token";
      }
      return response.json();
    })
    .then((response) => {
      const productList = response.data.list;

      for (let i = 0, j = productList.length; i < j; i++) {
        let y = i;
        db.collection("t_api_products").updateOne(
          {
            pid: productList[i].pid,
          },
          {
            $setOnInsert: {
              pid: productList[i].pid,
              product_information: productList[i],
              page_number: response.data.pageNum.toString(),
              category_name: productList[i].categoryName,
              product_name: productList[i].productNameEn,
              product_sku: productList[i].productSku,
              price: productList[i].sellPrice.toString(),
              product_add_price: 0,
              cache_key: `cj-${response.data.pageNum.toString()}-${++y}`,
              shop: "cj",
            },
          },
          { upsert: true }
        );
      }
      return res.send({ reponse: "success" });
    })
    .catch((err) => {
      res.send({ response: "something went wrong :<" });
      if (err.name === "AbortError") {
        res.send("Timed out");
      }
    });
};

methods.getSyncProducts = async (req, res) => {
  const max = await db
    .collection("t_api_products")
    .find()
    .sort({ page_number: -1 })
    .limit(1);

  await max.forEach((doc) => {
    res.send(doc.page_number);
  });
};

methods.searchProducts = async (req, res) => {
  const searchValue = req.body.searchValue;
  const skips = req.body.skip == undefined ? 0 : req.body.skip;
  const results = [];

  try {
    client.get(searchValue, async (err, products) => {

      if (err) throw err;

      if (products) {
        const format = productsJSONFormat(JSON.parse(products));
        res.status(200).send(format);
      }
      else {
        const query = await db
        .collection("t_api_products")
        .find({ $text: { $search: `/${searchValue}/` } })
        .limit(30)
        .skip(skips)
        .project({ product_information: 1, _id: 0 });
    
        query.toArray(function (err, docs) {
          console.log(docs);
          docs.forEach((documents) => {
            results.push(documents.product_information);
          });
      
          client.setex(searchValue, 600, JSON.stringify(results));

          const format = productsJSONFormat(results);
          res.status(200).send(format);
      
        });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

module.exports = methods;
