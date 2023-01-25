import { Knex } from "knex";
import _ from "lodash";

class KnexOperations<
  TSource extends { id: string | number },
  TResponse extends {}
> implements IServiceOperations<TSource, TResponse>
{
  constructor(
    protected query: () => Knex.QueryBuilder<TResponse, TResponse[]>,
    protected alias = "",
    protected key = "id" as keyof TSource
  ) {}

  protected withAlias(item: {}) {
    const alias = this.alias ? `${this.alias}.` : "";
    return _.transform<any, any>(item, (r, v, k) => (r[`${alias}${k}`] = v));
  }

  async getAll() {
    const data = (await this.query()) as TResponse[];
    return data;
  }

  async getById(id: TSource["id"]) {
    const data = (await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .limit(1)) as TResponse[];
    return data?.at(0);
  }

  async create(item: Partial<TSource>) {
    const [createdItem] = (await this.query()
      .insert(item as any)
      .returning("*")) as TResponse[];
    return createdItem;
  }

  async edit(id: TSource["id"], item: Partial<TSource>) {
    const [editedItem] = (await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .update(item as any)
      .returning("*")) as TResponse[];
    return editedItem;
  }

  async remove(id: TSource["id"]) {
    const [deletedItem] = (await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .delete("*")) as TResponse[];
    return deletedItem;
  }

  async searchAll(item: Partial<TSource>) {
    const data = (await this.query().where(
      this.withAlias(item)
    )) as TResponse[];
    return data;
  }

  async search(item: Partial<TSource>) {
    const data = (await this.query()
      .where(this.withAlias(item))
      .limit(1)) as TResponse[];
    return data?.at(0);
  }

  async less(page = 1, limit = 10, orderBy = this.key, desc = false) {
    const offset = (page - 1) * limit;
    const data = (await this.query()
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy as any, desc ? "desc" : "asc")) as TResponse[];
    return data;
  }

  async pagination(page = 1, limit = 10, orderBy = this.key, desc = false) {
    const data = await this.less(page, limit, orderBy, desc);
    const countData = await this.query().clearSelect().count({ count: "*" });
    const count = +(countData as any)[0].count;
    return { data, page, limit, count };
  }
}

export default KnexOperations;
