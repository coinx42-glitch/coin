import useSWR from "swr";
import { jwtDecode } from "jwt-decode";
import { readUser, readUserCookie, viewUserByName } from "../page/api/userAPI";

export const useUserCookie = () => {
  const token = localStorage.getItem("token");

  let id;
  if (token) {
    try {
      // Ensure token is a string and decode it
      id = jwtDecode(token)?.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const { data, error, isLoading } = useSWR(id ? `/view-user/${id}` : null, () => readUser(id));
  
  return { data, isLoading, error };
};

export const useUserData = () => {
  const { data: userData } = useUserCookie();
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
