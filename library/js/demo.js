require(
    
	[
		'carousel',
        '../../tests/data/carousel-data',
        'carousel.pagination',
        // 'carousel.autorotate',
        // 'carousel.loop',
        'carousel.animate'
	],
    
    function( carousel, data ) {
		
        // Expose carousel for functional testing
        window.myCarousel = carousel.create({
            element: document.getElementById( data.carouselId ),
            wrapperClass: 'test-1 test-2',
            tilesPerFrame: data.visibleTileCount,
            incrementMode: data.incrementMode,
            nextText: 'next',
            prevText: 'previous',
            wrapControls: true,
            pagination: {
                frameText: '{pageNumber} of {total}',
                center: true // TODO handle centering when wrapControls is false. Should it simply not be done? Should wrapControls be forced to true?
            },
            animate: true
            // loop: true
            //responsive: true
        });
	}
);