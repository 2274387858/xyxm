<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div>
          <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />
        </div>

        <!-- 航班头部布局 -->
        <div>
          <FlightsListHead />
        </div>

        <!-- 航班信息 -->
        <div>
          <flightsItem v-for="(item, index) in dataList" :key="index" :data="item" />

          <!-- 分页 -->
          <el-row type="flex" justify="center" style="margin-top:10px;">
            <!-- size-change：切换条数时候触发 -->
            <!-- current-change：选择页数时候触发 -->
            <!-- current-page: 当前页数 -->
            <!-- page-size：当前条数 -->
            <!-- total：总条数 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              v-if="flightsData.flights.length > 0"
            ></el-pagination>
          </el-row>
        </div>
        <div class="errTs" v-if="flightsData.flights.length === 0 && isShow">!暂无航班信息</div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside/>
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";
import moment from "moment";

export default {
  data() {
    return {
      flightsData: {
        flights: [],
        info: {},
        options: {}
      }, // 航班总数据
      // 克隆一份航班总数据，传给子组件，这个数据不会变化，
      // 如果是一份航班总数据的话，子组件更改数据返回的时候会更改这个航班总数据
      // ，再操作的时候数据就提供不了了
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      }, // 航班总数据

      pageIndex: 1, // 当前页数
      pageSize: 5, // 显示条数
      isShow: false, //判断是否正在加载中
      total: 0
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  computed: {
    dataList() {
      const arr = this.flightsData.flights.slice(
        // pageIndex 当前页数
        // pagesize 显示条数
        // 记这条分页方法
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  watch:{
    $route(){
      this.getData()
    }
  },
  methods: {
    setDataList(arr) {
      this.flightsData.flights = arr;
      this.total = arr.length;
      this.pageIndex = 1;
    },
    // 获取航班总数据
    getData() {
      this.$axios({
        url: `airs`,
        params: this.$route.query // 来自URL的5个参数
      }).then(res => {
        this.flightsData = res.data;
        this.cacheFlightsData = {...res.data};
        this.total = this.flightsData.total;
        this.isShow = true;
        // this.dataList = this.flightsData.flights.slice(0, this.pageSize);
      });
    },
    // 切换条数时触发
    handleSizeChange(value) {
      // console.log(value)

      this.pageSize = value;
      //       // 记这条
      // this.dataList = this.flightsData.flights.slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageIndex * this.pageSize
      // );
    },

    // 切换页数时触发
    handleCurrentChange(value) {
      // console.log(value)
      this.pageIndex = value;
      // this.dataList = this.flightsData.flights.slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageIndex * this.pageSize
      // );
    }
  },

  mounted() {
    this.getData();
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
.errTs {
  font-size: 30px;
  color: red;
  text-align: center;
}
</style>