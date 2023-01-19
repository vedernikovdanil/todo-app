import { Knex } from "knex";
import _ from "lodash";

abstract class Service<TSource extends {}, TResponse> {
  key = "id";
  alias = "";
  abstract query: () => Knex.QueryBuilder<TSource, TResponse[]>;

  withAlias(item: {}) {
    return _.transform<any, any>(
      item,
      (r, v, k) => (r[`${this.alias ? `${this.alias}.` : ""}${k}`] = v)
    );
  }

  async getAll() {
    return await this.query();
  }

  async getById(id: string | number) {
    const data = await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .limit(1);
    return data?.at(0);
  }

  async add(item: Partial<TSource>) {
    const [createdItem] = await this.query()
      .insert(item as any)
      .returning("*");
    return createdItem;
  }

  async edit(id: string | number, item: Partial<TSource>) {
    const [editedItem] = await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .update(item as any)
      .returning("*");
    return editedItem;
  }

  async remove(id: string | number) {
    return await this.query()
      .where(this.withAlias({ [this.key]: id }))
      .delete("*");
  }

  async searchAll(item: Partial<TSource>) {
    return await this.query().where(this.withAlias(item));
  }

  async searchItem(item: Partial<TSource>) {
    const users = await this.query().where(this.withAlias(item)).limit(1);
    return users?.at(0);
  }

  async less(page = 1, limit = 10, orderBy = this.key, desc = false) {
    const offset = (page - 1) * limit;
    const data = await this.query()
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy, desc ? "desc" : "asc");
    return data;
  }

  async pagination(page = 1, limit = 10, orderBy = this.key, desc = false) {
    const data = await this.less(page, limit, orderBy, desc);
    const [{ count }] = (await this.query().count({ count: "*" })) as any;
    return { data, page, limit, count };
  }
}

export default Service;
