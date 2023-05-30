import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_APP_API_ENDPOINT;
const headers = {
  "Content-Type": "application/json",
};

// ベースクライアント
export const ApiClient = axios.create({ baseURL, headers });

// レスポンスのインターセプター
ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    switch (error?.response?.status) {
      case 401:
        break;
      case 404:
        break;
      default:
        console.log("== internal server error");
    }

    const errorMessage = (error.response?.data?.message || "").split(",");
    throw new Error(errorMessage);
    // return { errors: errorMessage, message: "error message" };
  }
);
