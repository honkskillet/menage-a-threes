var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

var paths = {
  scripts: ['bower_components/buzz/dist/buzz.min.js','bower_components/d3/d3.min.js', 'bower_components/underscore/underscore.js','bower_components/jquery-cookie/jquery.cookie.js'/*,'dev/js/selfInvokeOpen.js'*/,'dev/js/jquerymobile-swipeupdown.js','dev/js/sound.js', 'dev/js/fontUtil.js','dev/js/threes.js' ,'dev/js/highScores.js','dev/js/love.js'/*,'dev/js/selfInvokeClose.js'*/],
  //images: 'client/img/**/*'
  styleSheets: ['bower_components/font-awesome/css/font-awesome.min.css','dev/css/threes.css'],
  fonts:['bower_components/font-awesome/fonts/*'],
  sounds:['dev/sounds/*'],
};


gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    //.pipe(uglify())
    .pipe(concat('threes.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('css', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.styleSheets)
    .pipe(concat('threes.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'));
});


         
gulp.task('fonts',function(){
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/fonts'));  
});

gulp.task('sounds',function(){
  return gulp.src(paths.sounds)
    .pipe(gulp.dest('build/sounds'));  
});


// Copy all static images
//gulp.task('images', function() {
// return gulp.src(paths.images)
//    // Pass in options to the task
//    .pipe(imagemin({optimizationLevel: 5}))
//    .pipe(gulp.dest('build/img'));
//});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']) ;
  gulp.watch(paths.styleSheets, ['css']) ;
  gulp.watch(['gulpfile.js'], ['css', 'scripts','fonts','sounds']) ;
  //gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'css','fonts','watch','sounds']);
