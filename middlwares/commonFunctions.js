const commonFunctions = (model, populate) => async (req, res, next) => {
    // copy the object req.query to delete the select field from it if exists
    let reqQuery = { ...req.query };

    // set the select key word in an array fieldsToBeRemoved
    fieldsToBeRemoved = ['select', 'sort','page' ,'limit'];

    // iterate the array fieldsToBeRemoved and delete its elements from the reqQuery object
    fieldsToBeRemoved.forEach(param => delete reqQuery[param]);

    // convert the reqQuery to string to use the replace method
    let queryString = JSON.stringify(reqQuery);

    // replace the gt gte lt lte in by $gt $lt $gte ... etc.
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // find the bootcamps depending on the query string
    let query = model.find(JSON.parse(queryString));
    // the syntax to use the select => select 
    if (req.query.select) {
        let fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sorting
    if (req.query.sort) {
        let sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('createdAt'); 
    }
    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; // 100 bootcamps by default
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit)

    if (populate) {
        query = query.populate(populate);
    }
    // find the bootcamps with sorting them depending on the req.query.sort
    // find the bootcamps to be selected
    const results = await query;

    // pagination result
    const pagination = {};

    if (lastIndex < total) { // on est pas dans la dérniere page
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) { // on est pas dans la premiere page
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // create an object that can be used anywhere
    res.commonFunctions = {
        success: true,
        count: results.length,
        data: results
    }

    next();
}

module.exports = commonFunctions;