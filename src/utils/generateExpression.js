const operatorRecognizer = (operator) => {
    const operators = {
      equal: '===',
      notEqual: '!==',
      greaterThan: '>',
      lessThan: '<',
      greaterThanInclusive: '>='
    };
    return operators[operator] || '<=';
  };
  
  const connectionRecognizer = (connection) => {
    const connections = {
      and: '&&',
      or: '||'
    };
    return connections[connection] || '';
  };
  
  const generateExpression = (rules) => {
    const expressionMap = {};
    const buildExpression = (rule) => {
      const { id, type } = rule;
      const { factName, operator, value, connection, connectWith } = type;
      const currentExpression = `${factName} ${operatorRecognizer(operator)} ${value}`;
      if (connection && connectWith) {
        const connectionOperator = connectionRecognizer(connection);
        const connectedExpression = expressionMap[connectWith];
        expressionMap[id] = `(${connectedExpression} ${connectionOperator} ${currentExpression})`;
      } else {
        expressionMap[id] = currentExpression;
      }
    };
    rules?.forEach(rule => buildExpression(rule));
  
    return expressionMap[rules[rules.length - 1].id];
  };
  
  export default generateExpression;
  
  
  