import request from "supertest";
import server, { conectarDB } from "../../server";

describe("Test", () => {
  beforeAll(async () => {
    await conectarDB();
  });

  it("Debe regresar codigo 200 para /", async () => {
    const response = await request(server).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Bien");
  });
});
