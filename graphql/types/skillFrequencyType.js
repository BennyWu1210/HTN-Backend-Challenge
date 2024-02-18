import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const SkillFrequencyType = new GraphQLObjectType({
  name: "SkillFrequency",
  fields: {
    name: { type: GraphQLString },
    frequency: { type: GraphQLInt },
  },
});

export default SkillFrequencyType;
