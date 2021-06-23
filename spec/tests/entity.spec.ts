import { Entity } from "src/entities/Entity";


describe("Entity", () => {
  it("Unwrapped data matches initial data", () => {
    const testData = [
      "this is a bunch of text!",
      42,
      {"test": "ing"},
    ];
    for (const input of testData) {
      const entity = new Entity("test.liquid", input);
      expect(entity.unwrap()).toEqual(input);
    }
  });

  it("Cannot be created with undefined, null, or functions", () => {
    const testData = [
      undefined,
      null,
      () => "Function"
    ];
    for (const input of testData) {
      expect(()=> { new Entity("test.liquid", (input as any)) }).toThrowError()
    }
  })

  it("Extracts metadata if present", () => {
    const input = {
      _meta: {
        aliases: ["example", "__SELF"],
        alias: "another",
        outpath: "__SELF",
      },
      example: "__SELF.md",
    }
    const r = new Entity("test.liquid", input);
    expect(r.aliases().sort()).toEqual(["test.liquid", "example", "test", "another"].sort());
    expect(r.outpath()).toEqual("test");
    expect(r.unwrap().example).toEqual("test.md");
  })

});