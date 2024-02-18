import express from "express";
import { graphqlHTTP } from "express-graphql";
import database from "./database/connection.js";
import schema from "./graphql/schema.js";

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use("/", graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}`);
});
