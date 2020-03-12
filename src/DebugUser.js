import EventEmitter from 'events';
import SimulateUser from './SimulateUser';

const OWN_PROPERTIES = ['on'];

/**
 * Helper class for providing debug information.
 */
class DebugUser extends SimulateUser {
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

                    target.emitter.emit('beforeCall', { method: prop, args });

                    try {
                        returned = target[prop](...args);

                        return returned;
                    } finally {
                        target.emitter.emit('afterCall', {
                            method: prop,
                            args,
                            returned,
                        });
                    }
                };
            },
        });
    }

    /**
     * Generate a instance using the same class constructor and debug emitter
     *
     * @param {*} ...args
     *
     * @returns {Proxy<DebugUser>}
     */
    build(...args) {
        const Klass = this.constructor;
        const instance = new Klass(...args);
        instance.emitter = this.emitter;

        return instance;
    }

    /**
     * Listen to a debug event.
     *
     * @param {any} args
     */
    on(...args) {
        this.emitter.on(...args);
    }
}

export default DebugUser;
