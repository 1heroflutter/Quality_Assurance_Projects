'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  const convertHandler = new ConvertHandler();

  app.get('/api/convert', (req, res) => {
    let input = req.query.input;

    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);

    // Trường hợp cả hai đều sai
    if (initNum === 'invalid number' && initUnit === 'invalid unit') {
      return res.send('invalid number and unit');
    }

    // Trường hợp sai số
    if (initNum === 'invalid number') {
      return res.send('invalid number');
    }

    // Trường hợp sai đơn vị
    if (initUnit === 'invalid unit') {
      return res.send('invalid unit');
    }

    // Nếu hợp lệ, tiếp tục chuyển đổi
    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);

    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    // Trả về JSON đúng format FCC yêu cầu
    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string
    });
  });
};
