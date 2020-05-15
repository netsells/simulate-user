/* global DebugUser */

import EventEmitter from 'events';
import SimulateUser from './SimulateUser';

const OWN_PROPERTIES = Object.freeze(['on', 'emit']);

const CALLBACKS = Object.freeze({
    BEFORE_CALL: 'beforeCall',
    AFTER_CALL: 'afterCall',
});

/**
 * Get a debug user extending a user class.user.
 *
 * @param {SimulateUser} Klass
 * @returns {DebugUser}
 */
function getDebugUser(Klass = SimulateUser) {
    /**
     * Helper class for providing debug information.
     */
    return class DebugUser extends Klass {
        /**
         * Setup the class.
         *
         * @param {any} args
         * @returns {Proxy}
         */
        constructor(...args) {
            super(...args);

            this.emitter = new EventEmitter();

            return new Proxy(this, {
                /**
                 * Get the needed property.
                 *
                 * @param {DebugUser} target
                 * @param {any} prop
                 * @returns {any}
                 */
                get(target, prop) {
                    if (OWN_PROPERTIES.includes(prop)) {
                        return target[prop];
                    }

                    if (typeof target[prop] !== 'function') {
                        return target[prop];
                    }

                    return function(...args) {
                        let returned;
                        const beforeCall = {
                            method: prop,
                            args,
                            target,
                        };

                        target.emit(CALLBACKS.BEFORE_CALL, beforeCall);

                        try {
                            returned = target[prop](...args);

                            return returned;
                        } finally {
                            target.emit(CALLBACKS.AFTER_CALL, {
                                ...beforeCall,
                                returned,
                            });
                        }
                    };
                },
            });
        }

        /**
         * Generate a instance using the same class constructor and debug emitter.
         *
         * @param {any} args
         * @returns {Proxy<DebugUser>}
         */
        build(...args) {
            const Klass = this.constructor;
            const instance = new Klass(...args);
            instance.emitter = this.emitter;

            return instance;
        }

        /**
         * Emit and log an event.
         *
         * @param {string} callback
         * @param {any} args
         */
        emit(callback, ...args) {
            this.emitter.emit(callback, ...args);
        }

        /**
         * Listen to a debug event.
         *
         * @param {any} args
         */
        on(...args) {
            this.emitter.on(...args);
        }
    };
}

export default getDebugUser;
