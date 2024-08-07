import React, { useState } from 'react';
import { Table, Button, Form, Select, Input, DatePicker, TimePicker, Row, Col, Modal, message, Collapse, Timeline, Segmented } from 'antd';
import { DeleteOutlined, CommentOutlined, MessageOutlined, MailOutlined, WechatWorkOutlined, AppstoreOutlined, BarsOutlined, CodeOutlined } from '@ant-design/icons';
import '../styles/style.css';
import { v4 as uuidv4 } from 'uuid';

import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import generateExpression from './../utils/generateExpression';
// If dark mode is needed, import `dark.css`.
// import 'react18-json-view/src/dark.css'

const Logs = () => {
  const [facts, setFacts] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  const [inputType, setInputType] = React.useState('FACTS');

  const [logicalBlock, setLogicalBlock] = React.useState([]);
  const [conditionBlocks, setConditionBlocks] = React.useState([]);
  const [selectedConditionBlock, setSelectedConditionBlock] = React.useState(null);
  const [selectedView, setSelectedView] = React.useState('1');

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

const conditionDefiner = (conditionBlockId) => {
  const conditionBlock = conditionBlocks.find(block => block.id === conditionBlockId);
  const conditions = logicalBlock.filter(block => block.type.groupId === conditionBlockId);
  const condition = conditions.map((block) => {
    return {
      factName: block.type.factName,
      operator: block.type.operator,
      value: block.type.value,
    }
  });
  return {
    name: conditionBlock.name,
    description: conditionBlock.description,
    conditions: condition,
  }
}

const conditionItems = conditionBlocks.map((conditionBlock) => ({
  key: conditionBlock.id,
  label: (
    <span className="textStyleChild" style={{ fontSize: '12px' }}>
      {conditionBlock.name} - {conditionBlock.description} -  {logicalBlock.length > 0 ? generateExpression(logicalBlock) : ''}
    </span>
  ),
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

        <pre>
          {conditionDefiner(block.type.groupId).name}
        </pre>
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

// [{"id":"d8ccabf9-4e23-43b3-a128-0dfce497a8e0","type":{"groupId":"b1ad03c4-0447-4cb7-9c32-c64115207ac4","factName":"humidity","operator":"equal","value":"36"},"rules":[]},{"id":"12b09ac8-d854-42af-9955-6c38b73661e4","type":{"groupId":"b1ad03c4-0447-4cb7-9c32-c64115207ac4","factName":"temperature","operator":"notEqual","value":"36","connection":"and","connectWith":"d8ccabf9-4e23-43b3-a128-0dfce497a8e0"},"rules":[]},{"id":"ce7d5192-972a-4b61-844a-bbafc0e483e0","type":{"groupId":"b1ad03c4-0447-4cb7-9c32-c64115207ac4","factName":"temperature","operator":"equal","value":"36","connection":"and","connectWith":"12b09ac8-d854-42af-9955-6c38b73661e4"},"rules":[]}]



  return (
    <div style={{ padding: '0 15px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1>Logs</h1>
      <p>Logs page content</p>

      <Segmented
          onChange={(value) => {setSelectedView(value);
            console.log(value);
          }}
          options={[
            {
              label: <span className="textStyleChild" style={{ fontSize: '12px' }}>Designer</span>,
              value: '1',
              icon: <BarsOutlined />,
            },
            {
              label: <span className="textStyleChild" style={{ fontSize: '12px' }}>Source</span>,
              value: '2',
              icon: <AppstoreOutlined />,
            },
            {
              label: <span className="textStyleChild" style={{ fontSize: '12px' }}>Timeline</span>,
              value: '3',
              icon: <CodeOutlined />,
            },
          ]}
        />

      {/* <pre>
        {JSON.stringify(facts, null)}
      </pre>

      <pre>
        {JSON.stringify(logicalBlock, null, 2)}
      </pre>

      <pre>
        {JSON.stringify(conditionBlocks, null, 2)}
      </pre> */}

      {
        selectedView === '1' && (
          <>
            <Row>
              <Button type="primary"
                icon={<CommentOutlined />}
                onClick={() => {
                  setOpenModal(true);
                  setInputType('FACTS');
                }}
                style={{ margin: '10px', backgroundColor: '#5F6F65', borderColor: '#5F6F65' }}>
                <span
                  className='textStyle'
                  style={{ fontSize: '12px', color: 'white' }}> New Fact </span>
              </Button>

              {
                facts.length > 0 && (
                  <Button type="primary"
                    icon={<MessageOutlined />}
                    onClick={() => {
                      setOpenModal(true);
                      setInputType('CONDITIONS');
                    }}
                    style={{ margin: '10px', backgroundColor: '#5F6F65', borderColor: '#5F6F65' }}>
                    <span
                      className='textStyle'
                      style={{ fontSize: '12px', color: 'white' }}> New Condition </span>
                  </Button>
                )
              }
              {
                facts.length > 0 && (
                  <Button type="primary"
                    icon={<MailOutlined />}
                    onClick={() => {
                      setOpenModal(true);
                      setInputType('RULES');
                    }}
                    style={{ margin: '10px', backgroundColor: '#5F6F65', borderColor: '#5F6F65' }}>
                    <span
                      className='textStyle'
                      style={{ fontSize: '12px', color: 'white' }}> New Rule </span>
                  </Button>
                )
              }
            </Row>
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

      <Collapse defaultActiveKey={['1']} ghost items={conditionItems} />
          </>
        )
      }

      {
        selectedView === '2' && (
          <>
            <JsonView src={logicalBlock} />
          </>
        )
      }

      <Modal title={<span className="textStyle" style={{ fontSize: '16px' }}>Add New {inputType.toLocaleLowerCase()}</span>}
        visible={openModal}
        footer={null}
        destroyOnClose={true}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}>
        {
          inputType === 'FACTS' && (
            <div>
              <Form
                layout="vertical"
                onFinish={(values) => {
                  setFacts([...facts, values]);
                  setOpenModal(false);
                }}
              >
                <Form.Item
                  style={{ marginTop: '10px' }}
                  name='factName'
                  // fact name must be unique
                  rules={[
                    { required: true, message: 'Please input fact name!' },
                    {
                      validator: (rule, value) => {
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
              </Form>
            </div>)
        }

        {
          inputType === 'CONDITIONS' && (
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
              >
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
                      <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name='discription'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Description</span>}>
                      <Input style={{ width: '100%' }} />
                    </Form.Item>

                <Row justify="end">
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#C9DABF', borderColor: '#C9DABF' }}>
                      <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Group</span>
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </div>
          )
        }

        {
          inputType === 'RULES' && (
            <div>
              <Form
                layout="vertical"
                onFinish={(values) => {
                  defineRules(values);
                }}
              >
                    <Form.Item
                      name='groupId'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Group Name</span>}
                    >
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "100%" }}
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

                    <Form.Item
                      name='factName'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Select Fact</span>}>
                      <Select className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "100%" }}>
                        {
                          facts.map((fact) => (
                            <Select.Option value={fact.factName}>{fact.factName}</Select.Option>
                          ))
                        }
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name='operator'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Operator</span>}
                    >
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "100%" }}
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

                    <Form.Item
                      name='value'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Value</span>}>
                      <Input className="borderedSelect" bordered={false} style={{ width: "100%", height: 32 }} />
                    </Form.Item>
                  
                  {/* connection logic */}
                  {
                    logicalBlock?.length > 0 ? (
                      <>
                     
                          <Form.Item
                            name={`connection`}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Connection</span>}
                          >
                            <Select
                              className="borderedSelect"
                              bordered={false}
                              style={{ fontSize: '12px', width: "100%" }}
                            >
                              <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="and">
                                AND
                              </Select.Option>
                              <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="or">
                                OR
                              </Select.Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name={`connectWith`}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Connect With</span>}
                          >
                            <Select
                              className="borderedSelect"
                              bordered={false}
                              style={{ fontSize: '12px', width: "100%" }}
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
                      </>
                    ) : null
                  }
                
                <Row justify="end">
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#C9DABF', borderColor: '#C9DABF' }}>
                      <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Condition</span>
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </div>
          )
        }
      </Modal>
    </div>
  )
};

export default Logs;
