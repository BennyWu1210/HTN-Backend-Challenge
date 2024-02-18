import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import ScanEventType from "../types/scanEventType.js";
import database from "../../database/connection.js";

const scannerResolvers = {
  Query: {
    // ====================== check user scanned event endpoint ======================
    userScanEvents: {
      type: new GraphQLList(ScanEventType),
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, { user_id }) => {
        return new Promise((resolve, reject) => {
          const query = "SELECT * FROM scan_events WHERE user_id = ?;";
          database.all(query, [user_id], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
      },
    },
  },
  Mutation: {
    // ====================== scan user endpoint ======================
    scanUser: {
      type: ScanEventType,
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        event_name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { user_id, event_name }) => {
        return new Promise((resolve, reject) => {
          const query =
            "INSERT INTO scan_events (user_id, event_name) VALUES (?, ?)";
          database.run(query, [user_id, event_name], function (err) {
            if (err) {
              reject(err);
              return;
            }
            const newEvent = {
              id: this.lastID,
              user_id,
              event_name,
              timestamp: new Date().toISOString(),
            };
            resolve(newEvent);
          });
        });
      },
    },
  },
};

export default scannerResolvers;
