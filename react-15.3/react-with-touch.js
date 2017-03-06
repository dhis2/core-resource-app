var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');

React.addons = {
    update: require('react-addons-update'),
    createFragment: require('react-addons-create-fragment'),
    TransitionGroup: require('react-addons-transition-group'),
    PureRenderMixin: require('react-addons-pure-render-mixin'),
    CSSTransitionGroup: require('react-addons-css-transition-group'),
    LinkedStateMixin: require('react-addons-linked-state-mixin'),
    ShallowCompare: require('react-addons-shallow-compare'),
};

injectTapEventPlugin();


global.React = React;
global.ReactDOM = ReactDOM;

module.exports = React;
