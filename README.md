# prototype-starter-kit

A quick boilerplate for prototyping javascript using [Browserify][browserify], [Gulp][gulp], [Browser-sync][bs] and Sass + Postcss.

## Usage

```sh
# install dependencies
npm install

# start development server and open in default browser
npm run open

# or just start the server
npm start

# bundle sass and javascript using browserify
npm run bundle
```

This starts a watch server and open `localhost:1337` in your default browser. Changes made to all files with the extensions `js`, `sass`, `scss`, `yml` and `yaml` will build into the `app` folder with an automatic refresh of the server.

- `js` files will transpile into javascript, direct files within the `source` folder will be seperated bundles and those within underlying folders can be imported
- `scss` & `sass` will be compiled to CSS, partials (starts with an underscore) won't be compiled
- `yml` & `yaml` will be compiled to JSON

## Tasks
```sh
npm run start   # start dev server
npm run open    # start dev server and open in default browser
npm run bundle  # build compressed files
npm run deploy  # build compressed files and copies contents app folder to subtree gh-pages
```

[browserify]: http://browserify.org/
[bs]: https://www.browsersync.io/
[gulp]: https://github.com/gulpjs/gulp
