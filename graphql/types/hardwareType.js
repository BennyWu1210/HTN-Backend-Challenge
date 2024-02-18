import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const HardwareLoanType = new GraphQLObjectType({
  name: 'Hardwareloan',
  fields: {
    id: {type: GraphQLInt},
    user_id: {type: GraphQLInt},
    hardware_item: {type: GraphQLString},
    status: {type: GraphQLString},
    timestamp: {type: GraphQLString},
  }
});

export default HardwareLoanType;
