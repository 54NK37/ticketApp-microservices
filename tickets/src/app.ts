import express from "express";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "ticket-app-microservices-common";
import "express-async-errors"; //async function callback can make fail our all throwed errors inside routes
import { currentUser } from "ticket-app-microservices-common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

// app is written separately for testing as we require only app without running on any port
const app = express();
app.set("trust proxy", true); //trust proxy provided by ingress
app.use(express.json());
app.use(
  cookieSession({
    //for https
    signed: false,
    secure: process.env.NODE_ENV !== "test", //supertest sends only http requests
  })
);

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// for all http methods .
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
