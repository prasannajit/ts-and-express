import { Router, Request, Response, NextFunction } from "express";
interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}
interface SessionWithLoginContext extends CookieSessionInterfaces.CookieSessionObject {
    session: { loggedIn: string | undefined };
  }
const router = Router();
function requireAuth (req:Request,res:Response,next:NextFunction){
    if(req?.session?.loggedIn){
        next();
        return;
    }
    res.status(403).send('Not permitted');
}
router.get("/login", (req: Request, res: Response) => {
  res.send(`
        <div>
            <form action="/login" method="post" enctype="application/x-www-form-urlencoded">
                <fieldset>
                    <label>Enter email</label>
                    <input name="email" type="email">
                </fieldset>
                <fieldset>
                    <label>Enter password</label>
                    <input name="password" type="password">
                </fieldset>
                <div>
                    <input type="submit">
                </div>
            </form>
        </div>
    `);
});

router.post("/login", (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    req.session = { loggedIn: true };
    res.redirect("/");
  } else {
    res.status(400).send(`Wrong input`);
  }
});

router.get("/", (req: Request, res: Response) => {
  const { loggedIn=false } = req.session as SessionWithLoginContext;
  if(loggedIn){
      res.send(`
        <div>
        <h2>You are logged in</h2>
        <a href="/logout">Logout</a>
        </div>
      `)
  } else{
    res.send(`
        <div>
        <h2>You are not logged in</h2>
        <a href="/login">Login</a>
        </div>
      `)
  }
});
router.use('/protected',requireAuth,(req:Request,res:Response)=>{
    res.send(`Welcome to protected route! Logged in user`)
});
router.get("/logout",(req:Request,res:Response)=>{
    req.session=undefined;
    res.redirect('/login');
});
export { router };
