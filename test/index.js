var path = require('path');
var tester = require('gitbook-tester');
var assert = require('assert');

var pkg = require('../package.json');

describe('styles-less', function() {
  it('should convert less style and attach it to the book', function() {
    return tester.builder()
      .withContent('#test me')
      .withLocalPlugin(path.join(__dirname, '..'))
      .withBookJson({
        gitbook: pkg.engines.gitbook,
        "plugins": ["styles-less"],
        "styles": {
          "website": "./styles/website.less"
        }
      })
      .withFile('styles/website.less', '@color:red; body {color: @color;}')
      .create()
      .then(function(result) {

        var index = result.get('index.html');
        var $ = index.$;

        var lessStyles = $('head link[rel="stylesheet"]')
          .map(function(i, elem) {
            return $(elem).attr('href');
          })
          .get() // cheerio -> array conversion
          .filter(function(stylePath) {
            return stylePath.match(/\.\/website-\d+.css/);
          })
          .map(result.get); // find file in the generated folder

        assert.equal(lessStyles.length, 1);
        assert.equal(lessStyles[0].content, 'body{color:red}');
      });
  });
});
