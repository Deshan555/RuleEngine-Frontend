import React, { useState } from 'react';
import { Table, Button, Form, Select, Input, DatePicker, TimePicker, Row, Col, Modal, message, Collapse } from 'antd';
import { DeleteOutlined, CommentOutlined, MessageOutlined, MailOutlined, WechatWorkOutlined } from '@ant-design/icons';
import '../styles/style.css';
import { v4 as uuidv4 } from 'uuid';

const Logs = () => {
  const [facts, setFacts] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  const [inputType, setInputType] = React.useState('FACTS');

  const [logicalBlock, setLogicalBlock] = React.useState([]);
  const [conditionBlocks, setConditionBlocks] = React.useState([]);
  const [selectedConditionBlock, setSelectedConditionBlock] = React.useState(null);

  const dataTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'datetime', label: 'DateTime' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
  ];

  const defineRules = (value) => {
    setLogicalBlock([...logicalBlock, {
      id: uuidv4(),
      type: value,
      rules: []
    }]); 
  }

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

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <div>
      <p>{text}</p>
      <p>{text}</p>
      <p>{text}</p>

      <div style={{ backgroundColor: '#E7E8D8', borderRadius: '10px', padding: '10px', width: 600, margin: 5 }}>
        <span className="textStyleChild" style={{ fontSize: '12px' }}>Fact Name</span>
      </div>

    </div>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const conditionItems = conditionBlocks.map((conditionBlock) => ({
  key: conditionBlock.id,
  label: <span className="textStyleChild" style={{ fontSize: '12px' }}>{conditionBlock.name} - {conditionBlock.description}</span>,
  children: <div>
{
  logicalBlock.map((block) => (
    block.type.groupId === conditionBlock.id && (
      <div style={{ padding: '10px', backgroundColor: '#F5EDED', borderRadius: '10px', width: 180, margin: 5 }} key={block.id}>
        <Row>
          <Col span={20}>
            <span className="textStyleChild" style={{ fontSize: '13px' }}>{block.type.factName}</span>
            <br />
            <span className="textStyleChild" style={{ fontSize: '12px', color: '#5F6F65' }}>
              {block.type.operator} {block.type.value}
            </span>
          </Col>
          <Col span={4}>
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Col>
        </Row>
      </div>
    )
  ))
}
  </div>
}));

