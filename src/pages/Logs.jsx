import React, { useState } from 'react';
import { Badge, Table, Button, Form, Select, Input, DatePicker, TimePicker, Row, Col, Modal, message, Collapse, Timeline, Segmented } from 'antd';
import { DeleteOutlined, CommentOutlined, MessageOutlined, MailOutlined, WechatWorkOutlined, AppstoreOutlined, BarsOutlined, CodeOutlined, PlusCircleOutlined } from '@ant-design/icons';
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

  const [rootLvlConditionBlock, setRootLvlConditionBlock] = React.useState([]);

  const [selectedBlockID, setSelectedBlockID] = React.useState(null);
  const [selectedSubBlockId, setSelectedSubBlockId] = React.useState(null);

  const priority = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

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
    let groupId = selectedSubBlockId?.groupID;
    let subGroupID = selectedSubBlockId?.subBlockID;
    let expression = {
      id: uuidv4(),
      fact: value.factName,
      operator: value.operator,
      value: value.value
    };
    const topLvl = rootLvlConditionBlock.map((block) => {
      if (block.id === groupId) {
        block.groups.map((group) => {
          if (group.id === subGroupID) {
            group.conditions.push(expression);
          }
        });
      }
      return block;
    });

    setRootLvlConditionBlock(topLvl);
  }

  const groupBilnder = (value) => {
    const groupJson = {
      id: uuidv4(),
      rootConnector: value.rootConnector,
      rightConnector: value.rightConnector,
      conditions: []
    }
    let groupId = selectedBlockID;
    const topLvl = rootLvlConditionBlock.map((block) => {
      if (block.id === groupId) {
        block.groups.push(groupJson);
      }
      return block;
    });
    setRootLvlConditionBlock(topLvl);
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

const conditionItems = rootLvlConditionBlock.map((conditionBlock) => ({
  key: conditionBlock.id,
  label: (
    <span className="textStyleChild" style={{ fontSize: '12px' }}>
      {conditionBlock.name} - {conditionBlock.priority ? `${conditionBlock.priority}% Priority` : 'Default Priority'}
    </span>
  ),
  children: <div>
    <Row justify="end">
      <Button
      size='small'
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setOpenModal(true);
          setSelectedBlockID(conditionBlock.id);
          setInputType('CONDITIONS');
        }}
        style={{ margin: '10px', backgroundColor: '#06D001', borderColor: '#06D001' }}
      >
        <span className='textStyle' style={{ fontSize: '10px', color: 'white' }}>
          Group
        </span>
      </Button>
    </Row>

    {
      rootLvlConditionBlock.map((block) => (
        block.id === conditionBlock.id && (
          block.groups.map((group) => (
            <div style={{ padding: '10px', backgroundColor: '#F5EDED', borderRadius: '10px', width: '100%', margin: 5 }} key={group.id}>
              <span className="textStyleChild" style={{ fontSize: '13px' }}>{group.id}</span>
              <Button type="primary"
              shape='circle'
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setOpenModal(true);
                      setInputType('RULES');
                      setSelectedSubBlockId({
                        groupID: conditionBlock.id,
                        subBlockID: group.id,
                      })
                    }}
                    style={{ margin: '10px', backgroundColor: '#5F6F65', borderColor: '#5F6F65' }} />
                    {
                      group.conditions.map((condition) => (
                        <div style={{ padding: '10px', backgroundColor: '#F7F6DC', borderRadius: '10px', width: 180, margin: 5 }} key={condition.id}>
                          <Row>
                            <Col span={20}>
                              <span className="textStyleChild" style={{ fontSize: '13px' }}>{condition.fact}</span>
                              <br />
                              <span className="textStyleChild" style={{ fontSize: '12px', color: '#5F6F65' }}>{condition.operator} {condition.value}</span>
                            </Col>
                            <Col span={4}>
                              <Button type="primary" icon={<DeleteOutlined />} danger onClick={() => {}} />
                            </Col>
                          </Row>
                        </div>
                      ))
                    }
            </div>
          ))
        )
      ))
    }
  </div>
}));

  const factsItems = [
    {
      key: '1',
      label: (
        <>
          <span className="textStyleChild" style={{ fontSize: '12px' }}>Facts</span>
          <Badge count={facts.length} style={{ backgroundColor: '#00b4d8', marginLeft: 5 }} />
        </>
      ),
      children: (
        <Row>
          {facts.map((fact) => (
            <div style={{ padding: '10px', backgroundColor: '#F7F6DC', borderRadius: '10px', width: 180, margin: 5 }} key={fact.factName}>
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
          ))}
        </Row>
      )
    }
  ];
