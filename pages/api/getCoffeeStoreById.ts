import { findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  
  try {
    if (id) {
      if (req.method === "GET") {
        const records = await findRecordByFilter(id);
  
        if (records.length !== 0) {
          res.status(200);
          res.json(records);
        } else {
          res.json({message: "ID could not be found"});
        }

      }
    } else {
      res.status(422);
      res.json({message: "ID is missing"});
    }
  } catch (error) {
    console.error("An error has occurred with retrieving coffee store by ID");
    res.status(500);
    res.json({message: "An error has occurred with retrieving coffee store by ID"});
  }
}

export default getCoffeeStoreById;