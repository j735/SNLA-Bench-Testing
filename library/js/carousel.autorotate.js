define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var subToken;
        var defaults = {
            rotateInterval: 5000, //5 secs
            stopEvent: 'none'
        };
        var pluginNS = 'autorotate';
        var pluginOn = false;
        var pluginStopped = true;

        /**
         * Constructor
         */
        function Autorotate( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Autorotate.prototype = {
            
            timer: undefined,
            
            funcs: {},
        
            setup: function() {

                var self = this;
                
                // Subscribe to carousel init event
                this.api.subscribe(

                    this.api.ns + '/init/after',

                    function() {

                        self.funcs.stop = self.stopRotation.bind( self ); //define bound stopRotation method
                        
                        var pluginAttr = self.api.getOption( pluginNS );
                        pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;

                        if ( pluginOn ) {
                            
                            self.carousel = {
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                curTileLength: self.api.getState( 'curTileLength' ),
                                autorotate: pluginOn
                            };
                            
                            // Subscribe to carousel nextFrame/after event
                            subToken = self.api.subscribe(
                                self.api.ns + '/nextFrame/after',
                                self.rotateCarousel.bind( self )
                            );

                            self.api.subscribe(
                                self.api.ns + '/cache/after',
                                self.checkCache.bind( self )
                            );

                            self.startRotation.call( self );
                        }
                    }
                );
            },
        
            checkCache: function( key, value ) {

                var targetStr = pluginNS + '/stopRotation';

                if ( key === targetStr && value === true ) {

                    this.stopRotation.call( this );
                }
            },

            startRotation: function() {
                    
                this.rotateCarousel();

                pluginStopped = false;
                
                if ( this.options.stopEvent === 'hover' ) {
                    
                    this.api.addEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );
                    
                } else if ( this.options.stopEvent === 'click' ) {
                    
                    this.api.addEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                }
            },
        
            stopRotation: function() {

                if ( !pluginStopped ) {

                    clearTimeout( this.timer );

                    this.api.unsubscribe( subToken );

                    this.carousel.autorotate = false;
                    pluginOn = false;
                    pluginStopped = true;
                    
                    if ( this.options.stopEvent === 'hover' ) {

                        this.api.removeEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );

                    } else if ( this.options.stopEvent === 'click' ) {

                        this.api.removeEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                    }
                }
            },
            
            rotateCarousel: function() {
                
                var self = this;
                var isLast = self.api.getState( 'index' ) + self.carousel.tilesPerFrame >= self.carousel.curTileLength;
                
                clearTimeout( this.timer );
                
                if ( self.carousel.autorotate && !isLast ) {
                    
                    self.timer = setTimeout(function() {
                        
                        if ( self.carousel.autorotate ) {
                            
                            self.api.trigger( 'nextFrame' );
                        }
                        
                    }, self.options.rotateInterval );
                }
            },
        };
    
        carousel.plugin( pluginNS, function( api, options ) {

            new Autorotate( api, options );
        });
    }
);