const checkUniqueness = (expressionId) => {
  console.log(logicalBlock.some(block => block.type.connectWith === expressionId));
  return logicalBlock.some(block => block.type.connectWith === expressionId);
}

const removeFacts = (factName) => {
  const newFacts = facts.filter(fact => fact.factName !== factName);
  setFacts(newFacts);
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

      {
        selectedView === '1' && (
          <>
            <Row>
              <Button type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setOpenModal(true);
                  setInputType('FACTS');
                }}
                style={{ margin: '10px', backgroundColor: '#0466c8', borderColor: '#0466c8' }}>
                <span
                  className='textStyle'
                  style={{ fontSize: '12px', color: 'white' }}>New Fact</span>
              </Button>

              <Button type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setOpenModal(true);
                  setInputType('CONDITION_BLOCK');
                }}
                style={{ margin: '10px', backgroundColor: '#0466c8', borderColor: '#0466c8' }}>
                <span
                  className='textStyle'
                  style={{ fontSize: '12px', color: 'white' }}>Condition Block</span>
              </Button>

              {/* {
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
              } */}
              {/* {
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
              } */}
            </Row>
  


      <Collapse ghost items={factsItems} />

      <Collapse defaultActiveKey={['1']} ghost items={conditionItems} />
          </>
        )
      }

      {
        selectedView === '2' && (
          <>
            <JsonView src={rootLvlConditionBlock} />
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
                    <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#00b4d8', borderColor: '#00b4d8' }}>
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
                // onFinish={(values) => {
                //   setConditionBlocks([...conditionBlocks, {
                //     id: uuidv4(),
                //     name: values.conditionName,
                //     rootConnector: values.rootConnector,
                //     rightConnector: values.rightConnector,
                //     conditions: []
                //   }]);
                // }}
                onFinish={(values) => {
                  groupBilnder(values);
                }}
              >
                    <Form.Item
                      name='conditionName'
                      required={true}
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
                    <Row>
                      <Col span={12}>
                      <Form.Item
                      name='rootConnector'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Root Level Connector</span>}>
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "98%" }}
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

                      <Col span={12}>
                      <Form.Item
                      name='rightConnector'
                      label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Right Side Connector</span>}>
                      <Select
                        className="borderedSelect"
                        bordered={false}
                        style={{ fontSize: '12px', width: "98%" }}
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
          )
        }

        {
          inputType === 'CONDITION_BLOCK' && (
            <div>
              <Form
                layout="vertical"
                onFinish={(values) => {
                  setRootLvlConditionBlock([...rootLvlConditionBlock, {
                    id: uuidv4(),
                    name: values.conditionName,
                    priority: values.priority,
                    rootConnector: values.rootConnector,
                    action: [],
                    groups: []
                  }]);
                }}
              >
                <Row>
                  <Col span={12}>
                  <Form.Item
                  name='conditionName'
                  required={true}
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
                  <Input style={{ width: '98%' }} />
                </Form.Item>
                  </Col>

                  <Col span={12}>
                  <Form.Item
                  name='priority'
                  label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Priority</span>}>
                                    <Select
                    className="borderedSelect"
                    bordered={false}
                    style={{ fontSize: '12px', width: "98%" }}
                  >
                    {
                      priority.map((p) => (
                        <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value={p}>
                          {p}% Priority
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                  </Col>

                  <Col span={12}>
                  <Form.Item
                  name='rootConnector'
                  label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Root Level Connector</span>}>
                  <Select
                    className="borderedSelect"
                    bordered={false}
                    style={{ fontSize: '12px', width: "98%" }}
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

                  <Col span={12}>
                  <Form.Item
                    name='action'
                    label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Action</span>}>
                    <Select
                      className="borderedSelect"
                      bordered={false}
                      style={{ fontSize: '12px', width: "98%" }}
                    >
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="email">
                        Email
                      </Select.Option>
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="sms">
                        SMS
                      </Select.Option>
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="fcm">
                        FCM
                      </Select.Option>
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="pushbullet">
                        Pushbullet
                      </Select.Option>
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="log">
                        Log
                      </Select.Option>
                      <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="api">
                        API
                      </Select.Option>
                    </Select>
                  </Form.Item> 
                  </Col>
                </Row>
                
                <Row justify="end">
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: 120, backgroundColor: '#00b4d8', borderColor: '#00b4d8' }}>
                      <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Add Condition</span>
                    </Button>
                    <Button type="primary" danger style={{ width: 120, marginLeft: 5 }} onClick={() => setOpenModal(false)}>
                      <span className='textStyle' style={{ fontSize: '12px', color: 'white' }}>Close</span>
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
                  
                  {/* {
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
                  } */}
                
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
