import request from "supertest";
import { app } from "../../app";

const createTicket = function () {
  const { cookie } = global.signin();
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "Show",
    price: 10,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get("/api/tickets").send().expect(200);

  expect(res.body.length).toEqual(3);
});
