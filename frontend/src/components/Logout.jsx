import axios from "axios";

export const handleLogout = async () => {
  const updateSession = async () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    window.location.href = "/";
    alert("Wylogowano");
  };

  try {
    const token = sessionStorage.getItem("accessToken");
    console.log(token);
    const logoutEndpoint = `${import.meta.env.VITE_API_URL}api/logout/`;
    const headers = {
      headers: {
        Authorization: "Token " + token,
      },
    };

    const response = await axios.get(logoutEndpoint, headers);

    if (response.status === 200) {
      updateSession();
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default handleLogout;
