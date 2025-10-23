'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert').get(function (req, res) {
    let input = req.query.input;
    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);

    // 1. Cả số và đơn vị đều sai
    if (initNum === 'invalid number' && initUnit === 'invalid unit') {
      return res.send('invalid number and unit');
    }

    // 2. Sai số
    if (initNum === 'invalid number') {
      return res.send('invalid number');
    }

    // 3. Sai đơn vị
    if (initUnit === 'invalid unit') {
      return res.send('invalid unit');
    }

    // 4. Hợp lệ → thực hiện chuyển đổi
    let returnNum = convertHandler.convert(initNum, initUnit);
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    // ⚠️ FCC yêu cầu trả về JSON với 5 trường
    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string
    });
  });
};
