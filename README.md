# JavaScript Canvas Disc Animation

Demo page: <https://henderstack.github.io/disc-animation/dist/>

A JavaSript HTML5 Canvas '3D' Animation experiment, just for the fun of it.
This example utilizes what are known as 'Doyle Spirals.'

It's all driven by JavaSript and Math.  A series of animated discs in a rotation pattern.

The project source files use:
- Pug (HTML templating)
- SASS (SCSS - for the stylesheet)
- ES6 (JavaScript transpiled by Gulp-Babel to browser-friendly ES5)

# Clone and Run
A Gulpfile is also included, to build and run the project with a simple server with live reloads for changes to the Pug/SASS files (configured to 'localhost:4000'). To get started, simply clone and folow the basic steps:

```sh
$ npm install
$ gulp
```
# Additional Commands

- gulp clean : Cleans the 'dist' directory manually
- gulp dev   : Builds (i.e., transpiles the Pug and SASS files, and moves them to the 'dist' directory
- gulp server : Starts the simple server

License
-----
MIT

**&copy; 2017, Bryan Henderson (henderstack)**
