define(

    [
        'carousel'
    ],

    function( carousel ) {

        'use strict';

        var doc = document
            , selected = ' selected'
            , rBusy = /\bstate-busy\b/
            , rSelected = /\s?selected\b/
            , pluginNS = 'pagination'
            , multipleOn = false
            ;

        var defaults = {
            center: true,
            frameText: 'Page {pageNumber} of {total}',
            frameCurrentText: 'Current Page'
        };

        var tmplPagination = doc.createElement( 'ul' )
            //, tmplFrameLink = '<li><a class="carousel-frame{selected}" data-frame="{number}" href="#" title="{current}">{frameText}</a></li>'
            , tmplFrameLink = '<li><a class="carousel-frame" data-frame="{number}" href="#" title="{current}">{frameText}</a></li>'
            ;

        tmplPagination.setAttribute( 'class', 'carousel-pagination' );

        /**
         * Constructor
         */
        function Pagination( api, options ) {

            this.api = api;
            this.options = this.api.extend( {}, defaults, options );

            this.setup();
        }

        Pagination.prototype = {

            setup: function() {

                var self = this;

                this.funcs = {
                    updatePagination: this.updatePagination.bind( this )
                };
                
                this.pluginNS = pluginNS;

                this.api.subscribe(
                    this.api.ns + '/init/before',
                    this.handleOptions.bind( this )
                );

                this.api.subscribe(
                    this.api.ns + '/init/after',
                    function() {

                        self.api.subscribe(
                            self.api.ns + '/updatePosition/after',
                            self.funcs.updatePagination
                        );
                    }
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/controls/insert/before',
                    function() {
                        self.dom = self.api.getState( 'dom' );
                    }
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/controls/insert/after',
                    this.buildPagination.bind( this )
                );

                this.api.subscribe(
                    'animate/transition/before',
                    this.funcs.updatePagination
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/rebuild/after',
                    function() {
                        self.funcs.updatePagination();
                        self.centerControls.bind( self );
                    }
                );
            },

            handleOptions: function() {

                // Get the certian options passed to carousel and add them to the pagination options
                this.options.wrapControls = this.api.getOption( 'wrapControls' );
            },

            buildPagination: function( controls, btnPrev, btnNext ) {

                this.api.publish( this.pluginNS + '/buildPagination/before' );
                
                var paginationArr = this.api.trigger( 'cache', this.pluginNS + '/paginationArr' );

                var current
                    , pageLinks
                    , isSelected
                    , pageLinkWidth
                    , paginationWidth
                    , controlsStyle
                    , frameText
                    , selectedClass
                    , paginationLength
                    , self              = this
                    , state             = this.state
                    , options           = this.options
                    , frameLinks        = []
                    , frameLink         = tmplFrameLink
                    , rNumber           = /\{number\}/
                    , rPageNumber       = /\{pageNumber\}/
                    , rTotal            = /\{total\}/
                    , rCurrent          = /\{current\}/
                    //, rSelected         = /\{selected\}/
                    , rFrameText        = /\{frameText\}/
                    , frameIndex        = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                          this.api.getState( 'frameIndex' ) : this.api.getState( 'index' )
                    , pagination        = tmplPagination.cloneNode( true )
                    , controlsWrap      = controls.parentNode
                    , btnNextParent     = btnNext.parentNode
                    , curFrameLength    = this.api.getState( 'curFrameLength' )
                    , curTileLength     = this.api.getState( 'curTileLength' )
                    , viewportWidth     = this.api.outerWidth( this.dom.viewport )
                    ;

                if ( this.api.getObjType( paginationArr ) === '[object Array]' ) {

                    paginationLength = paginationArr.length;
                }
                
                else {

                    paginationLength  = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ? curFrameLength : curTileLength;
                    
                    paginationArr = [];
                    
                    for ( var i = 0; i < paginationLength; i++ ) {
                        
                        paginationArr.push( i );
                    }
                }
                
                this.paginationArr = paginationArr;
                this.pagination = btnNextParent.insertBefore( pagination, btnNext );

                // Build pagination links
                for ( var i = 0, p = 1; i < paginationLength; i++, p++ ) {
                    
                    isSelected = frameIndex === paginationArr[ i ];
                    selectedClass = isSelected ? selected : '';
                    current = isSelected ? options.frameCurrentText : '';
                    frameText = options.frameText.replace( rPageNumber, p ).replace( rTotal, paginationLength );

                    frameLinks.push(
                        frameLink.replace( rNumber, paginationArr[ i ] )
                            .replace( rCurrent, current )
                            //.replace( rSelected, selectedClass )
                            .replace( rTotal, paginationLength )
                            .replace( rFrameText, frameText )
                    );
                }

                this.pagination.insertAdjacentHTML( 'afterbegin', frameLinks.join('') );
                this.paginationLinks = pagination.querySelectorAll( 'a' );

                this.centerControls();

                this.updatePagination();

                this.api.addEvent( this.pagination, 'click', this.handlePagination.bind( this ) );
                
                this.api.publish( this.pluginNS + '/buildPagination/after' );
            },

            centerControls: function() {

                var controlsWidth
                    ;

                // Center controls beneath carousel
                if ( !( this.options.center && this.options.wrapControls ) ) return;

                controlsWidth = this.api.outerWidth( this.dom.controls );
                
                this.dom.controls.style.position = 'relative';
                this.dom.controls.style.left = '50%';
                this.dom.controls.style.marginLeft = '-' + controlsWidth / 2 + 'px';
            },

            handlePagination: function(e) {

                var element = e.target || e.srcElement // IE uses srcElement
                    , frame = parseInt( element.getAttribute( 'data-frame' ), 10 )
                    , currentFrameIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                          this.api.getState( 'frameIndex' ) : this.api.getState( 'index' )
                    , currentFrameNumber = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                           currentFrameIndex : this.api.getState( 'index' ) + 1
                    ;

                if ( isNaN( frame ) ) return;

                // Try both for IE8 support
                if ( 'preventDefault' in e ) e.preventDefault();
                if ( 'returnValue' in e ) e.returnValue = false;

                if ( currentFrameIndex === frame ) return false;
                if ( this.dom.carousel.className.match( rBusy ) ) return false;
                if ( element.className.match( rSelected ) ) return false; //selected page links aren't clickable

                // loop && frame++;

                this.api.trigger( 'jumpToFrame', frame );

            },

            updatePagination: function() {
                
                this.api.publish( this.pluginNS + '/updatePagination/before' );
                
                var pageLink, linkClass, loopLength;
                var newFrame = [];
                var newFrameIndex = this.api.trigger( 'cache', this.pluginNS + '/newFrameIndex' );
                
                //console.log(newFrameIndex, this.api.getObjType( newFrameIndex ));
                
                // Turn off all pagination links
                for ( var i = 0; i < this.paginationLinks.length; i++ ) {

                    pageLink = this.paginationLinks[ i ];
                    linkClass = pageLink.className;
                    
                    // If link is currently selected, turn off
                    if ( linkClass.match( rSelected ) ) {
                        
                        linkClass = linkClass.replace( rSelected, '' );
                        pageLink.className = linkClass;
                        pageLink.removeAttribute( 'title' );

                        // If multiple page link select not on, stop loop once selected page link is found
                        if ( !multipleOn ) break;
                    }
                }
                
                // No cached new index value, so get current index from state object
                if ( typeof newFrameIndex === 'undefined' ) {

                    newFrameIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                    this.api.getState( 'frameIndex' ) : this.api.getState( 'index' );
                }

                // Load current pagination frame (array of links to be highlighted)
                if ( this.api.getObjType( newFrameIndex ) === '[object Number]' ) {

                    // Value is a number, so only load one page link
                    newFrame.push( this.paginationLinks[ newFrameIndex ] );
                }

                else if ( this.api.getObjType( newFrameIndex ) === '[object Array]' ) {

                    // Value is array: loop through all links if multiple page link select feature is on
                    // Otherwise, just load the first page link
                    loopLength = ( multipleOn ) ? newFrameIndex.length : 1;

                    for ( i = 0; i < loopLength; i++ ) {

                        newFrame.push( this.paginationLinks[ newFrameIndex[i] ] );
                    }
                }

                // Turn current pagination link on
                if ( newFrame && newFrame.length > 0 ) {
                    
                    for ( i = 0; i < newFrame.length; i++ ) {

                        newFrame[i].className += selected;
                        newFrame[i].setAttribute( 'title', this.options.frameCurrentText );
                    }
                }
                
                this.api.publish( this.pluginNS + '/updatePagination/after' );
            }
        };

        carousel.plugin( pluginNS, function( api, options ) {

            new Pagination( api, options );
        });
    }
);