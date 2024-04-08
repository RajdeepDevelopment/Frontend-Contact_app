import { CacheData } from "../../../App";

const getTableData = async (skip, limit, signal) => {
  const cacheString = `getTableData:${skip},${limit}`;
  try {
    if (CacheData[cacheString]) {
      return CacheData[cacheString];
    } else {
      const response = await fetch(
        `http://localhost:8080/contacts?skip=${skip ?? 0}&&limit=${
          limit ?? 10
        }`,
        { signal }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.status == 200) {
        CacheData[cacheString] = data;
      }
      return data;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

export default getTableData;
