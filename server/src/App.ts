import knex from "./persistence";
import express from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import IController from "./interfaces/IController";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: IController[], port: number) {
    this.app = express();
    this.port = port;
    this.initMiddleWares();
    this.initControllers(controllers);
    this.app.use(errorMiddleware);
  }

  private initMiddleWares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private async initDatabase() {
    await knex.migrate.latest();
    await knex.seed.run();
  }

  listen() {
    try {
      this.initDatabase().then(() => {
        this.app.listen(this.port, () => `Server started on port ${this.port}`);
      });
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }
}

export default App;
