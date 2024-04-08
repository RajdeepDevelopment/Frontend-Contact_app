import { CacheData } from "../../../App";

const DeleteTable = async (Table_ids) => {
  try {
    const response = await fetch(
      "http://localhost:8080/contacts/" + Table_ids,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
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
export default DeleteTable;
