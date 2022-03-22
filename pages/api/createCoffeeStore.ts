import { table, getMinifiedRecords, findRecordByFilter}  from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighbourhood, imgUrl, voting } = req.body;
    try {
      if (id) {
        const records = await findRecordByFilter(id);
  
        if (records.length !== 0) {
          res.status(200);
          res.json(records);
        } else {
          // create
          if (name) {
            const createStoreRecords = await table.create([
              {
                "fields": {
                  id,
                  name,
                  address,
                  neighbourhood,
                  imgUrl,
                  voting,
                }
              },
            ]);
    
            const records = getMinifiedRecords(createStoreRecords);
            res.status(201);
            res.json({records});
          } else {
            res.status(422);
            res.json({message: "Name cannot be empty"});
          }
        }
      } else {
        res.status(422);
        res.json({message: "ID cannot be empty"});
      }
      
    } catch (error) {
      console.error(`${error} has occurred with create coffee store API`);
      res.status(500);
      res.json({message: "Something Went Wrong!"})
    }
  } else {
    res.status(400);
    res.json({message: "Method not supported"})
  }
};

export default createCoffeeStore;
