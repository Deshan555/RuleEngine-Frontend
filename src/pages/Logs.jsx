import React, { useState } from 'react';
import { Table, Button, Form, Select, Input, DatePicker, TimePicker, Row, Col, Modal, message } from 'antd';
import { DeleteOutlined, CommentOutlined, MessageOutlined, MailOutlined, WechatWorkOutlined } from '@ant-design/icons';
import '../styles/style.css';

const Logs = () => {
  const [facts, setFacts] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);

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
      </Modal>
    </div>
  )
};

export default Logs;
