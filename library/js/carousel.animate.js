define(
    
    [
        'carousel'
    ],
    
    /**
     * Animation carousel plugin
     *
     * @module carousel.animate
     */
    function( carousel ) {
        
        'use strict';
        
        var defaults = {
            interval: 1000 //1 sec
        };

        var pluginNS = 'animate';

        var pluginOn = false
            , animating = false
            ;

        /**
         * Repeat a function X times at I intervals
         *
         * @method repeat
         * @param {Number} interval Interval at which to call provided function
         * @param {Number} repeats Number of times to repeat
         * @param {Boolean} immediate Flag for delaying running of callback
         * @param {Function} callback Function to run at intervals 
         * @author http://codereview.stackexchange.com/questions/13046/javascript-repeat-a-function-x-times-at-i-intervals
         * @private
         */
        function repeat( interval, repeats, immediate, callback ) {

            var timer;

            var trigger = function () {
                callback();
                --repeats || clearInterval( timer );
            };

            interval = interval <= 0 ? 1000 : interval; // default: 1000ms
            repeats = parseInt( repeats, 10 ) || 0; // default: repeat forever
            timer = setInterval( trigger, interval );

            // Run immediately
            if ( !!immediate ) { trigger(); }
        }

        /**
         * Animate plugin constructor
         *
         * @method Animate
         * @param {Object} api Cross communication API
         * @param {Object} options Configuration object
         * @constructor
         */
        function Animate( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Animate.prototype = {
            
            timer: undefined,
        
            setup: function() {

                var self = this;

                self.pluginNS = pluginNS;
                
                // Subscribe to carousel init event
                self.api.subscribe(

                    self.api.ns + '/init/after',

                    function() {

                        var origNavMethod
                            , carousel
                            , transitionAttr
                            , translateStr
                            , seconds = self.options.interval / 1000
                            , pluginAttr = self.api.getOption( pluginNS )
                            ;

                        pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;

                        if ( pluginOn ) {
                            
                            // Store carousel data
                            self.carData = {
                                dom: self.api.getState( 'dom' ),
                                subRegistry: self.api.getState( 'subRegistry' ),
                                supportsTransitions: self.api.trigger( 'cache', 'supportsTransitions' ),
                                transitionData: self.api.trigger( 'cache', 'transitionData' )
                            };

                            self.carData.vendorPrefix = ( self.carData.transitionData && typeof self.carData.transitionData.prefix !== 'undefined' ) ? self.carData.transitionData.prefix : '';

                            carousel = self.carData.dom.carousel;
                            transitionAttr = self.carData.vendorPrefix + 'transition';
                            translateStr = 'transform' + ' ' + seconds + 's';

                            // If supported, initialize CSS transition setting
                            if ( self.carData.supportsTransitions ) {
                            
                                carousel.style.transition = translateStr;
                                carousel.style[ transitionAttr ] = translateStr;
                            }

                            // Override carousel's core navigate method
                            origNavMethod = self.api.override( 'navigate', function( index, prevAnim ) {

                                // If animation prevented, update the position of carousel statically (default method)
                                if ( prevAnim ) {

                                    origNavMethod( index );
                                }

                                else {

                                    self.api.trigger( 'syncState', index );

                                    self.animate.call( self );
                                }
                            });
                        }
                    }
                );
            },
            
            /**
             * Animates carousel navigation
             *
             * @method animate
             * @public
             */
            animate: function() {

                this.api.publish( this.pluginNS + '/transition/before' );

                var timer
                    , self = this
                    , index = self.api.getState( 'index' )
                    , targetIndex = index
                    , options = self.options
                    , carousel = self.carData.dom.carousel
                    , tilePercent = self.api.trigger( 'cache', 'tilePercent' )
                    , preFrameChange = options.preFrameChange
                    , postFrameChange = options.postFrameChange
                    , seconds = options.interval / 1000
                    , supportsTransitions = self.carData.supportsTransitions
                    , transitionData = self.carData.transitionData
                    , vendorPrefix = self.carData.vendorPrefix
                    , transformAttr = vendorPrefix + 'transform'
                    , transitionEvent = ( transitionData && transitionData.endEvt ) ? transitionData.endEvt : 'transitionend'
                    , translateAmt = tilePercent * targetIndex
                    , transformStr = 'translateX(-' + translateAmt + '%)'
                    , numFrames = Math.ceil( options.interval / 60 )
                    , origin = self.api.getState( 'prevIndex' ) * tilePercent
                    , distance = origin - translateAmt
                    , frameDist = distance / numFrames
                    ;

                // Initial set-up
                var initSettings = function() {

                    animating = true;

                    // Execute preFrameChange callback
                    if ( preFrameChange ) { preFrameChange.call( self ); }

                    // carousel.setAttribute( 'class', 'state-busy' );
                    self.api.trigger( 'toggleAria', self.api.getState( 'tileArr' ), 'remove' );

                    self.api.trigger( 'updateNavigation' );
                };

                // Transition end listener: runs at end of animation
                var listener = function() {

                    clearTimeout( timer );

                    self.api.trigger( 'toggleAria', self.api.getState( 'tileArr' ), 'add' );
                    self.api.trigger( 'toggleAria', self.api.getState( 'curFrame' ), 'remove' );

                    //state.curTile.focus();
                    carousel.className = carousel.className.replace( /\bstate-busy\b/, '' );
                    
                    animating = false;

                    // Execute postFrameChange callback
                    if ( postFrameChange ) { postFrameChange.call( self ); }

                    self.api.publish( self.pluginNS + '/transition/after' );
                };

                // Use CSS transitions
                if ( supportsTransitions ) {

                    initSettings();

                    self.api.subscribe( self.pluginNS + '/transition/after', function() {

                        carousel.removeEventListener( transitionEvent, listener, false );
                    });

                    carousel.addEventListener( transitionEvent, listener, false );

                    carousel.style.transform = transformStr;
                    carousel.style[ transformAttr ] = transformStr;

                    // Set a little longer than transition time, so listener has chance to execute on its own
                    timer = setTimeout( listener , seconds * 1010 );
                }

                // IE9 does not support CSS transitions
                /*
                    TODO Needs easing
                */
                else if ( 'msTransform' in carousel.style ) {

                    initSettings();

                    repeat( 16, numFrames, true, function() {

                        origin -= frameDist;

                        if ( origin < 0 ) {

                            carousel.style.msTransform = 'translateX( 0px )';
                            return;
                        }

                        carousel.style.msTransform = 'translateX( -' + origin + '% )';

                    });

                    setTimeout( function() {

                        listener();

                    }, ( 300 * seconds ) );
                }
            }
        };
    
        carousel.plugin( pluginNS, function( api, options ) {

            new Animate( api, options );
        });
    }
);