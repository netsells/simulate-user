// import EventEmitter from 'events';
import SimulateUser from './SimulateUser';

const UNLOGGABLE = [
    'constructor',
    'on',
];

class DebugUser extends SimulateUser {
    // on(...args) {
    //     if (!this.debug) {
    //         return;
    //     }

    //     this.emitter.on(...args);
    // }
}

export default DebugUser;
