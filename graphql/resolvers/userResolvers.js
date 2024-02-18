import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import UserType from "../types/userType.js";
import database from "../../database/connection.js";

const userResolvers = {
  Query: {
    // ====================== all users endpoint ======================
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

    // ====================== query by ID endpoint ======================
    userById: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        return new Promise((resolve, reject) => {
          // find user with a matching idea
          const query = "SELECT * FROM users WHERE id = ?;";
          database.get(query, [args.id], (err, user) => {
            if (err) {
              console.error(err);
              return;
            }

            if (!user) {
              resolve(null); // user not found
              return;
            }

            // for that particular user, find their skills
            const skillQuery =
              "SELECT skill, rating FROM skills WHERE user_id = ?;";
            database.all(skillQuery, [user.id], (skillsErr, skillsRows) => {
              if (skillsErr) {
                reject(skillsErr);
              } else {
                user.skills = skillsRows;
                resolve(user);
              }
            });
          });
        });
      },
    },
  },
  Mutation: {
    // ====================== update user endpoint ======================
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        company: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },

      resolve: async (parent, args) => {
        const { id, ...updateArgs } = args;
        const updateFields = Object.keys(updateArgs)
          .filter((key) => updateArgs[key] !== undefined)
          .map((key) => `${key} = ?`);
        const queryParams = Object.values(updateArgs).filter(
          (value) => value !== undefined
        );

        if (updateFields.length === 0) {
          throw new Error("No fields provided for update");
        }

        queryParams.push(id);
        // update fields for the user that has a matching id
        const query = `UPDATE users SET ${updateFields.join(
          ", "
        )} WHERE id = ?`;
        return new Promise((resolve, reject) => {
          database.run(query, queryParams, function(err) {
            if (err) {
              reject(err);
              return;
            }
            if (this.changes === 0) {
              resolve(null);
              return;
            }

            // Fetch the updated user to return
            database.get(
              "SELECT * FROM users WHERE id = ?",
              [id],
              (userErr, user) => {
                if (userErr) {
                  reject(userErr);
                } else {
                  // Assuming skills are not updated (according to the instructions, hackers don't gain or lose skills)
                  database.all(
                    "SELECT skill, rating FROM skills WHERE user_id = ?",
                    [id],
                    (skillsErr, skillsRows) => {
                      if (skillsErr) {
                        reject(skillsErr);
                      } else {
                        user.skills = skillsRows;
                        resolve(user);
                      }
                    }
                  );
                }
              }
            );
          });
        });
      },
    },
  },
};

export default userResolvers ;
