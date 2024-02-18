import { GraphQLInt, GraphQLList } from "graphql";
import SkillFrequencyType from "../types/skillFrequencyType.js";
import database from "../../database/connection.js";

const skillResolvers = {
  Query: {
    // ====================== fetch skills in range endpoint ======================
    skills: {
      type: new GraphQLList(SkillFrequencyType),
      args: {
        min_frequency: {type: GraphQLInt},
        max_frequency: {type: GraphQLInt}
      },
      resolve: async (parent, {min_frequency = 0, max_frequency = Infinity}) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT skill as name, COUNT(user_id) as frequency
            FROM skills
            GROUP BY skill
            HAVING frequency >= ? AND frequency <= ?;
          `;
          database.all(query, [min_frequency, max_frequency], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          })
        })
      }
    }
  }
};

export default skillResolvers;