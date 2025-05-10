<template>
  <div class="app-container">
    <el-tabs v-model="status" type="card" @tab-click="handleOrder">
      <el-tab-pane name="-9">
        <span slot="label"><i class="el-icon-s-order"></i> 全部订单</span>
      </el-tab-pane>
      <el-tab-pane name="0">
        <span slot="label"><i class="el-icon-bank-card"></i> 未支付</span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-refrigerator"></i> 未发货</span>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label"><i class="el-icon-truck"></i> 待收货</span>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label"><i class="el-icon-document"></i> 待评价</span>
      </el-tab-pane>
      <el-tab-pane name="4">
        <span slot="label"><i class="el-icon-circle-check"></i> 交易完成</span>
      </el-tab-pane>
    </el-tabs>

    <!-- 搜索 -->
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="输入订单号/用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button type="danger" class="filter-item" size="mini" icon="el-icon-refresh" @click="toQuery">刷新</el-button>
    </div>

    <!-- 订单数据统计 -->
    <div class="order-caculate">
      <a class="caculate-title">订单数 : <span class="caculate-num">3</span></a>
      <a class="caculate-title">商品数 : <span class="caculate-num">3</span></a>
      <a class="caculate-title">订单金额 : <span class="caculate-num">21297.00</span></a>
      <a class="caculate-title">客户数 : <span class="caculate-num">3</span></a>
    </div>

    <!-- 表格渲染 -->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="orderNo" width="150" label="订单号" />
      <el-table-column prop="realName" label="用户姓名" />
      <el-table-column prop="userPhone" label="用户电话" />
      <el-table-column prop="productName" width="200" label="商品信息" />
      <el-table-column prop="payPrice" label="实际支付" />
      <el-table-column prop="statusStr" label="订单状态" />
      <el-table-column prop="createTime" width="160" label="创建时间" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === 1" size="mini" type="success" @click="ship(scope.row)">发货</el-button>
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

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="50%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ currentOrder.realName }}</el-descriptions-item>
        <el-descriptions-item label="客户电话">{{ currentOrder.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="商品信息">{{ currentOrder.productName }}</el-descriptions-item>
        <el-descriptions-item label="支付金额">{{ currentOrder.payPrice }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ currentOrder.payTime }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ currentOrder.statusStr }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog title="订单发货" :visible.sync="shipDialogVisible" width="40%">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="快递公司">
          <el-select v-model="shipForm.expressCompany" placeholder="请选择快递公司">
            <el-option label="顺丰速运" value="SF"></el-option>
            <el-option label="中通快递" value="ZTO"></el-option>
            <el-option label="圆通速递" value="YTO"></el-option>
            <el-option label="韵达速递" value="YD"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shipForm.expressNo" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmShip">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, shipOrder } from '@/api/shop/order'

export default {
  name: 'Order',
  data() {
    return {
      loading: false,
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      status: '-9',
      query: {
        value: '',
        type: ''
      },
      dialogVisible: false,
      shipDialogVisible: false,
      currentOrder: {},
      shipForm: {
        id: null,
        expressCompany: '',
        expressNo: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getOrders({
        page: this.page - 1,
        size: this.pageSize,
        status: this.status === '-9' ? '' : this.status,
        value: this.query.value
      }).then(res => {
        this.data = res.data.content
        this.total = res.data.totalElements
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleOrder() {
      this.page = 1
      this.getList()
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
    detail(row) {
      this.currentOrder = row
      this.dialogVisible = true
    },
    ship(row) {
      this.shipForm.id = row.id
      this.shipDialogVisible = true
    },
    confirmShip() {
      if (!this.shipForm.expressCompany) {
        this.$message.error('请选择快递公司')
        return
      }
      if (!this.shipForm.expressNo) {
        this.$message.error('请输入快递单号')
        return
      }
      
      shipOrder(this.shipForm).then(() => {
        this.$message.success('发货成功')
        this.shipDialogVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style scoped>
.filter-item {
  margin: 10px 0;
}
.order-caculate {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
}
.caculate-title {
  margin-right: 20px;
  color: #606266;
}
.caculate-num {
  font-weight: bold;
  color: #409EFF;
}
.pagination-container {
  margin-top: 15px;
  text-align: right;
}
</style>
