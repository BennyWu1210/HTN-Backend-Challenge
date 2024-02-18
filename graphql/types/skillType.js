import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const SkillType = new GraphQLObjectType({
  name: "Skill",
  fields: {
    skill: { type: GraphQLString },
    rating: { type: GraphQLInt },
  },
});

export default SkillType;
