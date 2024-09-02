import { useEffect, FC, PropsWithChildren } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserCookie } from "../hooks/userHooks";
import Loading from "../page/Loading";

const PrivateRouter: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading } = useUserCookie();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (typeof data?.data?.data === "undefined") {
        navigate("/auth/login");
      }
    }
  }, [data, isLoading]);

  return isLoading ? (
    <Loading />
  ) : !isLoading && typeof data?.data?.data !== "undefined" ? (
    <>{children}</>
  ) : !isLoading && typeof data?.data?.data === "undefined" ? (
    <Navigate to="/auth/login" />
  ) : (
    <Navigate to="auth/login" />
  );
};

export default PrivateRouter;
