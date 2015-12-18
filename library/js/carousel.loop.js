define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var origTileDom;
        var defaults = {};
        var dataAttr = 'data-crsl-tile';
        var origTileIdPre = 'orig-tile-';
        var pluginNS = 'loop';
        var pluginOn = false;
        var pluginInited = false;

        /**
         * Constructor
         */
        function Loop( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Loop.prototype = {
                    
            setup: function() {

                var self = this;
                
                self.updatePosition = false;
                
                self.funcs = {
                    updatePagination: self.updatePagination.bind( self )
                };
                
                // Carousel subscribers
                self.api.subscribe(
                    self.api.ns + '/buildFrames/before',
                    function() {
                        
                        var pluginAttr = self.api.getOption( pluginNS );
                        pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;

                        // If plugin on, load local object and set up subscribers
                        if ( pluginOn ) {
                            
                            self.carousel = {
                                index: 0,
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                tileArr: self.api.getState( 'tileArr' ),
                                incrementMode: self.api.getOption( 'incrementMode' ),
                                loop: pluginOn
                            };
                            
                            if ( !pluginInited ) {

                                origTileDom = self.carousel.tileArr;

                                self.api.subscribe(
                                    self.api.ns + '/syncState/after',
                                    self.checkLoop.bind( self )
                                );

                                self.api.subscribe(
                                    'animate/transition/after',
                                    self.reposition.bind( self )
                                );

                                self.api.subscribe(
                                    self.api.ns + '/reinit/before',
                                    self.resetLoopDom.bind( self )
                                );

                                // Plugin subscribers
                                self.api.subscribe(
                                    'pagination/buildPagination/before',
                                    self.loadPagination.bind( self )
                                );

                                self.api.subscribe(
                                    'pagination/updatePagination/before',
                                    self.funcs.updatePagination
                                );

                                self.api.trigger( 'updateOptions', { preventNavDisable:true } ); //prevent disabling of prev/next buttons

                                pluginInited = true;
                            }

                            self.createLoopDom.call( self );
                        }
                    }
                );
            },

            resetLoopDom: function() {

                var carousel = this.carousel.dom.carousel;
                var carChildren = carousel.children;
                var tileArr = Array.prototype.slice.call( carChildren );

                for ( var i = 0; i <  tileArr.length; i++ ) {

                    // Remove all but original tiles
                    if ( !tileArr[i].hasAttribute( 'id' ) || tileArr[i].getAttribute( 'id' ).indexOf( origTileIdPre ) === -1 ) {

                        carousel.removeChild( tileArr[i] );
                    }
                }
            },
        
            createLoopDom: function() {
                    
                var newLi, updateObj, dataIndex;
                var clones = [];
                var tileHTMLColl = origTileDom;
                var tileArr = Array.prototype.slice.call( tileHTMLColl );
                var origTiles = tileArr;
                var origTileLength = tileArr.length;
                var curTileLength = origTileLength;
                var carousel = this.carousel.dom.carousel;
                var tilesPerFrame = this.carousel.tilesPerFrame;
                var incrementMode = this.carousel.incrementMode;
                var paginationStart = ( incrementMode === 'frame' ) ? 1 : tilesPerFrame;
                var paginationLength = ( incrementMode === 'frame' ) ?
                                       Math.ceil( ( origTileLength + tilesPerFrame ) / tilesPerFrame ) : origTileLength + tilesPerFrame;

                this.paginationArr = [];
                
                // Tag tiles before cloning                       
                for ( var i = 0; i < tileArr.length; i++ ) {
                    
                    dataIndex = ( incrementMode === 'frame' ) ? Math.floor( i / tilesPerFrame ) : i;
                    tileArr[i].setAttribute( dataAttr, dataIndex );
                    tileArr[i].setAttribute( 'id', origTileIdPre + i ); //identifies original tiles
                }
                
                // Add clones to create full chronological set of frames
                // This could be pretty heavy and could be changed to just fill out the incomplete frame instead
                while ( curTileLength % tilesPerFrame !== 0 ) {
                    
                    for ( i = 0; i < origTileLength; i++, curTileLength++ ) {
 
                        newLi = origTiles[i].cloneNode( true );
                        newLi.removeAttribute( 'id' );
                        carousel.appendChild( newLi );
                        tileArr.push( newLi );
                    }
                }
                
                // Add a clone of the last frame to the beginning
                for ( var i = tilesPerFrame - 1, j = 0; i >= 0; i--, j++ ) {
                    
                    newLi = tileArr[ origTileLength - 1 - i ].cloneNode( true );
                    newLi.removeAttribute( 'id' );
                    carousel.insertBefore( newLi, carousel.children[ 0 + j ] );
                    clones.push( newLi );
                }

                tileArr = clones.concat( tileArr );
                clones = [];
                               
                // Add a clone of the first frame to the end
                for ( i = 0; i < tilesPerFrame; i++ ) {
                    
                    newLi = origTiles[i].cloneNode( true );
                    newLi.removeAttribute( 'id' );
                    carousel.appendChild( newLi );
                    tileArr.push( newLi );
                }
                
                // Load pagination array
                for ( i = paginationStart; i < paginationLength; i++ ) {
                    
                    this.paginationArr.push( i );
                }
                
                // Store first and last paginations indexes in local object
                this.firstPageIndex = ( incrementMode === 'frame' ) ? 1 : tilesPerFrame;
                this.lastPageIndex = ( incrementMode === 'frame' ) ?
                                     Math.ceil( ( tilesPerFrame + origTileLength ) / tilesPerFrame ) - 1 : i - 1;
                
                updateObj = {
                    index: tilesPerFrame,
                    tileArr: tileArr
                };

                this.api.trigger( 'updateState', updateObj );
            },
            
            checkLoop: function( newIndex ) {
                
                var updateObj       = {},
                    tilesPerFrame   = this.carousel.tilesPerFrame,
                    curFrameLength  = this.api.getState( 'curFrameLength' ),
                    curTileLength   = this.api.getState( 'curTileLength' ),
                    index           = newIndex,
                    isFirstFrame    = index === 0,
                    isLastFrame     = index === curTileLength - tilesPerFrame,
                    shouldLoopReset = ( isFirstFrame || isLastFrame );

                if ( shouldLoopReset ) {
                                    
                    if ( isFirstFrame ) {
                        //console.log('isFirstFrame');
                        index = curTileLength - ( tilesPerFrame * 2 );
                    }
                    
                    else if ( isLastFrame ) {
                        //console.log('isLastFrame');
                        index = tilesPerFrame;
                    }
                    
                    updateObj = {
                        index: index,
                        frameIndex: Math.ceil( index / tilesPerFrame ),
                        prevFrameIndex: isFirstFrame ? 1 : curFrameLength - 1
                    };
                    
                    this.carousel.index = index;
                    
                    this.updatePosition = true;
 
                    this.api.trigger( 'updateState', updateObj );
                }
            },
            
            reposition: function() {
                
                if ( this.updatePosition ) {

                    this.api.trigger( 'navigate', this.carousel.index, true );
                    this.updatePosition = false;
                }
            },
            
            loadPagination: function() {

                this.api.trigger( 'cache', 'pagination/paginationArr', this.paginationArr );
            },
            
            updatePagination: function() {
                
                var newFrameIndex
                    , thisFrame
                    , updateVal
                    , newFrame = []
                    , curFrame = this.api.getState( 'curFrame' )
                    ;

                for ( var i = 0; i < curFrame.length; i++ ) {

                    thisFrame = curFrame[ i ];

                    if ( thisFrame ) {

                        newFrameIndex = parseInt( thisFrame.getAttribute( dataAttr ), 10 );
                        newFrame.push( newFrameIndex );
                    }
                }
                
                updateVal = ( newFrame && newFrame.length > 0 ) ? newFrame : 'undefined';

                this.api.trigger( 'cache', 'pagination/newFrameIndex', updateVal );
            }
        };
    
        carousel.plugin( pluginNS, function( options, api ) {

            new Loop( options, api );
        });
    }
);