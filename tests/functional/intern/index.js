define([
    'intern!object',
    'intern/chai!assert',
    '../../support/pages/intern/IndexPage'
], function ( registerSuite, assert, IndexPage ) {

    registerSuite( function () {

        var indexPage
            , waitTime = 2000
            ;

        return {
            // Create IndexPage instance to be used for all tests
            setup: function () {

                indexPage = new IndexPage( this.remote );
            },
            'carousel: init': function () {

                // Initialize test by navigating to carousel test page: carousel dynamic wrapppers should be present
                return indexPage
                    .init()
                    .then( function ( inited ) {

                        assert.isTrue( inited, 'Carousel should initialize' );
                    }
                );
            },
            'carousel: initial visible tiles': function () {

                // Now, check that tiles 1 and 2 are visible
                return indexPage
                    .checkTiles( [ 1, 2 ] )
                    .then( function ( success ) {

                        assert.isTrue( success, 'First two tiles should be visible' );
                    }
                );
            },
            'carousel: tile next': function () {

                // Now, click next button: tiles 2 and 3 should be visible
                // indexPage.navigate( indexPage.elements.next );

                return indexPage
                    .navigate( indexPage.elements.next )
                    .checkTiles( [ 2, 3 ] )
                    .then( function ( success ) {

                        assert.isTrue( success, 'Tiles two and three should be visible' );
                    }
                );
            },
            'carousel: tile navigate': function () {

                // Now, navigate to fourth tile: tiles 4 and 5 should be visible
                return indexPage
                    .navigate( indexPage.elements.pagination_4 )
                    .checkTiles( [ 4, 5 ] )
                    .then( function ( success ) {

                        assert.isTrue( success, 'Tiles four and five should be visible' );
                    }
                );
            },
            'carousel: tile previous': function () {

                // Now, click previous nav button: tiles 3 and 4 should be visible
                return indexPage
                    .navigate( indexPage.elements.previous )
                    .checkTiles( [ 3, 4 ] )
                    .then( function ( success ) {

                        assert.isTrue( success, 'Tiles three and four should be visible' );
                    }
                );
            },
            'carousel: tile options': function () {

                // Now, update carousel to be a 3-up and navigate to first tile: first 3 tiles should be visible
                return indexPage
                    .updateOptions( 'tilesPerFrame', 3 ) //update carousel options to 3-up
                    .navigate( indexPage.elements.pagination_1 )
                    .checkTiles( [ 1, 2, 3 ] )
                    .then( function ( optionVal ) {

                        assert.isTrue( optionVal, 'First three tiles should be visible' );
                    })
                    ;
            }
        };
    });
});