import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { NotificationType, setNotification } from "@/features/notifications";

type UseApiNotificationsConfig = {
  isSuccess?: boolean;
  isError?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

export const useApiNotifications = ({
  isSuccess,
  isError,
  successMessage = "Success!",
  errorMessage = "An unexpected error occurred!",
}: UseApiNotificationsConfig) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      const notificationPayload = {
        type: NotificationType.SUCCESS,
        value: successMessage,
      };
      dispatch(setNotification(notificationPayload));
    } else if (isError) {
      const notificationPayload = {
        type: NotificationType.ERROR,
        value: errorMessage,
      };
      dispatch(setNotification(notificationPayload));
    }
  }, [dispatch, isError, isSuccess, successMessage, errorMessage]);
};
