import express, { Request, Response } from "express";
import { NotFoundError, requireAuth } from "ticket-app-microservices-common";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
