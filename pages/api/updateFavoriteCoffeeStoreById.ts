import { table, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const updateFavoriteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;
      if (id) {
        const storeRecords = await findRecordByFilter(id);
        if (storeRecords.length !== 0) {
          const record = storeRecords[0];
          const updatedVote = parseInt(record.voting) + 1;
          const updatedStore = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: updatedVote,
              }
            }
          ]);
          if (updatedStore) {
            const result = getMinifiedRecords(updatedStore);
            res.json(result);
          }
        } else {
          res.json({message: "Coffee Store Id does not exist", id})
        }

      } else {
        res.json({message: "Id cannot be empty"})
      }
    } else {
      res.json({message: "Method not supported"});
    }
  } catch (error) {
    res.status(500);
    res.json({message: "Something went wrong"});
  }
}

export default updateFavoriteCoffeeStoreById;