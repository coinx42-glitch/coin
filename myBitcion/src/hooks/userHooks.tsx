import useSWR from "swr";
import { readUser, readUserCookie, viewUserByName } from "../page/api/userAPI";

export const useUserCookie = () => {
  const { data, error } = useSWR("/get-user-cookies", readUserCookie);
  const isLoading = !data && !error;
  return { data, isLoading };
};

export const useUserData = () => {
  const { data: userData } = useUserCookie();
  console.log(userData)
  const userID = userData?.user?._id;

  const { data, error } = useSWR(userID ? `get-user/${userID}` : null, () =>
    readUser(userID)
  );

  const isLoading = !data && !error;

  return { data, isLoading, error };
};

export const useUserDataByName = (userName: string) => {
  const { data, error } = useSWR(
    userName ? `api/view-school/${userName}` : null,
    () => viewUserByName(userName).then((res) => res.data)
  );
  const isLoading = !data && !error;
  return { data, isLoading, error };
};
