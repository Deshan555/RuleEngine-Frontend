import React, { useState } from 'react';
import { Table, Button, Form, Select, Input, DatePicker, TimePicker, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import '../styles/style.css';

const RuleEngine = () => {
    const [selectedDataType, setSelectedDataType] = useState('string');
    const [logicBlocks, setLogicBlocks] = useState([]);
    const [ruleGroups, setRuleGroups] = useState([]);
    
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
  
    const renderInputField = () => {
      switch (selectedDataType) {
        case 'string':
          return <Input className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'number':
          return <Input type="number" className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'boolean':
          return (
            <Select className="borderedSelect" bordered={false} style={{ width:"96%"}}>
              <Select.Option value="true">True</Select.Option>
              <Select.Option value="false">False</Select.Option>
            </Select>
          );
        case 'date':
          return <DatePicker className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'time':
          return <TimePicker className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'datetime':
          return <DatePicker showTime className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'array':
          return <Input.TextArea className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        case 'object':
          return <Input.TextArea className="borderedSelect" bordered={false} style={{ width:"96%"}}/>;
        default:
          return null;
      }
    };

    const addLogicBlock = () => {
        setLogicBlocks([...logicBlocks, {
            factName: '',
            operator: '',
            dataType: '',
            value: '',
        }]);
    };

    const removeLogicalBlock = (blockIndex) => { 
        const updatedBlocks = logicBlocks.filter((_, index) => index !== blockIndex);
        setLogicBlocks(updatedBlocks);
    }

    const addRuleGroup = () => {
        setRuleGroups([...ruleGroups, {
            groupCombinator : ''
        }]);
    };

    const addLogicalBlockIntoGroup = (groupID) => {
        const updateLogicalGroup = ruleGroups.map((group, index) => {
            if (index === groupID) {
                const logicBlocks = Array.isArray(group.logicBlocks) ? group.logicBlocks : [];
                return { 
                    ...group, 
                    logicBlocks: [...logicBlocks, {
                        factName: '',
                        operator: '',
                        dataType: '',
                        value: '',
                    }] 
                };
            }
            return group;
        });
        setRuleGroups(updateLogicalGroup);
    }

    // const removeLogicalBlockInGroup = (groupIndex, blockIndex) => {
    //     const updatedBlocks = ruleGroups?.map
    // }
    const removeLogicalBlockInGroup = (groupIndex, blockIndex) => {
        const updatedRuleGroups = ruleGroups.map((group, gIndex) => {
            if (gIndex === groupIndex) {
                const updatedLogicBlocks = group.logicBlocks.filter((block, bIndex) => bIndex !== blockIndex);
                return {
                    ...group,
                    logicBlocks: updatedLogicBlocks,
                };
            }
            return group;
        });
        setRuleGroups(updatedRuleGroups);
    };
    

    
    const renderRuleGroup = (index) => (
        <>
            <div key={index} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '10px', border: '1px solid #ccc' }}>
                <Row>
                    <Form.Item>
                        <Button
                            type="primary"
                            className="textStyle-small"
                            style={{ marginBottom: '10px', backgroundColor: "#00B96B", borderColor: "#00B96B" }}
                            onClick={() => addLogicalBlockIntoGroup(index)}
                        >
                            Add Logic Block
                        </Button>
                    </Form.Item>
                    <Form.Item style={{ marginLeft: '10px' }}>
                        <Select
                            className="borderedSelect"
                            bordered={false}
                            style={{ width: "200px", fontSize: '10px' }}
                            placeholder="Rule Combinator"
                            onChange={(value) => {
                                const updatedGroups = ruleGroups.map((group, i) => {
                                    if (i === index) {
                                        return { ...group, groupCombinator: value };
                                    }
                                    return group;
                                });
                                setRuleGroups(updatedGroups);
                            }}
                        >
                            <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="all">
                                All (AND)
                            </Select.Option>
                            <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="any">
                                Any (OR)
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Row>
                {ruleGroups[index]?.logicBlocks?.map((_, i) => renderInLogicBlock(index, i))}
            </div>
        </>
    );
    
    const renderInLogicBlock = (groupIndex, blockIndex) => {
        const logicBlocks = ruleGroups[groupIndex].logicBlocks;
        return (
            <div key={blockIndex} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '10px', border: '1px solid #ccc' }}>
                <Row>
                    <Col span={6}>
                        <Form.Item
                            name={`factName-${groupIndex}-${blockIndex}`}
                            onChange={(e) => {
                                const updatedBlocks = logicBlocks.map((block, i) => {
                                    if (i === blockIndex) {
                                        return { ...block, factName: e.target.value };
                                    }
                                    return block;
                                });
                                const updatedGroups = ruleGroups.map((group, i) => {
                                    if (i === groupIndex) {
                                        return { ...group, logicBlocks: updatedBlocks };
                                    }
                                    return group;
                                });
                                setRuleGroups(updatedGroups);
                            }}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Fact Name</span>}
                        >
                            <Input className="borderedSelect" bordered={false} style={{ width: "96%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name={`operator-${groupIndex}-${blockIndex}`}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Operator</span>}
                        >
                            <Select
                                className="borderedSelect"
                                bordered={false}
                                style={{ fontSize: '12px', width: "96%" }}
                                onChange={(value) => {
                                    const updatedBlocks = logicBlocks.map((block, i) => {
                                        if (i === blockIndex) {
                                            return { ...block, operator: value };
                                        }
                                        return block;
                                    });
                                    const updatedGroups = ruleGroups.map((group, i) => {
                                        if (i === groupIndex) {
                                            return { ...group, logicBlocks: updatedBlocks };
                                        }
                                        return group;
                                    });
                                    setRuleGroups(updatedGroups);
                                }}
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
                    <Col span={6}>
                        <Form.Item
                            name={`dataType-${groupIndex}-${blockIndex}`}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Data Types</span>}
                        >
                            <Select
                                className="borderedSelect"
                                bordered={false}
                                style={{ width: "96%" }}
                                onChange={(value) => {
                                    const updatedBlocks = logicBlocks.map((block, i) => {
                                        if (i === blockIndex) {
                                            return { ...block, dataType: value };
                                        }
                                        return block;
                                    });
                                    const updatedGroups = ruleGroups.map((group, i) => {
                                        if (i === groupIndex) {
                                            return { ...group, logicBlocks: updatedBlocks };
                                        }
                                        return group;
                                    });
                                    setRuleGroups(updatedGroups);
                                }}
                            >
                                {dataTypes.map((item) => (
                                    <Select.Option key={item.value} className="textStyleChild" style={{ fontSize: '12px' }} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name={`value-${groupIndex}-${blockIndex}`}
                            onChange={(e) => {
                                const updatedBlocks = logicBlocks.map((block, i) => {
                                    if (i === blockIndex) {
                                        return { ...block, value: e.target.value };
                                    }
                                    return block;
                                });
                                const updatedGroups = ruleGroups.map((group, i) => {
                                    if (i === groupIndex) {
                                        return { ...group, logicBlocks: updatedBlocks };
                                    }
                                    return group;
                                });
                                setRuleGroups(updatedGroups);
                            }}
                            label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Value</span>}
                        >
                            {renderInputField()}
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row align="right">
                    <Button shape='round'
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                            removeLogicalBlock(groupIndex, blockIndex);
                        }} 
                    />
                </Row> */}
                <Row justify="end">
                    <Button shape='round'
                        icon={<DeleteOutlined />}
                        type='primary'
                        style={{ marginRight: 10 }}
                        danger
                        size='small'
                        onClick={() => {
                            removeLogicalBlockInGroup(groupIndex, blockIndex);
                        }} />
                </Row>
            </div>
        );
    }
    
    const renderLogicBlock = (index) => (
        <div key={index} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '10px', border: '1px solid #ccc' }}>
            <Row>
                <Col span={6}>
                    <Form.Item
                        name={`factName-${index}`}
                        onChange={(e) => {
                            const updatedBlocks = logicBlocks.map((block, i) => {
                                if (i === index) {
                                    return { ...block, factName: e.target.value };
                                }
                                return block;
                            });
                            setLogicBlocks(updatedBlocks);
                        }}
                        label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Fact Name</span>}>
                        <Input className="borderedSelect" bordered={false} style={{ width: "96%" }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name={`operator-${index}`}
                        label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Operator</span>}>
                        <Select
                            className="borderedSelect"
                            bordered={false}
                            style={{ fontSize: '12px', width: "96%" }}
                            onChange={(value) => {
                                const updatedBlocks = logicBlocks.map((block, i) => {
                                    if (i === index) {
                                        return { ...block, operator: value };
                                    }
                                    return block;
                                });
                                setLogicBlocks(updatedBlocks);
                            }}
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
                <Col span={6}>
                    <Form.Item
                        name={`dataType-${index}`}
                        label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Data Types</span>}>
                        <Select
                            className="borderedSelect"
                            bordered={false}
                            style={{ width: "96%" }}
                            onChange={(value) => {
                                const updatedBlocks = logicBlocks.map((block, i) => {
                                    if (i === index) {
                                        return { ...block, dataType: value };
                                    }
                                    return block;
                                });
                                setLogicBlocks(updatedBlocks);
                            }}
                        >
                            {dataTypes.map((item) => (
                                <Select.Option key={item.value} className="textStyleChild" style={{ fontSize: '12px' }} value={item.value}>
                                    {item.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name={`value-${index}`}
                        onChange={(e) => {
                            const updatedBlocks = logicBlocks.map((block, i) => {
                                if (i === index) {
                                    return { ...block, value: e.target.value };
                                }
                                return block;
                            });
                            setLogicBlocks(updatedBlocks);
                        }}
                        label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Value</span>}>
                        {renderInputField()}
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="end">
                <Button shape='round'
                    icon={<DeleteOutlined />}
                    type='primary'
                    style={{marginRight: 10}}
                    danger
                    size='small'
                    onClick={() => {
                        removeLogicalBlock(index);
                    }} />
            </Row>
        </div>
    );
    
    
    
    
  
    return (
      <div style={{ padding: '0 50px', backgroundColor: 'white', borderRadius: '10px' }}>  
      <pre>
        {JSON.stringify(logicBlocks, null, 2)}
      </pre>

        <pre>
            {JSON.stringify(ruleGroups, null, 2)}
        </pre>
            <div style={{ padding: '20px', backgroundColor: '#F5F8EA', borderRadius: '10px' }}>
                <Form layout="vertical">
                    <Row>
                        <Col span={12}>
                            <Form.Item label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Project Name</span>}>
                                <Select className="borderedSelect" bordered={false} style={{ width: "96%" }}>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="projectAlpha">
                                        Alpha Project
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="projectBeta">
                                        Beta Project
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="projectGamma">
                                        Gamma Project
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="projectDelta">
                                        Delta Project
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Section Name</span>}>
                                <Select className="borderedSelect" bordered={false} style={{ width: "96%" }}>
                                    <Select.Option className="textStyle-small" style={{ fontSize: '12px' }} value="sectionAlpha">
                                        Alpha Section
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="sectionBeta">
                                        Beta Section
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="sectionGamma">
                                        Gamma Section
                                    </Select.Option>
                                    <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="sectionDelta">
                                        Delta Section
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Define Rule Name</span>}>
                                <Input className="borderedSelect" bordered={false} style={{ width: "96%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<span className="textStyleChild" style={{ fontSize: '12px' }}>Rule Description</span>}>
                                <Input className="borderedSelect" bordered={false} style={{ width: "96%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Item>
                            <Button type="primary" className="textStyle-small" style={{ marginBottom: '10px', backgroundColor: "#00B96B", borderColor: "#00B96B" }} onClick={addLogicBlock}>
                                Add Logic Block
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ marginLeft: '10px' }}>
                            <Button type="primary" className="textStyle-small" style={{ marginBottom: '10px', backgroundColor: "#00B96B", borderColor: "#00B96B" }} onClick={addRuleGroup}>
                                Add Rule Group
                            </Button>
                        </Form.Item>
                        <Form.Item style={{ marginLeft: '10px' }}>
                            <Select className="borderedSelect" bordered={false} style={{ width: "200px", fontSize: '10px' }} placeholder="Rule Combinator">
                                <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="all">
                                    All (AND)
                                </Select.Option>
                                <Select.Option className="textStyleChild" style={{ fontSize: '12px' }} value="any">
                                    Any (OR)
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Row>
                    {logicBlocks.map((_, index) => renderLogicBlock(index))}

                    {
                        ruleGroups.length !== 0 ? ruleGroups.map((_, index) => renderRuleGroup(index)) : null
                    }
                </Form>
            </div>
      </div>
    );
  };
  
  export default RuleEngine;
  
