suite('Motor', function() {
  var b = p5.board('/dev/cu.usbmodem1421', 'arduino'),
      motor = b.pin(9, 'MOTOR');

  test('pin set correctly', function() {
    assert.equal(motor.pin, 9);
    assert.equal(motor.mode, 'pwm');
    assert.equal(motor.direction, 'output');
    assert.equal(motor.special, 'motor');
  });

  test('pin set correctly with constant', function() {
    var cmotor = b.pin(9, b.MOTOR);
    assert.equal(cmotor.pin, 9);
    assert.equal(cmotor.mode, 'pwm');
    assert.equal(cmotor.direction, 'output');
    assert.equal(cmotor.special, 'motor');
  });

  test('methods are defined', function() {
    assert.isFunction(motor.read);
    assert.isFunction(motor.write);
    assert.isFunction(motor.on);
    assert.isFunction(motor.off);
  });
});