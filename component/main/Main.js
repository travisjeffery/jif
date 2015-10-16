'use strict';

var React = require('react');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var giphy = require('giphy-api')('dc6zaTOxFJmzC');
var MasonryMixin = require('react-masonry-mixin')(React);

var SearchInput = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },

  handleSubmit: function(e) {
    e.preventDefault();
    ee.emit('search', this.state.value);
  },

  handleChange: function(e) {
    this.setState({value: e.target.value});
  },

  render: function() {
    return (
      <div id="searchbar">
        <form onSubmit={this.handleSubmit}>
        <input id="search" type="text" value={this.state.value} placeholder="Search for gifs..." onChange={this.handleChange} />
        </form>
      </div>
    );
  }
});

var List = React.createClass({
  mixins: [MasonryMixin('photos', {transitionDuration: 0})],

  getInitialState: function() {
    return {
      list: []
    };
  },

  componentDidMount: function() {
    var self = this;
    self.limit = 100;
    self.offset = 0;

    window.addEventListener('scroll', function() {
      var isAtBottom = document.body.scrollTop + window.innerHeight === document.body.scrollHeight;
      if (isAtBottom && !self.isUpdating) {
        self.offset = self.offset + self.limit;
        ee.emit('search');
      }
    });

    ee.on('search', function(query) {
      if (self.isUpdating) return;
      self.isUpdating = true;
      self.query = query = query || self.query;
      giphy.search({q: query, limit: self.limit, offset: self.offset}, function(err, res) {
        if (err) throw err;
        self.setState({list: self.state.list.concat(res.data)});
        self.isUpdating = false;
      });
    });
  },

  render: function() {
    var list = this.state.list;
    list = list.map(function(e) {
      return (<img src={e.images.fixed_width.webp} />);
    });
    return (
      <section id="photos" ref="photos">
        {list}
      </section>
    );
  }
});

var Main = React.createClass({
  displayName: 'Main',
  render: function() {
    return (
      <div id="body">
        <SearchInput />
		    <List />
      </div>
    );
  },
});

module.exports = Main;
