define([
    '../../intern-chainable'
], function ( chainable ) {

    var testPage = 'index.html'
        , waitTime = 2000
        , selectors = {
            carousel: '#example-carousel',
            wrapper: '.carousel-wrapper .carousel-viewport',
            next: '[data-next]',
            previous: '[data-prev]',
            tile_1: '.carousel-tile:nth-of-type(1)',
            tile_2: '.carousel-tile:nth-of-type(2)',
            tile_3: '.carousel-tile:nth-of-type(3)',
            tile_4: '.carousel-tile:nth-of-type(4)',
            tile_5: '.carousel-tile:nth-of-type(5)',
            pagination_1: '[data-frame="0"]',
            pagination_2: '[data-frame="1"]',
            pagination_3: '[data-frame="2"]',
            pagination_4: '[data-frame="3"]',
            pagination_5: '[data-frame="4"]'
        }
        ;

    // Page object is created as a constructor, so we can provide the remote Command object at runtime
    function IndexPage( remote ) {

        this.remote = chainable.apply( this, [ remote, IndexPage.prototype ] );
    }

    function checkDisplay( elem ) {

        return elem.isDisplayed();
    }

    IndexPage.prototype = {
        constructor: IndexPage,
        elements: selectors,
        commands: {
            init: function () {

                return this
                    .get( require.toUrl( testPage ) )
                    // .setFindTimeout( 5000 )

                    // Check that carousel initialized
                    .sleep( waitTime )
                    .findByCssSelector( selectors.wrapper )
                    .then( function ( elem ) {

                        return elem.isDisplayed();
                    })
                    ;
            },
            navigate: function ( selector ) {

                return this
                    .findByCssSelector( selector )
                        .click()
                        .end()
                    .sleep( waitTime )
                    ;
            },
            checkTiles: function ( visibleTiles ) {

                var remote = this;

                // Verify all tiles passed are visible and return false if any are not
                return Promise.all( visibleTiles.map( function ( tileIndex ) {

                    return remote
                        .findByCssSelector( selectors[ 'tile_' + tileIndex ] )
                        .then( function ( elem ) {

                            return checkDisplay( elem );
                        })
                        ;
                }))
                .then( function ( rtnArray ) { //success

                    // If any of the tiles are not visible, return false immediately
                    for ( var i = 0; i < rtnArray.length; i++ ) {

                        if ( !rtnArray[ i ] ) {

                            return false;
                        }
                    }

                    // All of the tiles were visible, so return true
                    return true;

                }, function ( err ) { //error: return false

                    console.log( err );

                    return false;
                });
            },
            updateOptions: function ( key, value ) {

                var _updateObj = {};

                _updateObj[ key ] = value;

                return this
                    .execute( function ( updateObj ) {

                        // Browser environment
                        window.myCarousel.updateOptions( updateObj );

                    }, [ _updateObj ] ) // external vars have to be passed into browser context

                    .sleep( waitTime )
                    ;
            }
        }
    };

    return IndexPage;
});