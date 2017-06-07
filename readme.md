# New List Tables

The New List Tables (NLT) project is a React-based prototyping area for ideas around content management improvements in WordPress. This project is being lead by the REST API core focus, and aims to modernise the WordPress Dashboard.

<img src="http://i.imgur.com/r3n9Q8R.gif" />

## Currently Supported

* **Support for multiple list tables**: To ensure the approach applies across multiple different screens, the multiple list tables need to be prototyped. Currently, comments and posts are supported.
* **Support for "legacy" columns (non-JS)**: Exploring the backwards compatibility system is key. The current implementation asynchronously loads all columns which aren't supported in JS.

## Roadmap

* **Plugin interface to register custom columns**: We need to provide a way to register custom behaviour.
* **Support for custom list tables**: We should also allow registering additional list tables to support.


## Contributing

This repository is open for collaboration, and we'd love your help as we prototype ideas for improvements to the Dashboard.

We follow the Human Made [React](http://engineering.hmn.md/how-we-work/style/react/) and [ES6](http://engineering.hmn.md/how-we-work/style/es6/) styleguides, which build on-top of the existing WordPress JavaScript styleguides.

This project is licensed under the GPL v2. Copyright [contributors](https://github.com/rmccue/new-list-table/graphs/contributors).


### Building

The NLT project is built in React, and requires a build process via tools available on npm. You need to have both [Node](https://nodejs.org/) and [NPM](https://www.npmjs.com/) installed on your system. You'll also need git to clone this repository.

1. Clone the project via git into your plugins directory:

   ```
   git clone https://github.com/rmccue/new-list-table
   ```

2. Install the npm dependencies:

   ```
   cd new-list-table
   npm install
   ```

3. Run the webpack development server

   ```
   npm start
   ```
