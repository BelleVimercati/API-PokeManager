"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = void 0;
class Trainer {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get specialty() {
        return this.props.specialty;
    }
}
exports.Trainer = Trainer;
