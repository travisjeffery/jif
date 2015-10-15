var React = require('react');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var giphy = require('giphy-api')('dc6zaTOxFJmzC');

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
      <form onSubmit={this.handleSubmit}>
        <input id="search" type="text" value={this.state.value} placeholder="Search for gifs..." onChange={this.handleChange} />
      </form>
    );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return {list: []};
  },

  componentDidMount: function() {
    var self = this;
    ee.on('search', function(query) {
      giphy.search(query, function(err, res) {
        if (err) throw err;
        self.setState({list: res.data});
      });
    });
  },

  render: function() {
    var list = this.state.list;
    list = list.map(function(e) {
      return (<img src={e.images.fixed_width.webp} />);
    });
    return (
      <section id="photos">
        {list}
      </section>
    );
  }
});

var Main = React.createClass({
  displayName: 'Main',
  render: function() {
    return (
      <div>
        <SearchInput />
		    <List />
      </div>
    );
  },
});

module.exports = Main;
