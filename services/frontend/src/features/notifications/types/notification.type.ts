export enum NotificationType {
  INFO,
  SUCCESS,
  ERROR,
  LOADING,
}

export type NotificationPayload = {
  type: NotificationType;
  value: string;
};

export type NotificationState = {
  value: NotificationPayload | null;
};