const checkUniqueness = (expressionId) => {
  console.log(logicalBlock.some(block => block.type.connectWith === expressionId));
  return logicalBlock.some(block => block.type.connectWith === expressionId);
}

  return (
    <div style={{ padding: '0 15px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1>Logs</h1>
      <p>Logs page content</p>

      <Row>
        <Button type="primary"
          icon={<CommentOutlined />}
          onClick={() => setOpenModal(true)}
          style={{ margin: '10px', backgroundColor: '#5F6F65', borderColor: '#5F6F65' }}>
          <span
            className='textStyle'
            style={{ fontSize: '12px', color: 'white' }}> New Fact </span>
        </Button>
      </Row>

      <pre>
        {JSON.stringify(facts, null)}
      </pre>

      <pre>
        {JSON.stringify(logicalBlock, null, 2)}
      </pre>

      <pre>
        {JSON.stringify(conditionBlocks, null, 2)}
      </pre>

      <Row>
        {
          facts.map((fact) => (
            <div style={{ padding: '10px', backgroundColor: '#F5EDED', borderRadius: '10px', width: 180, margin: 5 }}>
              <Row>
                <Col span={20}>
                  <span className="textStyleChild" style={{ fontSize: '13px' }}>{fact.factName}</span>
                  <br />
                  <span className="textStyleChild" style={{ fontSize: '12px', color: '#5F6F65' }}>{fact.dataType}</span>
                </Col>
                <Col span={4}>
                  <Button type="primary" icon={<DeleteOutlined />} danger />
                </Col>
              </Row>
            </div>
          ))
        }
      </Row>

      <div>
        <Form
          layout="vertical"
          onFinish={(values) => {
            setConditionBlocks([...conditionBlocks, {
              id: uuidv4(),
              name: values.conditionName,
              description: values.discription,
            }]);
          }}
          onFinishFailed={(errorInfo) => {
            message.error('Failed:', errorInfo);
          }}
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  name='conditionName'
                  required={true}
                  // must be unique
                  rules={[
                    { required: true, message: 'Please input condition block name!' },
                    { 
                      validator: (_, value) => {
                        return conditionBlocks.some(block => block.name === value)
                          ? Promise.reject(new Error('Condition block name must be unique!'))
                          : Promise.resolve();
                      }
                    }
                  ]}
                  label={<span className="textStyleChild" style={{ fontSize: '12px', width: '96%' }}>Condition Block Name</span>}>
                    <Input style={{ width: '96%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='discription'
                  label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Description</span>}>
                    <Input style={{ width: '96%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#C9DABF', borderColor: '#C9DABF' }}>
                <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Group</span>
              </Button>
            </Form.Item>
          </Row>
          </Form>
      </div>

      <div>
        <Form
          layout="vertical"
          onFinish={(values) => {
            defineRules(values);
          }}
          onFinishFailed={(errorInfo) => {
            message.error('Failed:', errorInfo);
          }}
          >
          <Row>
            <Col 
              span={8}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Form.Item
                name='groupId'
                label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Group Name</span>}
              >
                <Select
                  className="borderedSelect"
                  bordered={false}
                  style={{ fontSize: '12px', width: "96%" }}
                  onChange={(value) => {
                    setSelectedConditionBlock(value);
                  }}
                >
                  {
                    conditionBlocks.map((block) => (
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value={block.id}>
                        {block.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              </Col>
            <Col span={8}>
              <Form.Item
                name='factName'
                label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Select Fact</span>}>
                <Select className="borderedSelect"
                  bordered={false}
                  style={{ fontSize: '12px', width: "96%" }}>
                  {
                    facts.map((fact) => (
                      <Select.Option value={fact.factName}>{fact.factName}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='operator'
                label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Operator</span>}
              >
                <Select
                  className="borderedSelect"
                  bordered={false}
                  style={{ fontSize: '12px', width: "96%" }}
                >
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="equal">
                    Equal (==)
                  </Select.Option>
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="notEqual">
                    Not Equal (!=)
                  </Select.Option>
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="greaterThan">
                    Greater Than
                  </Select.Option>
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="lessThan">
                    Less Than
                  </Select.Option>
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="greaterThanInclusive">
                    Greater Than or Equal
                  </Select.Option>
                  <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="lessThanInclusive">
                    Less Than or Equal
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='value'
                label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Value</span>}>
                <Input className="borderedSelect" bordered={false} style={{ width: "96%", height: 32 }} />
              </Form.Item>
            </Col>
             {/* connection logic */}
            {
              logicalBlock?.length > 0 ? (
                <>
                  <Col span={8}>
                    <Form.Item
                      name={`connection`}
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Connection</span>}
                    >
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "96%" }}
                      >
                        <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="and">
                          AND
                        </Select.Option>
                        <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="or">
                          OR
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* connect with */}
                  <Col span={8}>
                    <Form.Item
                      name={`connectWith`}
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Connect With</span>}
                    >
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "96%" }}
                      >
                        {
                          logicalBlock && logicalBlock.length > 0 && logicalBlock.map((block) => (
                            block.type.groupId === selectedConditionBlock && !checkUniqueness(block.id) && (
                              <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value={block.id} key={block.id}>
                                {block.type.factName} {operatorRecognizer(block.type.operator)} {block.type.value}
                              </Select.Option>
                            )
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              ) : null
            }
          </Row>
          <Row justify="end">
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#C9DABF', borderColor: '#C9DABF' }}>
                <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Condition</span>
              </Button>
            </Form.Item>
          </Row>
          </Form>
      </div>

      <Collapse defaultActiveKey={['1']} ghost items={conditionItems} />


      <Modal title={<span className="textStyle" style={{ fontSize: '16px' }}>Add Fact</span>}
        visible={openModal}
        footer={null}
        destroyOnClose={true}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}>
        <Form
          layout="vertical"
          onFinish={(values) => {
            setFacts([...facts, values]);
            setOpenModal(false);
          }}
          onFinishFailed={(errorInfo) => {
            message.error('Failed:', errorInfo);
          }}
        >
          <Form.Item
            style={{ marginTop: '10px' }}
            name='factName'
            // fact name must be unique
            rules={[
              { required: true, message: 'Please input fact name!' },
              { validator: (rule, value) => {
                  if (facts.find(fact => fact.factName === value)) {
                    return Promise.reject('Fact name must be unique!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Fact Name</span>}>
            <Input className="borderedSelect" bordered={false} style={{ width: "100%", height: 32 }} />
          </Form.Item>

          <Form.Item
            name='dataType'
            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Fact Type</span>}>
            <Select className="borderedSelect"
              bordered={false}
              style={{ fontSize: '12px', width: "100%" }}>
              {
                dataTypes.map((type) => (
                  <Select.Option value={type.value}>{type.label}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>

          <Row justify="end">
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#C9DABF', borderColor: '#C9DABF' }}>
                <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Fact</span>
              </Button>
              <Button type="primary" danger style={{ width: 120, marginLeft: 5 }} onClick={() => setOpenModal(false)}>
                <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Close</span>
              </Button>
            </Form.Item>
          </Row>

          <div style={{ height: 20, backgroundColor: '#FFFBF5'}}>

          </div>

        </Form>
      </Modal>
    </div>
  )
};

export default Logs;
