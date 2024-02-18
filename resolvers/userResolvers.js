import { GraphQLList } from "graphql";
import UserType from "../types/userType.js";
import database from "../../database/connection.js";

const userQueries = {
  allUsers: {
    type: new GraphQLList(UserType),
    resolve: async () => {
      // Fetch all user info
      return new Promise((resolve, reject) => {
        const query = `
          SELECT * FROM users;
        `;

        database.all(query, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // For each user, fetch their skills
            const userWithSkills = rows.map((user) => {
              return new Promise((resolveUser, rejectUser) => {
                const skillsQuery =
                  "SELECT skill, rating FROM skills WHERE user_id = ?;";
                database.all(
                  skillsQuery,
                  [user.id],
                  (skillsErr, skillsRows) => {
                    if (skillsErr) {
                      rejectUser(skillsErr);
                    } else {
                      user.skills = skillsRows;
                      resolveUser(user);
                    }
                  }
                );
              });
            });

            Promise.all(userWithSkills)
              .then((users) => resolve(users))
              .catch((err) => reject(err));
          }
        });
      });
    },
  },
};


export { userQueries };
