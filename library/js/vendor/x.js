define(

    [],

    function() {

        'use strict';

        /**
         * X API constructor (don't use new keyword)
         *
         * @module xApi
         */
        function xApi( component ) {

            var xObj = {}
                , channels = {}
                , tokenUid = -1
                ;

            /**
             * Retrieve value from component state object
             *
             * @method getState
             * @param {String} key Key of requested state object entry
             * @return {Any} Value of requested state key
             * @public
             */
            xObj.getState = function getState( key ) {

                return component.state[ key ];
            };

            /**
             * Retrieve value from component option object
             *
             * @method getOption
             * @param {String} key Key of requested options object entry
             * @return {Any} Value of requested option key
             * @public
             */
            xObj.getOption = function getOption( key ) {

                return component.options[ key ];
            };

            /**
             * Trigger component method in context of component instance (called from plugin)
             *
             * @method trigger
             * @param {Function} method Component method to run
             * @return {Any} Returns any value returned by component method triggered
             * @public
             */
            xObj.trigger = function trigger( method ) {

                var func = component[ method ];

                if ( !func ) { return; }

                return func.apply( component, [].slice.call( arguments, 1 ) );
            };

            /**
             * Subscribe method to channel in internal pub-sub system
             *
             * @method subscribe
             * @param {String} channel Name of publishable event
             * @param {Function} method Function to run when named event is published
             * @return {Number} Token of channel/method entry (used in unsubscribe method)
             * @public
             */
            xObj.subscribe = function subscribe( channel, method ) {

                var subscribers;

                tokenUid = tokenUid + 1;

                if ( !channels[ channel ] ) {

                    channels[ channel ] = [];
                }

                subscribers = channels[ channel ];

                subscribers.push({
                    token: tokenUid,
                    method: method
                });

                return tokenUid;
            };

            /**
             * Unsubscribe channel/method entry from internal pub-sub system
             *
             * @method unsubscribe
             * @param {Number} token Token of channel/method entry
             * @return {Number} {Object} Returns token if found in channels object, otherwise X API
             * @public
             */
            xObj.unsubscribe = function unsubscribe( token ) {

                var subscribers;

                for ( var channel in channels ) {

                    if ( channels.hasOwnProperty( channel ) ) {

                        subscribers = channels[ channel ];

                        if ( !subscribers ) { continue; }

                        for ( var i = 0, len = subscribers.length; i < len; i++ ) {

                            if ( subscribers[ i ].token !== token ) { continue; }

                            subscribers.splice( i, 1 );

                            return token;
                        }
                    }
                }

                return xObj;
            };

            /**
             * Publishes events within internal pub-sub system
             *
             * @method publish
             * @param {String} channel Name of event to publish
             * @return {Object} Returns X API
             * @chainable
             * @public
             */
            xObj.publish = function publish( channel ) {

                var subscribers = channels[ channel ]
                    , subsLength = subscribers ? subscribers.length : 0
                    ;

                if ( !subscribers ) { return false; }

                while ( subsLength-- ) {

                    subscribers[ subsLength ].method.apply( subscribers[ subsLength ], [].slice.call( arguments, 1 ) );
                }

                return xObj;
            };

            /**
             * Calls component's override method
             *
             * @method override
             * @param {String} name Name of component method to override
             * @param {Function} func Function which will override component method
             * @return {Any} Returns any value returned by component override method
             * @public
             */
            xObj.override = function override( name, func ) {

                if ( !component.override ) { return; }

                return component.override.call( component, name, func );
            };

            /**
             * Simple method for extending multiple objects into one
             *
             * @method extend
             * @param {Object} Objects to be extended (at least 2)
             * @return {Object} New extended object
             * @author http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method/11197343#11197343
             * @public
             */
            xObj.extend = function extend() {

                var length = arguments.length;

                for ( var i = 1; i < length; i++ ) {

                    for ( var key in arguments[ i ] ) {

                        if( arguments[ i ].hasOwnProperty( key ) ) {

                            arguments[ 0 ][ key ] = arguments[ i ][ key ];
                        }
                    }
                }

                return arguments[ 0 ];
            };

            return xObj;
        }

        /**
         * Creates static interface for instantiating components and plugins
         *
         * @method define
         * @param {String} namespace Namespace of component
         * @param {Object} spec Core object to be used for instantiating new components
         * @return {Object} Returns X API
         * @chainable
         * @public
         */
        xApi.define = function( namespace, spec ) {

            var plugins = {};

            /**
             * Component instance constructor (don't use new keyword)
             *
             * @module component
             */
            var constructor = function( args ) {

                /**
                 * Component instance interface
                 *
                 * @module instance
                 */
                var compInterface = {
                    ns: namespace,
                    /**
                     * Initiates instance-level plugin functionality
                     *
                     * @method setupPlugins
                     * @public
                     */
                    setupPlugins: function setupPlugins() {

                        for ( var member in plugins ) {

                            if ( plugins.hasOwnProperty( member ) ) {

                                if ( !( member in compInterface.options ) ) continue;

                                plugins[ member ]( compInterface.x, compInterface.options[ member ] );
                            }
                        }
                    }
                };

                // Copy spec into interface
                for ( var prop in spec ) {

                    if ( spec.hasOwnProperty( prop ) ) {

                        compInterface[ prop ] = spec[ prop ];
                    }
                }
                    
                // Provide an instance of X API to new interface
                compInterface.x = xApi( compInterface );
                compInterface.x.ns = namespace;

                // Pass arguments to new instance's setup method
                compInterface.setup.apply( compInterface, args );

                return compInterface;
            };

            /**
             * Registers plugin factory functions (called from each plugin)
             *
             * @method constructor.plugin
             * @param {String} name Plugin namespace
             * @param {Object} factory Plugin factory function
             * @public
             */
            constructor.plugin = function plugin( name, factory ) {

                plugins[ name ] = factory;
            };

            /**
             * Instantiates component (usually called from mediator)
             *
             * @method constructor.create
             * @return {Object} Component instance (component.setup() ran)
             * @public
             */
            constructor.create = function create() {

                return constructor( arguments );
            };

            // Return static interface
            return constructor;
        };

        return xApi;
    }
);