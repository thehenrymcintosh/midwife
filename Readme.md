# Denim

Denim is a highly customisable static site builder (not intended for SPAs). Most of the work is done by plugins, and the framework provides a standardised interface for plugins to build up your site. 

Plugins can read files to create entities, modify the list of entities, and render to different template formats. 

The value Denim adds is in the flexibility of the entity structure, which allows arbitrary documents to be dynamically linked when passed to the renderer. This means you can connect any entities together by alias, including abstract entities created by plugins for structures like related articles. 

The EntityList passed to the renderer is a proxy, so you can access properties recursively to your heart's content. To reference one entity from another, you use an alias. By default this is the file name relative to the data directory root, so if you had a staff profile in `staff/john-smith.toml`, you could reference it like so in another file `manager="staff/john-smith.toml"`. 

Upon accessing the property in your view logic, the referenced value will be returned instead. This has no problem with circular references, so you can do things like `{{ branch.manager.branch.manager.branch.manager.branch.name }}` if you wanted to. See the `examples/liquid_test` project for reference. The referenced value can be anything, meaning you can load content from markdown as a string for example (again, in the liquid_test example).

Creating entities is easy! All is takes is an id (usually the original file path) and the data you want the entitity to contain. Metadata is automatically extracted from the `_meta` attribute if available on the data. The data cannot be null / undefined / a function. It may behave unexpectedly if you pass in a class like a Date object, due to the internal workings of the proxy. 
More docs will come later regarding the `_meta` attribute. 

Alises must be unique! The builder will throw an error in the event of an alias clash. 
## Notes
This is a very basic initial Readme after completing the proof-of-concept with some example plugins. It will be made better. 

