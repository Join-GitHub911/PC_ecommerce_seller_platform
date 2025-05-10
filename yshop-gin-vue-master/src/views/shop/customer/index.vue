<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="输入客户姓名/手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.level" clearable placeholder="客户等级" class="filter-item" style="width: 130px">
        <el-option label="普通会员" value="0" />
        <el-option label="银卡会员" value="1" />
        <el-option label="金卡会员" value="2" />
        <el-option label="钻石会员" value="3" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button type="danger" class="filter-item" size="mini" icon="el-icon-refresh" @click="toQuery">刷新</el-button>
    </div>

    <!-- 客户数据统计 -->
    <div class="customer-stats">
      <a class="stats-item">客户总数: <span class="stats-num">{{ totalCustomers }}</span></a>
      <a class="stats-item">本月新增: <span class="stats-num">{{ newCustomers }}</span></a>
      <a class="stats-item">消费总额: <span class="stats-num">{{ totalSpent }}</span></a>
      <a class="stats-item">平均客单价: <span class="stats-num">{{ avgOrder }}</span></a>
    </div>

    <!-- 表格渲染 -->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="客户姓名" />
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="levelText" label="会员等级">
        <template slot-scope="scope">
          <el-tag :type="scope.row.levelType">{{ scope.row.levelText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderCount" label="订单数" />
      <el-table-column prop="totalSpent" label="消费金额" />
      <el-table-column prop="lastOrderTime" label="最近下单" width="160" />
      <el-table-column prop="createTime" label="注册时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="viewDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="success" @click="editCustomer(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>

    <!-- 客户详情对话框 -->
    <el-dialog title="客户详情" :visible.sync="dialogVisible" width="50%">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户ID">{{ currentCustomer.id }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ currentCustomer.name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ currentCustomer.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentCustomer.email }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">{{ currentCustomer.levelText }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ currentCustomer.createTime }}</el-descriptions-item>
            <el-descriptions-item label="订单数">{{ currentCustomer.orderCount }}</el-descriptions-item>
            <el-descriptions-item label="消费金额">{{ currentCustomer.totalSpent }}</el-descriptions-item>
            <el-descriptions-item label="最近下单">{{ currentCustomer.lastOrderTime }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ currentCustomer.address }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="消费记录" name="orders">
          <el-table :data="customerOrders" size="small" style="width: 100%;">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="createTime" label="下单时间" width="180" />
            <el-table-column prop="payPrice" label="支付金额" />
            <el-table-column prop="statusStr" label="订单状态" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="viewOrder(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑客户对话框 -->
    <el-dialog title="编辑客户信息" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="客户姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="editForm.level" placeholder="请选择会员等级">
            <el-option label="普通会员" value="0"></el-option>
            <el-option label="银卡会员" value="1"></el-option>
            <el-option label="金卡会员" value="2"></el-option>
            <el-option label="钻石会员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="editForm.address" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomers, getCustomerDetail, updateCustomer } from '@/api/shop/customer'

export default {
  name: 'Customer',
  data() {
    return {
      loading: false,
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalCustomers: 0,
      newCustomers: 0,
      totalSpent: '0.00',
      avgOrder: '0.00',
      query: {
        value: '',
        level: ''
      },
      dialogVisible: false,
      editDialogVisible: false,
      activeTab: 'basic',
      currentCustomer: {},
      customerOrders: [],
      editForm: {
        id: null,
        name: '',
        phone: '',
        email: '',
        level: '',
        address: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getCustomers({
        page: this.page - 1,
        size: this.pageSize,
        level: this.query.level,
        value: this.query.value
      }).then(res => {
        this.data = res.data.content
        this.total = res.data.totalElements
        this.totalCustomers = res.data.totalCustomers || 0
        this.newCustomers = res.data.newCustomers || 0
        this.totalSpent = res.data.totalSpent || '0.00'
        this.avgOrder = res.data.avgOrder || '0.00'
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    toQuery() {
      this.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    viewDetail(row) {
      this.activeTab = 'basic'
      this.currentCustomer = row
      getCustomerDetail(row.id).then(res => {
        if (res.data) {
          this.currentCustomer = { ...this.currentCustomer, ...res.data }
          this.customerOrders = res.data.orders || []
        }
        this.dialogVisible = true
      })
    },
    editCustomer(row) {
      this.editForm = {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        level: row.level.toString(),
        address: row.address || ''
      }
      this.editDialogVisible = true
    },
    saveCustomer() {
      updateCustomer(this.editForm).then(() => {
        this.$message.success('客户信息更新成功')
        this.editDialogVisible = false
        this.getList()
      }).catch(() => {
        this.$message.error('客户信息更新失败')
      })
    },
    viewOrder(order) {
      // 跳转到订单详情页
      this.$router.push({ path: `/shop/order/detail/${order.id}` })
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin: 10px 5px;
}
.customer-stats {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
}
.stats-item {
  margin-right: 20px;
  color: #606266;
  font-size: 14px;
}
.stats-num {
  font-weight: bold;
  color: #409EFF;
  font-size: 16px;
}
.pagination-container {
  margin-top: 15px;
  text-align: right;
}
</style> 