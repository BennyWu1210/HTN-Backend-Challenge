import graphql, { GraphQLObjectType } from "graphql";
import userResolvers from "./resolvers/userResolvers.js";
import skillResolvers from './resolvers/skillResolvers.js';
import scannerResolvers from "./resolvers/scannerResolvers.js";
import hardwareResolvers from './resolvers/hardwareResolvers.js';


const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...userResolvers.Query,
    ...skillResolvers.Query,
    ...scannerResolvers.Query,
    ...hardwareResolvers.Query
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...userResolvers.Mutation,
    ...scannerResolvers.Mutation,
    ...hardwareResolvers.Mutation
  },
});

const schema = new graphql.GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});

export default schema;
