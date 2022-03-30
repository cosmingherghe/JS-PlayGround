// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables (variable that we can use in the scope file)
const files = { //adding more than one variable
    scssPath: 'app/scss/**/*.scss',  // ** any other subfolder  *.scss any file that ends in that extension 
    jsPath: 'app/js/**/*.js'
}

// Sass task
function scssTask(){
    return src(files.scssPath) //src() tels golp where to find css file
        // initialize sourcemaps before sass function  
        .pipe(sourcemaps.init())  
        //compile sass files to CSS files
        .pipe(sass())   
        //our files will have the proper vendor prefixes & will get minified  
        .pipe(postcss([autoprefixer(), cssnano() ]))
        //we created the CSS file that we wanted, we can now write our source maps files in the same directory
        .pipe(sourcemaps.write('.'))
        //set destination for our final files into a 'dist' folder
        .pipe(dest('dist')
    );
}

// JS task
function jsTask(){
    return src(files.jsPath)
        //concat all js files into one
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist')
    );
}


// Cachebusting task
const cbString = new Date().getTime();

function cacheBustTask(){
    return src(['index.html'])
        // finds a certain string and replace it with a different string
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))   // starts with 'cb=' continues with an N number of digits
        .pipe(dest('.')
    );
}

// Watch task
// is going to monitor files that we want to detect any changes in
// and then once changes are detected it's going to run these tasks over again
function watchTask() {
    //2 parameters, 1) file that is going to be watched 2) tasks that we want to rerun
    watch([files.scssPath, files.jsPath.jsPath], 
        parallel(scssTask,jsTask));

}

// Default task
exports.default = series(
    parallel(scssTask,jsTask),
    cacheBustTask,
    watchTask
);