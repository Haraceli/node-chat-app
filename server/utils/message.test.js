const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});

describe('generateLocationMessage', () => {


  it('should generate correct location object', () => {
    var from = 'John';
    var latitude = 15;
    var longitude = 19;
    var url = 'https://google.com/maps?q=15,19';
    var locationMessage = generateLocationMessage(from, latitude, longitude);

    expect(typeof locationMessage.createdAt).toBe('number');
    expect(locationMessage).toMatchObject({from, url});
  });
});
