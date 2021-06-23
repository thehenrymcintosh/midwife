import { Entity } from "src/entities/Entity";
import { EntityList } from "src/entities/EntityList";

function getValidEntities(): Entity<any>[] {
  return [
    new Entity("staff/james.toml", { name: "James", branch: "branches/westminster.toml", articles: "articles/new-story.toml" }),
    new Entity("branches/westminster.toml", { name: "Westminster", staff: ["staff/james.toml"] }),
    new Entity("articles/new-story.toml", {title: "New Story!", author: "staff/james.toml", branch: "branches/westminster.toml", content: "__SELF.md" }),
    new Entity("articles/new-story.md", "#Some markdown!"),
  ]
}

describe("EntityProxy", () => {
  it("Builds from list of Entities", () => {
    expect( () => new EntityList( getValidEntities() )).not.toThrowError();
  });

  it("Gives back a list of proxied entities", () => {
    const entities = new EntityList( getValidEntities() );
    entities.forEach(entity => {
      if (entity.branch) {
        expect(entity.branch.name).toEqual("Westminster");
        expect(entity.branch.staff[0].articles.title).toEqual("New Story!");
        expect(entity.branch.staff[0].articles.content).toEqual("#Some markdown!");
      } else if (entity.author) {
        expect(entity.author.name).toEqual("James");
      } else if (entity.staff) {
        expect(entity.staff[0].name).toEqual("James");
      }
    })
  });

});