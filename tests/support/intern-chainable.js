define([
    'intern/dojo/node!leadfoot/Command',
    'node_modules/lodash/index'
], function ( Command, _ ) {

    var chainable = function( remote, page ) {

        var methodNames = Object.keys( page.commands );

        function PageCommand() {

            Command.apply( this, arguments );
        }

        PageCommand.prototype = Object.create( Command.prototype );
        PageCommand.prototype.constructor = PageCommand;

        _.extend( PageCommand.prototype, page.commands );

        methodNames
            .forEach( function ( name ) {

                this[ name ] = function delegate() {

                    return this.remote[ name ].apply( this.remote, arguments );
                };
                
            }, this );

        return new PageCommand( remote );
    };

    return chainable;
});