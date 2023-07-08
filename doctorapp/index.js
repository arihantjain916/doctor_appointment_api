const app = require("./app");
const connectWithDb = require("./config/db");


connectWithDb();




port = process.env.PORT || 4000;

app.listen(port,()=>console.log(`Server is up and running on port ${port}`));