/*
  Require and initialise PhantomCSS module
  Paths are relative to CasperJs directory
*/

var fs = require( 'fs' );
var path = fs.absolute( fs.workingDirectory + '/phantomcss.js' );
var phantomcss = require( path );

casper.test.begin( 'Coffee machine visual tests', function ( test ) {
  phantomcss.init( {
    rebase: casper.cli.get( "rebase" ),
    // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
    casper: casper,
    libraryRoot: fs.absolute( fs.workingDirectory + '' ),
    screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
    failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/demo/failures' ),
    addLabelToFailedImage: false,
  } );

  casper.on( 'remote.message', function ( msg ) {
    this.echo( msg );
  } )

  casper.on( 'error', function ( err ) {
    this.die( "PhantomJS has errored: " + err );
  } );

  casper.on( 'resource.error', function ( err ) {
    casper.log( 'Resource load error: ' + err, 'warning' );
  } );

  /*
    The test scenario
  */
  casper.start( fs.absolute( fs.workingDirectory + '/../index.html' ) );

  casper.viewport( 320, 480 );

  casper.then( function () {
    phantomcss.screenshot( 'body', 'テストページ' );
  } );

  casper.then( function now_check_the_screenshots() {
    // compare screenshots
    phantomcss.compareAll();
  } );

  /*
  Casper runs tests
  */
  casper.run( function () {
    console.log( '\nTHE END.' );
    // phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  } );
} );
