import { CacheData } from "../../../App";

const updateTable = async (updatedTableData) => {
  try {
    const response = await fetch(
      "http://localhost:8080/contacts/" + updatedTableData._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTableData),
      }
    );

    const data = await response.json();
    if (data.status !== 200) {
      alert(data?.message);
    }
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
export default updateTable;
