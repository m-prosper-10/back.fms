import {
  createNotificationSchema,
  notificationTypeParamSchema,
  updateNotificationSchema
} from "../modules/notifications/notification.validation";

describe("notification validation", () => {
  it("accepts a valid notification payload", () => {
    const result = createNotificationSchema.safeParse({
      userId: "66a0d8f6f2b3a4c7d1e8a901",
      title: "Inspection reminder",
      message: "Your inspection is due tomorrow",
      type: "inspection"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid notification type", () => {
    const result = createNotificationSchema.safeParse({
      userId: "66a0d8f6f2b3a4c7d1e8a901",
      title: "System alert",
      message: "Something happened",
      type: "marketing"
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid notification update", () => {
    const result = updateNotificationSchema.safeParse({
      isRead: true
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid type param", () => {
    const result = notificationTypeParamSchema.safeParse({
      type: "promo"
    });

    expect(result.success).toBe(false);
  });
});
