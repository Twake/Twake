import "reflect-metadata";
import { describe, expect, it } from "@jest/globals";
import {
  buildSelectQuery,
  buildComparison,
  buildIn,
} from "../../../../../../../../../src/core/platform/services/database/services/orm/connectors/cassandra/query-builder";
import { ChannelMemberNotificationPreference } from "../../../../../../../../../src/services/notifications/entities/channel-member-notification-preferences";

describe("The QueryBuilder module", () => {
  describe("The buildSelectQuery function", () => {
    it("should build a valid query from primary key parameters", () => {
      const filters = {
        company_id: "comp1",
        channel_id: "chan1",
      };
      const result = buildSelectQuery<ChannelMemberNotificationPreference>(
        ChannelMemberNotificationPreference,
        filters,
        {},
        { keyspace: "twake" },
      );

      expect(result).toEqual(
        "SELECT * FROM twake.channel_members_notification_preferences WHERE company_id = comp1 AND channel_id = chan1",
      );
    });

    it("should build a valid query from primary key parameters and comparison", () => {
      const filters = {
        company_id: "comp1",
        channel_id: "chan1",
      };
      const result = buildSelectQuery<ChannelMemberNotificationPreference>(
        ChannelMemberNotificationPreference,
        filters,
        {
          $lt: [["last_read", 1000]],
        },
        { keyspace: "twake" },
      );

      expect(result).toEqual(
        "SELECT * FROM twake.channel_members_notification_preferences WHERE company_id = comp1 AND channel_id = chan1 AND last_read < 1000",
      );
    });

    it("should build IN query from array parameters", () => {
      const filters = {
        company_id: "comp1",
        channel_id: "chan1",
        user_id: ["u1", "u2", "u3"],
      };
      const result = buildSelectQuery<ChannelMemberNotificationPreference>(
        ChannelMemberNotificationPreference,
        filters,
        {},
        { keyspace: "twake" },
      );

      expect(result).toEqual(
        "SELECT * FROM twake.channel_members_notification_preferences WHERE company_id = comp1 AND channel_id = chan1 AND user_id IN (u1,u2,u3)",
      );
    });

    it("should not build IN query from array parameters when array is empty", () => {
      const filters = {
        company_id: "comp1",
        channel_id: "chan1",
        user_id: [],
      };
      const result = buildSelectQuery<ChannelMemberNotificationPreference>(
        ChannelMemberNotificationPreference,
        filters,
        {},
        { keyspace: "twake" },
      );

      expect(result).toEqual(
        "SELECT * FROM twake.channel_members_notification_preferences WHERE company_id = comp1 AND channel_id = chan1",
      );
    });
  });

  describe("The buildComparison function", () => {
    it("should create a valid < string", () => {
      expect(
        buildComparison({
          $lt: [["foo", 1]],
        }),
      ).toContain("foo < 1");

      const result = buildComparison({
        $lt: [
          ["foo", 1],
          ["bar", 2],
        ],
      });

      expect(result).toContain("foo < 1");
      expect(result).toContain("bar < 2");
    });

    it("should create a valid <= string", () => {
      expect(
        buildComparison({
          $lte: [["foo", 1]],
        }),
      ).toContain("foo <= 1");

      const result = buildComparison({
        $lte: [
          ["foo", 1],
          ["bar", 2],
        ],
      });

      expect(result).toContain("foo <= 1");
      expect(result).toContain("bar <= 2");
    });

    it("should create a valid > string", () => {
      expect(
        buildComparison({
          $gt: [["foo", 1]],
        }),
      ).toContain("foo > 1");

      const result = buildComparison({
        $gt: [
          ["foo", 1],
          ["bar", 2],
        ],
      });

      expect(result).toContain("foo > 1");
      expect(result).toContain("bar > 2");
    });

    it("should create a valid >= string", () => {
      expect(
        buildComparison({
          $gte: [["foo", 1]],
        }),
      ).toContain("foo >= 1");

      const result = buildComparison({
        $gte: [
          ["foo", 1],
          ["bar", 2],
        ],
      });

      expect(result).toContain("foo >= 1");
      expect(result).toContain("bar >= 2");
    });

    it("should combine conditions", () => {
      const result = buildComparison({
        $gt: [["foo", 1]],
        $gte: [["bar", 2]],
        $lt: [["baz", 3]],
        $lte: [["qix", 4]],
      });
      expect(result).toContain("foo > 1");
      expect(result).toContain("bar >= 2");
      expect(result).toContain("baz < 3");
      expect(result).toContain("qix <= 4");
    });
  });

  describe("The buildIn function", () => {
    it("should create a id IN (ids) string", () => {
      expect(
        buildIn({
          $in: [["id", ["1", "2", "3"]]],
        }),
      ).toContain("id IN (1,2,3)");

      const result = buildComparison({
        $in: [
          ["id", ["1", "2", "3"]],
          ["user", ["a", "b"]],
        ],
      });

      expect(result).toContain("id IN (1,2,3)");
      expect(result).toContain("user IN (a,b)");
    });
  });
});
