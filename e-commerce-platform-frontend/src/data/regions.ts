/**
 * 中国省市区级联数据
 */

export interface RegionOption {
  value: string;
  label: string;
  children?: RegionOption[];
}

// 中国省份数据（按行政区划代码排序）
export const provinces: RegionOption[] = [
  { value: '11', label: '北京市' },
  { value: '12', label: '天津市' },
  { value: '13', label: '河北省' },
  { value: '14', label: '山西省' },
  { value: '15', label: '内蒙古自治区' },
  { value: '21', label: '辽宁省' },
  { value: '22', label: '吉林省' },
  { value: '23', label: '黑龙江省' },
  { value: '31', label: '上海市' },
  { value: '32', label: '江苏省' },
  { value: '33', label: '浙江省' },
  { value: '34', label: '安徽省' },
  { value: '35', label: '福建省' },
  { value: '36', label: '江西省' },
  { value: '37', label: '山东省' },
  { value: '41', label: '河南省' },
  { value: '42', label: '湖北省' },
  { value: '43', label: '湖南省' },
  { value: '44', label: '广东省' },
  { value: '45', label: '广西壮族自治区' },
  { value: '46', label: '海南省' },
  { value: '50', label: '重庆市' },
  { value: '51', label: '四川省' },
  { value: '52', label: '贵州省' },
  { value: '53', label: '云南省' },
  { value: '54', label: '西藏自治区' },
  { value: '61', label: '陕西省' },
  { value: '62', label: '甘肃省' },
  { value: '63', label: '青海省' },
  { value: '64', label: '宁夏回族自治区' },
  { value: '65', label: '新疆维吾尔自治区' },
  { value: '71', label: '台湾省' },
  { value: '81', label: '香港特别行政区' },
  { value: '82', label: '澳门特别行政区' }
];

