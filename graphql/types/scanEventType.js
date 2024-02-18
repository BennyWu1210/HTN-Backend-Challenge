import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const ScanEventType = new GraphQLObjectType({
  name: "ScanEvent",
  fields: {
    id: { type: GraphQLInt },
    user_id: { type: GraphQLInt },
    event_name: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  },
});

export default ScanEventType;