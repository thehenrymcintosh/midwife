import { Entity, Entities } from "src/entities/Entity";
import { ModifierPlugin } from "../entities/Plugin";

export default class Aggregator implements ModifierPlugin {
  modify(prevEntities: Entities) : Promise<Entities> {
    const categories: {[k:string]: string[]} = {};
    const entities = [...prevEntities];
    entities.forEach(entity => {
      if (entity.meta()['category']) {
        const category = entity.meta()['category'];
        if (categories[category]) {
          categories[category]?.push(entity.id())
        } else {
          categories[category] = [entity.id()];
        }
      }
    });
    Object.entries(categories)
      .forEach(( [key, val] ) => {
        const e = new Entity(key, val);
        entities.push( e );
      });
    return Promise.resolve(entities);
  }

}

