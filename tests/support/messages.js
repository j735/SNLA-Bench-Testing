module.exports = (function () {
    
    var prefixList = [ 'First', 'Second', 'Third', 'Fourth', 'Fifth' ]
        , messages = {
            init: 'Carousel wrapper should init'
        }
        ;

    messages.tileMsg = function ( index ) {

        return `${ prefixList[ index - 1 ] } tile should be visible`;
    };

    return messages;
}());