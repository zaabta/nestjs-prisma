import { ProductSeed } from './seed.product';
import { DatabaseService } from '../../src/database/database.service';

export class Main {
  constructor(private db: DatabaseService, private productSeed: ProductSeed) {}

  async seed() {
    Promise.all([this.productSeed.seed()])
      .then(async () => this.db.$disconnect())
      .catch(async (e) => {
        console.error(e);
        await this.db.$disconnect();
        process.exit(1);
      });
  }
}

const db = new DatabaseService();
const productSeed = new ProductSeed(db);
const main = new Main(db, productSeed);
main.seed();
