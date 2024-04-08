import { CacheData } from "../../../App";

const postNewTable = async (Newtabledata) => {
  try {
    const response = await fetch("http://localhost:8080/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Newtabledata),
    });
    const data = await response.json();
    //Cache clear
    Object.keys(CacheData).forEach((item) => {
      delete CacheData[item];
    });
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

export default postNewTable;
