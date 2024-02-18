import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import HardwareLoanType from "../types/hardwareType.js";
import database from "../../database/connection.js";

const hardwareResolvers = {
  Query: {
    // ====================== check hardware availability ======================
    isHardwareAvailable: {
      type: GraphQLBoolean,
      args: {
        hardware_item: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { hardware_item }) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT COUNT(*) AS count
            FROM hardware_loans
            WHERE hardware_item = ? AND status = "borrowed";
          `;
          database.get(query, [hardware_item], (err, { count }) => {
            if (err) {
              reject(err);
            } else {
              resolve(count === 0);
            }
          });
        });
      },
    },
  },
  Mutation: {
    // ====================== borrow hardware endpoint ======================
    borrowHardware: {
      type: HardwareLoanType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        hardware_item: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { user_id, hardware_item }) => {
        return new Promise((resolve, reject) => {
          // Check if the hardware item is currently available
          const availabilityQuery = `
            SELECT COUNT(*) AS count
            FROM hardware_loans
            WHERE hardware_item = ? AND status = "borrowed";
          `;
          database.get(
            availabilityQuery,
            [hardware_item],
            (availabilityErr, { count }) => {
              if (availabilityErr) {
                reject(availabilityErr);
                return;
              }
              if (count > 0) {
                reject(new Error("Hardware item is currently unavailable"));
                return;
              }

              // If available, proceed to borrow the hardware item
              const query =
                'INSERT INTO hardware_loans (user_id, hardware_item, status) VALUES (?, ?, "borrowed")';

              database.run(query, [user_id, hardware_item], function (err) {
                if (err) {
                  reject(err);
                  return;
                }
                const newLoan = {
                  id: this.lastID,
                  user_id,
                  hardware_item,
                  status: "borrowed",
                  timestamp: new Date().toISOString(),
                };
                resolve(newLoan);
              });
            }
          );
        });
      },
    },
    // ====================== return hardware endpoint ======================
    returnHardware: {
      type: HardwareLoanType,
      args: {
        hardware_item: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { hardware_item }) => {
        return new Promise((resolve, reject) => {
          const query =
            'UPDATE hardware_loans SET status = "returned" WHERE hardware_item = ?;';
          database.run(query, [hardware_item], function (err) {
            if (err) {
              reject(err);
              return;
            }
            if (this.changes === 0) {
              resolve(null); // No loans found to update
              return;
            }
            database.get(
              "SELECT * FROM hardware_loans WHERE hardware_item = ?",
              [hardware_item],
              (loanErr, loan) => {
                if (loanErr) {
                  reject(loanErr);
                } else {
                  resolve(loan);
                }
              }
            );
          });
        });
      },
    },
  },
};

export default hardwareResolvers;
