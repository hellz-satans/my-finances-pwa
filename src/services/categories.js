import db from '@/db';
import { stringKeyFilter } from '@/filters';

const CategoriesService = {
  /**
   * Find category by key (string).
   *
   * It is **NOT** a good idea to search by `name`, since several categories
   * may have a subcategory with the same name, e.g.,
   * Food => Other, Other => Other.
   *
   * @return {promise} Query result.
   */
  async findByKey(key) {
    if (!key)
      return null;
    return db.categories.get({ key: key })
      .then((c) => {
        //console.debug('findByKey: c', c);
        return c;
      });
  },

  async create(data) {
    if (!data.key)
      data.key = stringKeyFilter(data.name);

    //console.debug('Categories#create: data', data);
    return db.categories.add(data);
  },

  async findOrCreate(data) {
    if (!data.key)
      data.key = stringKeyFilter(data.name);

    return db.categories.get(data.key)
      .then((cat) => {
        if (!cat) {
          return db.categories.add(data)
            .then((key) => {
              data.key = key;
              return data;
            });
        } else {
          return cat
        }
      });
  },

  async update(key, data) {
    return db.categories.update(key, data);
  },

  async upsert(key, data) {
    if (!data.key) data.key = key;

    //console.debug('Categories#upsert: data', data);
    return db.categories.get(key)
      .then((cat) => {
        if (cat) {
          //console.debug('Categories#upsert: updating...');
          return db.categories.update(key, data).then(n => data);
        } else {
          //console.debug('Categories#upsert: adding...');
          return db.categories.add(data)
            .then((k) => {
              data.key = k;
              return data;
            });
        }
      });
  },

  generateKey: stringKeyFilter,
};

export {
  CategoriesService,
};
