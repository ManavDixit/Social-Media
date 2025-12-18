export default (model) => {
  
  return async (req, res, next) => {
    
    const options=req.options;
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const cursor = req.query.cursor ? new Date(Number(req.query.cursor) || req.query.cursor) : null;//last document createdAt
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex - 1 + limit;
    
       
    
        // let data = await model.find().sort({
        //   createdAt:-1
        //   }).skip(startIndex).limit(limit);
        
        let data;
        let isPrevAvialble = false;
        let isNextAvailable = false;

        if (cursor) {
          const modifiedOptions = { ...options, createdAt: { $lt: cursor } };
          data = await model.find(modifiedOptions).sort({ createdAt: -1 }).limit(limit);

          if (data.length) {
            const firstCreatedAt = new Date(data[0].createdAt);
            const lastCreatedAt = new Date(data[data.length - 1].createdAt);

            // previous available if there are documents newer than the first document in this page
            isPrevAvialble = (await model.countDocuments({ ...options, createdAt: { $gt: firstCreatedAt } })) > 0;

            // next available: only possible when we filled a full page — check for older docs
            if (data.length === limit) {
              isNextAvailable = (await model.countDocuments({ ...options, createdAt: { $lt: lastCreatedAt } })) > 0;
            } else {
              isNextAvailable = false;
            }
          } else {
            isPrevAvialble = (await model.countDocuments({ ...options, createdAt: { $gt: cursor } })) > 0;
            isNextAvailable = false;
          }
        } else {
          data = await model.find(options).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
          isPrevAvialble = startIndex > 0;
          isNextAvailable = endIndex < (await model.countDocuments(options)) - 1;
        }
        req.paginatedData = data;
        req.isPrevAvialble = isPrevAvialble;
        req.isNextAvailable = isNextAvailable;
        next();
    } catch (error) {
        console.log(error);
    }
  };
};
