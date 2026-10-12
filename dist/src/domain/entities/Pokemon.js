"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
class Pokemon {
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
    get type() {
        return this.props.type;
    }
    get level() {
        return this.props.level;
    }
    set level(level) {
        this.props.level = level;
    }
}
exports.Pokemon = Pokemon;
