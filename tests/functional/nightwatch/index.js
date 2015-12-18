var data = require( '../../data/carousel-data' )
    , messages = require( '../../support/messages' )
    , carouselPage
    , waitTime = 1000
    ;

module.exports = {
    before: function( browser ) {

        carouselPage = browser.page.IndexPage();
    },
    after: function( browser ) {

        browser.end();
    },
    'carousel: init': function () {

        carouselPage
            .navigate()
            .assert.visible( '@wrapper', messages.init )
            ;
    },
    'carousel: initial visible tiles': function () {

        carouselPage
            .assert.visible( '@tile_1', messages.tileMsg( 1 ) )
            .assert.visible( '@tile_2', messages.tileMsg( 2 ) )
            ;
    },
    'carousel: tile next': function () {

        carouselPage
            .pauseClick( '@next', waitTime )
            .assert.visible( '@tile_2', messages.tileMsg( 2 ) )
            .assert.visible( '@tile_3', messages.tileMsg( 3 ) )
            ;
    },
    'carousel: tile navigate': function () {

        carouselPage
            .pauseClick( '@pagination_4', waitTime )
            .assert.visible( '@tile_4', messages.tileMsg( 4 ) )
            .assert.visible( '@tile_5', messages.tileMsg( 5 ) )
            ;
    },
    'carousel: tile previous': function () {

        carouselPage
            .pauseClick( '@previous', waitTime )
            .assert.visible( '@tile_3', messages.tileMsg( 3 ) )
            .assert.visible( '@tile_4', messages.tileMsg( 4 ) )
            ;
    },
    'carousel: update options': function () {

        var updateObj = {
            tilesPerFrame: 3
        };

        carouselPage
            .updateOptions( updateObj )
            .pauseClick( '@pagination_1', waitTime )
            .assert.visible( '@tile_1', messages.tileMsg( 1 ) )
            .assert.visible( '@tile_2', messages.tileMsg( 2 ) )
            .assert.visible( '@tile_3', messages.tileMsg( 3 ) )
            ;
    }
};