// 城市数据
export const cities: Record<string, RegionOption[]> = {
  // 北京市
  '11': [
    { value: '1101', label: '北京市' }
  ],
  // 天津市
  '12': [
    { value: '1201', label: '天津市' }
  ],
  // 河北省
  '13': [
    { value: '1301', label: '石家庄市' },
    { value: '1302', label: '唐山市' },
    { value: '1303', label: '秦皇岛市' },
    { value: '1304', label: '邯郸市' },
    { value: '1305', label: '邢台市' },
    { value: '1306', label: '保定市' },
    { value: '1307', label: '张家口市' },
    { value: '1308', label: '承德市' },
    { value: '1309', label: '沧州市' },
    { value: '1310', label: '廊坊市' },
    { value: '1311', label: '衡水市' }
  ],
  // 山西省
  '14': [
    { value: '1401', label: '太原市' },
    { value: '1402', label: '大同市' },
    { value: '1403', label: '阳泉市' },
    { value: '1404', label: '长治市' },
    { value: '1405', label: '晋城市' },
    { value: '1406', label: '朔州市' },
    { value: '1407', label: '晋中市' },
    { value: '1408', label: '运城市' },
    { value: '1409', label: '忻州市' },
    { value: '1410', label: '临汾市' },
    { value: '1411', label: '吕梁市' }
  ],
  // 内蒙古自治区
  '15': [
    { value: '1501', label: '呼和浩特市' },
    { value: '1502', label: '包头市' },
    { value: '1503', label: '乌海市' },
    { value: '1504', label: '赤峰市' },
    { value: '1505', label: '通辽市' },
    { value: '1506', label: '鄂尔多斯市' },
    { value: '1507', label: '呼伦贝尔市' },
    { value: '1508', label: '巴彦淖尔市' },
    { value: '1509', label: '乌兰察布市' },
    { value: '1522', label: '兴安盟' },
    { value: '1525', label: '锡林郭勒盟' },
    { value: '1529', label: '阿拉善盟' }
  ],
  // 辽宁省
  '21': [
    { value: '2101', label: '沈阳市' },
    { value: '2102', label: '大连市' },
    { value: '2103', label: '鞍山市' },
    { value: '2104', label: '抚顺市' },
    { value: '2105', label: '本溪市' },
    { value: '2106', label: '丹东市' },
    { value: '2107', label: '锦州市' },
    { value: '2108', label: '营口市' },
    { value: '2109', label: '阜新市' },
    { value: '2110', label: '辽阳市' },
    { value: '2111', label: '盘锦市' },
    { value: '2112', label: '铁岭市' },
    { value: '2113', label: '朝阳市' },
    { value: '2114', label: '葫芦岛市' }
  ],
  // 吉林省
  '22': [
    { value: '2201', label: '长春市' },
    { value: '2202', label: '吉林市' },
    { value: '2203', label: '四平市' },
    { value: '2204', label: '辽源市' },
    { value: '2205', label: '通化市' },
    { value: '2206', label: '白山市' },
    { value: '2207', label: '松原市' },
    { value: '2208', label: '白城市' },
    { value: '2224', label: '延边朝鲜族自治州' }
  ],
  // 黑龙江省
  '23': [
    { value: '2301', label: '哈尔滨市' },
    { value: '2302', label: '齐齐哈尔市' },
    { value: '2303', label: '鸡西市' },
    { value: '2304', label: '鹤岗市' },
    { value: '2305', label: '双鸭山市' },
    { value: '2306', label: '大庆市' },
    { value: '2307', label: '伊春市' },
    { value: '2308', label: '佳木斯市' },
    { value: '2309', label: '七台河市' },
    { value: '2310', label: '牡丹江市' },
    { value: '2311', label: '黑河市' },
    { value: '2312', label: '绥化市' },
    { value: '2327', label: '大兴安岭地区' }
  ],
  // 上海市
  '31': [
    { value: '3101', label: '上海市' }
  ],
  // 江苏省
  '32': [
    { value: '3201', label: '南京市' },
    { value: '3202', label: '无锡市' },
    { value: '3203', label: '徐州市' },
    { value: '3204', label: '常州市' },
    { value: '3205', label: '苏州市' },
    { value: '3206', label: '南通市' },
    { value: '3207', label: '连云港市' },
    { value: '3208', label: '淮安市' },
    { value: '3209', label: '盐城市' },
    { value: '3210', label: '扬州市' },
    { value: '3211', label: '镇江市' },
    { value: '3212', label: '泰州市' },
    { value: '3213', label: '宿迁市' }
  ],
  // 浙江省
  '33': [
    { value: '3301', label: '杭州市' },
    { value: '3302', label: '宁波市' },
    { value: '3303', label: '温州市' },
    { value: '3304', label: '嘉兴市' },
    { value: '3305', label: '湖州市' },
    { value: '3306', label: '绍兴市' },
    { value: '3307', label: '金华市' },
    { value: '3308', label: '衢州市' },
    { value: '3309', label: '舟山市' },
    { value: '3310', label: '台州市' },
    { value: '3311', label: '丽水市' }
  ],
  // 安徽省
  '34': [
    { value: '3401', label: '合肥市' },
    { value: '3402', label: '芜湖市' },
    { value: '3403', label: '蚌埠市' },
    { value: '3404', label: '淮南市' },
    { value: '3405', label: '马鞍山市' },
    { value: '3406', label: '淮北市' },
    { value: '3407', label: '铜陵市' },
    { value: '3408', label: '安庆市' },
    { value: '3410', label: '黄山市' },
    { value: '3411', label: '滁州市' },
    { value: '3412', label: '阜阳市' },
    { value: '3413', label: '宿州市' },
    { value: '3415', label: '六安市' },
    { value: '3416', label: '亳州市' },
    { value: '3417', label: '池州市' },
    { value: '3418', label: '宣城市' }
  ],
  // 福建省
  '35': [
    { value: '3501', label: '福州市' },
    { value: '3502', label: '厦门市' },
    { value: '3503', label: '莆田市' },
    { value: '3504', label: '三明市' },
    { value: '3505', label: '泉州市' },
    { value: '3506', label: '漳州市' },
    { value: '3507', label: '南平市' },
    { value: '3508', label: '龙岩市' },
    { value: '3509', label: '宁德市' }
  ],
  // 更多省市数据...
  // 广东省
  '44': [
    { value: '4401', label: '广州市' },
    { value: '4402', label: '韶关市' },
    { value: '4403', label: '深圳市' },
    { value: '4404', label: '珠海市' },
    { value: '4405', label: '汕头市' },
    { value: '4406', label: '佛山市' },
    { value: '4407', label: '江门市' },
    { value: '4408', label: '湛江市' },
    { value: '4409', label: '茂名市' },
    { value: '4412', label: '肇庆市' },
    { value: '4413', label: '惠州市' },
    { value: '4414', label: '梅州市' },
    { value: '4415', label: '汕尾市' },
    { value: '4416', label: '河源市' },
    { value: '4417', label: '阳江市' },
    { value: '4418', label: '清远市' },
    { value: '4419', label: '东莞市' },
    { value: '4420', label: '中山市' },
    { value: '4451', label: '潮州市' },
    { value: '4452', label: '揭阳市' },
    { value: '4453', label: '云浮市' }
  ],
  // 四川省
  '51': [
    { value: '5101', label: '成都市' },
    { value: '5103', label: '自贡市' },
    { value: '5104', label: '攀枝花市' },
    { value: '5105', label: '泸州市' },
    { value: '5106', label: '德阳市' },
    { value: '5107', label: '绵阳市' },
    { value: '5108', label: '广元市' },
    { value: '5109', label: '遂宁市' },
    { value: '5110', label: '内江市' },
    { value: '5111', label: '乐山市' },
    { value: '5113', label: '南充市' },
    { value: '5114', label: '眉山市' },
    { value: '5115', label: '宜宾市' },
    { value: '5116', label: '广安市' },
    { value: '5117', label: '达州市' },
    { value: '5118', label: '雅安市' },
    { value: '5119', label: '巴中市' },
    { value: '5120', label: '资阳市' },
    { value: '5132', label: '阿坝藏族羌族自治州' },
    { value: '5133', label: '甘孜藏族自治州' },
    { value: '5134', label: '凉山彝族自治州' }
  ]
};

