import express from "express";
import { loginRoute } from "./Routes";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({keys:["A@378%%hshsh"]}))
app.use(loginRoute);
app.listen(3000,()=>{
    console.log(`Listening on port 3000`);
});