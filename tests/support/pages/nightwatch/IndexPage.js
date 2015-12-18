module.exports = {
    url: 'http://localhost/SNLA-Bench-Testing/index.html',
    elements: {
        'carousel': {
            selector: '#example-carousel'
        },
        'wrapper': {
            selector: '.carousel-wrapper .carousel-viewport'
        },
        'next': { 
            selector: '[data-next]' 
        },
        'previous': { 
            selector: '[data-prev]'
        },
        'tile_1': { 
            selector: '.carousel-tile:nth-of-type(1)'
        },
        'tile_2': { 
            selector: '.carousel-tile:nth-of-type(2)'
        },
        'tile_3': { 
            selector: '.carousel-tile:nth-of-type(3)'
        },
        'tile_4': { 
            selector: '.carousel-tile:nth-of-type(4)'
        },
        'tile_5': { 
            selector: '.carousel-tile:nth-of-type(5)'
        },
        'pagination_1': { 
            selector: '[data-frame="0"]'
        },
        'pagination_2': { 
            selector: '[data-frame="1"]'
        },
        'pagination_3': { 
            selector: '[data-frame="2"]'
        },
        'pagination_4': { 
            selector: '[data-frame="3"]'
        },
        'pagination_5': { 
            selector: '[data-frame="4"]'
        }
    },
    commands: [
        {
            updateOptions: function ( options ) {

                this.api.execute( function ( updateObj ) {

                    // Browser environment
                    window.myCarousel.updateOptions( updateObj );

                }, [ options ] ); // external vars have to be passed into browser context

                return this;
            },
            pauseClick: function ( selector, waitTime ) {

                this.click( selector );

                this.api.pause( waitTime );

                return this;
            }
        }
    ]
};