// 区县数据
export const districts: Record<string, RegionOption[]> = {
  // 北京市
  '1101': [
    { value: '110101', label: '东城区' },
    { value: '110102', label: '西城区' },
    { value: '110105', label: '朝阳区' },
    { value: '110106', label: '丰台区' },
    { value: '110107', label: '石景山区' },
    { value: '110108', label: '海淀区' },
    { value: '110109', label: '门头沟区' },
    { value: '110111', label: '房山区' },
    { value: '110112', label: '通州区' },
    { value: '110113', label: '顺义区' },
    { value: '110114', label: '昌平区' },
    { value: '110115', label: '大兴区' },
    { value: '110116', label: '怀柔区' },
    { value: '110117', label: '平谷区' },
    { value: '110118', label: '密云区' },
    { value: '110119', label: '延庆区' }
  ],
  // 广州市
  '4401': [
    { value: '440103', label: '荔湾区' },
    { value: '440104', label: '越秀区' },
    { value: '440105', label: '海珠区' },
    { value: '440106', label: '天河区' },
    { value: '440111', label: '白云区' },
    { value: '440112', label: '黄埔区' },
    { value: '440113', label: '番禺区' },
    { value: '440114', label: '花都区' },
    { value: '440115', label: '南沙区' },
    { value: '440117', label: '从化区' },
    { value: '440118', label: '增城区' }
  ],
  // 深圳市
  '4403': [
    { value: '440303', label: '罗湖区' },
    { value: '440304', label: '福田区' },
    { value: '440305', label: '南山区' },
    { value: '440306', label: '宝安区' },
    { value: '440307', label: '龙岗区' },
    { value: '440308', label: '盐田区' },
    { value: '440309', label: '龙华区' },
    { value: '440310', label: '坪山区' },
    { value: '440311', label: '光明区' }
  ],
  // 成都市
  '5101': [
    { value: '510104', label: '锦江区' },
    { value: '510105', label: '青羊区' },
    { value: '510106', label: '金牛区' },
    { value: '510107', label: '武侯区' },
    { value: '510108', label: '成华区' },
    { value: '510112', label: '龙泉驿区' },
    { value: '510113', label: '青白江区' },
    { value: '510114', label: '新都区' },
    { value: '510115', label: '温江区' },
    { value: '510116', label: '双流区' },
    { value: '510117', label: '郫都区' },
    { value: '510121', label: '金堂县' },
    { value: '510129', label: '大邑县' },
    { value: '510131', label: '蒲江县' },
    { value: '510132', label: '新津县' },
    { value: '510181', label: '都江堰市' },
    { value: '510182', label: '彭州市' },
    { value: '510183', label: '邛崃市' },
    { value: '510184', label: '崇州市' },
    { value: '510185', label: '简阳市' }
  ],
  // 上海市
  '3101': [
    { value: '310101', label: '黄浦区' },
    { value: '310104', label: '徐汇区' },
    { value: '310105', label: '长宁区' },
    { value: '310106', label: '静安区' },
    { value: '310107', label: '普陀区' },
    { value: '310109', label: '虹口区' },
    { value: '310110', label: '杨浦区' },
    { value: '310112', label: '闵行区' },
    { value: '310113', label: '宝山区' },
    { value: '310114', label: '嘉定区' },
    { value: '310115', label: '浦东新区' },
    { value: '310116', label: '金山区' },
    { value: '310117', label: '松江区' },
    { value: '310118', label: '青浦区' },
    { value: '310120', label: '奉贤区' },
    { value: '310151', label: '崇明区' }
  ],
  // 杭州市
  '3301': [
    { value: '330102', label: '上城区' },
    { value: '330103', label: '下城区' },
    { value: '330104', label: '江干区' },
    { value: '330105', label: '拱墅区' },
    { value: '330106', label: '西湖区' },
    { value: '330108', label: '滨江区' },
    { value: '330109', label: '萧山区' },
    { value: '330110', label: '余杭区' },
    { value: '330111', label: '富阳区' },
    { value: '330112', label: '临安区' },
    { value: '330122', label: '桐庐县' },
    { value: '330127', label: '淳安县' },
    { value: '330182', label: '建德市' }
  ]
};

// 级联数据格式
export const regionOptions: RegionOption[] = provinces.map(province => {
  return {
    value: province.value,
    label: province.label,
    children: cities[province.value]?.map(city => {
      return {
        value: city.value,
        label: city.label,
        children: districts[city.value]?.map(district => {
          return {
            value: district.value,
            label: district.label
          };
        })
      };
    })
  };
});

export default regionOptions; 