const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "./variables.env",
});

//connection
const connectToDb = require("./config/db");

//type definitions
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");

connectToDb();

/**
 * create a resolverls
 * typedefinitions or schemas,
 * resolvers,
 * context is how middleware
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context is how middleware
  context: ({ req }) => {
    //get the header variable
    const token = req.headers["authorization"] || "";

    try {
      if (token !== "") {
        //get claimsUserByToken
        const userClaimsByToken = jwt.verify(token, process.env.SECRET_KEY);
        /**
         * return the user for to pass the data with a context to resolvers
         */
        return userClaimsByToken;
      }
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`server ready in ${url}`);
});
