import EventEmitter from 'events';
import SimulateUser from './SimulateUser';

/**
 * Helper class for providing debug information.
 */
class DebugUser {
    /**
     * Setup the class.
     *
     * @param {any} args
     * @returns {Proxy}
     */
    constructor(...args) {
        const user = new SimulateUser(...args);
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
                if (target[prop]) {
                    return target[prop];
                }

                if (typeof user[prop] !== 'function') {
                    return user[prop];
                }

                return function(...args) {
                    let returned;

                    target.emitter.emit('beforeCall', { method: prop, args });

                    try {
                        returned = user[prop](...args);

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
     * Listen to a debug event.
     *
     * @param {any} args
     */
    on(...args) {
        this.emitter.on(...args);
    }
}

export default DebugUser;
