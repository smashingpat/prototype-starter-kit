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

This starts a watch server and open `localhost:3000` in your default browser. Changes made to `source/index.js` will bundle the files and refreshes the browser. Changes made to `source/sass/*.scss` will cause CSS injection without losing the current state.

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
