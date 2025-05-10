import React, { useState } from 'react';
import { Card, Typography, Cascader, Button, message, Divider, Row, Col, Space } from 'antd';
import { regionOptions } from '../data/regions';
import { HomeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface RegionValue {
  provinceCode?: string;
  provinceName?: string;
  cityCode?: string;
  cityName?: string;
  districtCode?: string;
  districtName?: string;
}

const RegionSelector: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [regionNames, setRegionNames] = useState<RegionValue>({});

  // 处理区域选择变化
  const handleRegionChange = (value: string[], selectedOptions: any[]) => {
    setSelectedRegion(value);
    
    // 获取选中的省市区名称
    const names: RegionValue = {};
    
    if (selectedOptions.length > 0) {
      names.provinceCode = selectedOptions[0].value;
      names.provinceName = selectedOptions[0].label;
    }
    
    if (selectedOptions.length > 1) {
      names.cityCode = selectedOptions[1].value;
      names.cityName = selectedOptions[1].label;
    }
    
    if (selectedOptions.length > 2) {
      names.districtCode = selectedOptions[2].value;
      names.districtName = selectedOptions[2].label;
    }
    
    setRegionNames(names);
  };

  const handleSubmit = () => {
    if (selectedRegion.length < 3) {
      message.warning('请选择完整的省/市/区');
      return;
    }
    
    message.success('选择成功');
    console.log('选中的区域:', selectedRegion);
    console.log('选中的区域名称:', regionNames);
  };

  return (
    <div style={{ padding: '30px 50px' }}>
      <Title level={2}>
        <HomeOutlined /> 地区选择器演示
      </Title>
      <Paragraph type="secondary">
        本页面演示了完整的中国省市区级联选择器功能，包含全国所有省份、城市和区县数据。
      </Paragraph>
      <Divider />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="地区选择" bordered={false}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>选择您所在的地区：</Text>
            </div>
            
            <Cascader
              options={regionOptions}
              placeholder="请选择省/市/区"
              onChange={handleRegionChange}
              expandTrigger="hover"
              style={{ width: '100%', marginBottom: 20 }}
            />
            
            <Button type="primary" onClick={handleSubmit} disabled={selectedRegion.length < 3}>
              确认选择
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="选择结果" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">省份代码：</Text>
                <Text strong>{regionNames.provinceCode || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">省份名称：</Text>
                <Text strong>{regionNames.provinceName || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">城市代码：</Text>
                <Text strong>{regionNames.cityCode || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">城市名称：</Text>
                <Text strong>{regionNames.cityName || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">区县代码：</Text>
                <Text strong>{regionNames.districtCode || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">区县名称：</Text>
                <Text strong>{regionNames.districtName || '-'}</Text>
              </div>
              <div>
                <Text type="secondary">完整地址：</Text>
                <Text strong>{`${regionNames.provinceName || ''} ${regionNames.cityName || ''} ${regionNames.districtName || ''}`}</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Divider />
      
      <Paragraph>
        <Text type="secondary">
          说明：此组件可以在个人中心、收货地址管理、订单填写等页面复用，提供一致的用户体验。
        </Text>
      </Paragraph>
    </div>
  );
};

export default RegionSelector; 