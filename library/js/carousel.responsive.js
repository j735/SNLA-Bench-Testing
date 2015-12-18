define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var defaults = {};
        var tilesByViewport = [
            [ '769px', 3 ],
            [ '480px', 2 ],
            [ '1px', 1 ]
        ];

        /**
         * Constructor
         */
        function Responsive( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Responsive.prototype = {

            timer: undefined,
        
            setup: function() {

                var self = this;
                
                // Subscribe to carousel init event
                this.api.subscribe(
                    
                    this.api.ns + '/init/after',
                    
                    function() {
                        
                        var pluginAttr = self.api.getOption( 'responsive' );
                        var pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;
                        var tilesPerFrame = self.api.getOption( 'tilesPerFrame' );
                        
                        if ( pluginOn ) {
                            
                            self.carousel = {
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: tilesPerFrame,
                                origTilesPerFrame: self.api.getOption( 'origTilesPerFrame' ),
                                currTilesPerFrame: tilesPerFrame,
                                responsive: pluginOn
                            };
                            
                            // Add resize event listener if carousel is not 1-up (stays same across breakpoints)
                            //if ( self.carousel.tilesPerFrame > 1 ) {
                                
                                self.updateCarousel.call( self );

                                var supportsOrientationChange = 'onorientationchange' in window;
                                var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';

                                self.api.addEvent( window, orientationEvent, self.updateCarousel.bind( self ) );
                            //}
                        }
                    }
                );
            },
            
            updateCarousel: function() {

                var mediaQuery, visTileCount;
                var self = this;

                clearTimeout( this.timer );

                this.timer = setTimeout(function() {

                    for ( var i = 0; i < tilesByViewport.length; i++ ) {
                        
                        mediaQuery = '(min-width: ' + tilesByViewport[i][0] + ')';
                        visTileCount = tilesByViewport[i][1];

                        // Renormalize carousel if media query matches
                        if ( window.matchMedia( mediaQuery ).matches ) {
                            
                            console.log(mediaQuery, self.carousel.origTilesPerFrame, self.carousel.currTilesPerFrame, visTileCount);
                            
                            // If the current tiles per frame isn't the same as that specified by this viewport, update carousel
                            if ( visTileCount !== self.carousel.currTilesPerFrame && visTileCount <= self.carousel.origTilesPerFrame ) {

                                self.api.trigger( 'updateOptions', { tilesPerFrame:visTileCount, wrapperClass:'col-' + visTileCount } );
                                //self.api.trigger( 'buildNavigation', true );
                                self.carousel.currTilesPerFrame = visTileCount;
                            }
                            
                            break;
                        }
                    }
                    
                }, 200 ); //throttle listener
            }
        };
    
        carousel.plugin( 'responsive', function( api, options ) {

            new Responsive( api, options );
        });
    }
);