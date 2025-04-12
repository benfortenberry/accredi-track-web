import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const httpClient = axios.create();

const AddTokenInterceptor = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const interceptor = httpClient.interceptors.request.use(
      async (config) => {
        try {
          const accessToken = await getAccessTokenSilently();
          config.headers.Authorization = `Bearer ${accessToken}`;
        } catch (e) {
          // Handle error (e.g., token could not be retrieved)
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      httpClient.interceptors.request.eject(interceptor);
    };
  }, [getAccessTokenSilently]);

  return null;
};

const withAxios = (WrappedComponent: any) => {
  return (props: any) => (
    <>
      <AddTokenInterceptor />
      <WrappedComponent {...props} />
    </>
  );
};

export { httpClient, withAxios };
