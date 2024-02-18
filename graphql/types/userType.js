import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import SkillType from "./skillType.js";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    skills: { type: new GraphQLList(SkillType) },
  },
});

export default UserType;
