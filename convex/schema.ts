import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
  }),
  regattas: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("duel"),
      v.literal("head"),
      v.literal("championship"),
    ),
    host: v.id("teams"),
    participantDescription: v.string(), // Description shown to represent participants
    rampClosed: v.boolean(),
    distanceMeters: v.float64(),
    startDateIso: v.string(),
    endDateIso: v.string(),
  }),
  events: defineTable({
    regattaId: v.id("regattas"),
    boatClass: v.union(
      v.literal("8+"),
      v.literal("4+"),
      v.literal("4-"),
      v.literal("4x"),
      v.literal("3x"),
      v.literal("2+"),
      v.literal("2x"),
      v.literal("2-"),
      v.literal("1x"),
    ),
    gender: v.union(v.literal("men"), v.literal("women"), v.literal("open")),
    displayName: v.string(), // This enables any extra information (e.g., 2nd varsity or masters or novice) to be included, but should also contain the above
  }),
  entries: defineTable({
    teamId: v.id("teams"),
    eventId: v.id("events"),
    entryLetter: v.optional(v.string()), // Optional string to denote "A", "B", etc to allow multiple entries from a team in a race
  }),
  heats: defineTable({
    eventId: v.id("events"),
    scheduledStartIso: v.string(),
    delayMs: v.optional(v.int64()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("delayed"),
      v.literal("unofficial"),
      v.literal("official"),
      v.literal("in-progress"),
      v.literal("cancelled"),
    ),
    progression: v.optional(
      v.union(
        v.object({
          name: v.string(), // E.g., Semifinal AB or Heat 1
          rules: v.array(
            v.object({
              sourceHeatIds: v.array(v.id("heats")),
              positions: v.array(v.int64()), // Finish positions we care about in the target heats
              // Local lane assignments, e.g., across all heats in this group only combined finish order by time
              laneAssignments: v.array(
                v.object({
                  bowNumber: v.int64(),
                  sourcePosition: v.int64(),
                }),
              ),
            }),
          ),
        }),
        v.object({
          name: v.string(), // E.g., Semifinal AB or Heat 1
          rules: v.array(
            v.object({
              sourceHeatIds: v.array(v.id("heats")),
              positions: v.array(v.int64()), // Finish positions we care about in the target heats
            }),
          ),
          // Global lane assignments, e.g., across all heats combined finish order by time
          laneAssignments: v.array(
            v.object({
              bowNumber: v.int64(),
              sourcePosition: v.int64(),
            }),
          ),
        }),
      ),
    ),
    entries: v.array(
      v.object({
        id: v.id("entries"),
        bowNumber: v.int64(),
        rawFinishTimeMs: v.optional(v.float64()),
        failedToFinish: v.optional(v.boolean()),
        segments: v.array(
          v.object({
            distanceMeters: v.float64(),
            timeMs: v.int64(),
          }),
        ),
        penalties: v.array(
          v.object({
            type: v.union(
              v.literal("dsq"),
              v.literal("time"),
              v.literal("warning"),
            ),
            reason: v.string(),
            timeAdditionMs: v.int64(),
          }),
        ),
      }),
    ),
  }),
  breaks: defineTable({
    regattaId: v.id("regattas"),
    startTimeIso: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("delayed"),
      v.literal("in-progress"),
      v.literal("complete"),
      v.literal("cancelled"),
    ),
  }),
});
