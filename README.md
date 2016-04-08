# prototype-starter-kit

A quick boilerplate for prototyping javascript using [budõ][budo], [Gulp][gulp] and Sass + Postcss.

## Usage

```sh
# install dependencies
npm install

#start development server, optionally can open automatically in your browser
npm start

# bundle sass and javascript using browserify
npm run bundle
```

This starts a watch server and open `localhost:9966` in your default browser. Changes made to `source/index.js` will bundle the files and refreshes the browser. Changes made to `source/sass/*.scss` will cause CSS injection without losing the current state.

## Tasks
```sh
npm run start   # start dev server
npm run bundle  # build compressed files
```

[budo]: https://github.com/mattdesl/budo
[gulp]: https://github.com/gulpjs/gulp
