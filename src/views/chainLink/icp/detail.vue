<template>
  <div>
    <div class="flex justify-between mb-[25px]">
      <div class="text-[24px] font-bold">Internet Computer</div>

    </div>
    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
      <div class="flex justify-between">
        <div>
          <div class="titleLft">Overview <span><a-spin :indicator="indicator" v-if="loadingAll" /></span></div>
          <div class="infoBox">
              <dl>
                <dt>Canister ID:</dt>
                <dd>{{InfoData?.canisterId}}</dd>
              </dl>
              <dl>
                <dt>Canister Name:</dt>
                <dd>{{InfoData?.canisterName}}</dd>
              </dl>
              <dl>
                <dt>Project:</dt>
                <dd>{{InfoData?.project}}</dd>
              </dl>
              <dl>
                <dt>Cycles:</dt>
                <dd>{{InfoData?.cycles}} T</dd>
              </dl>
              <dl>
                <dt>Status:</dt>
                <dd>
                  <img src="@/assets/icons/Running-1.svg" alt="">
                  <span>{{status}}</span>
                  <span v-if="!loading" @click="changeStatus(status)" class="linkBox">{{status ==="Running"?"Stop":"Running" }}</span>
                  <span class="loading" v-if="loading"><a-spin :indicator="indicator" /></span>
                </dd>
              </dl>
              <dl>
                <dt>Memory Size:</dt>
                <dd>{{InfoData?.moduleSize}} MB</dd>
              </dl>
            <dl>
                <dt>Module Hash:</dt>
                <dd>{{AddressFormate(InfoData?.moduleHash)}}</dd>
              </dl>
              <dl>
                <dt>Last updated at:</dt>
                <dd>{{InfoData?.updateAt}}</dd>
              </dl>
          </div>
        </div>
        <div class="rhtTop">
          <a-button ghost  class="rhtBtn" @click="handleInstallShow">Install</a-button>
          <a-button type="primary" @click="handleAdd" class="rhtBtn">Add Cycles</a-button>
        </div>

      </div>



    </div>
    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
      <div class="flex justify-between mt30">
        <div class="titleLft">Controllers</div>
        <a-button type="primary" @click="handleController" class="rhtBtn">Add Controllers</a-button>
      </div>
      <a-table :dataSource="nodeListData" :columns="nodeColumns" :pagination="pagination" style="width:100%">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="goDelete(record)">Delete</a-button>
          </template>
        </template>
      </a-table>

    </div>

    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
      <div class="flex justify-between mt30">
        <div class="titleLft">Daily Consumption</div>
      </div>
      <a-table :dataSource="csList" :columns="csColumns" :pagination="paginationCs" style="width:100%">
        <template #bodyCell="{ column, record }"></template>
      </a-table>
    </div>
    <AddCycles v-if="showAddCycle" :visible="showAddCycle" :canisterId="canisterId" :cycles="InfoData?.cycles" @handleCancel="cancelAddCycle" @showBuyCycles="showBuyCycle=true" @showBuyCycleMsg="showBuyCycleMsg" @refreshCanister="refreshCanister" :userId="$route.query.id"></AddCycles>
    <BuyCycles v-if="showBuyCycle" :visible="showBuyCycle" @handleCancel="showBuyCycle = false" :userId="$route.query.id"></BuyCycles>
    <Install v-if="showInstall" :visible="showInstall" @handleCancel="showInstall = false" :canisterId="canisterId"></Install>
    <AddControllers v-if="showAddControllers" :canisterId="canisterId" :visible="showAddControllers" @handleCancel="showAddControllers = false" @refreshCanister="refreshCanister"></AddControllers>
    <DeleteTips v-if="deleteTips" :visible="deleteTips" @handleCancel="deleteTips = false" :type="type" :canisterId="canisterId" :controllerId="controllerId" @refreshCanister="refreshCanister"></DeleteTips>

  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";

import AddCycles from "@/views/projects/projectsListDetails/components/AddCycles.vue";
import BuyCycles from "@/views/projects/projectsListDetails/components/BuyCycles.vue";
import Install from "@/views/chainLink/icp/Install.vue";
import AddControllers from "@/views/chainLink/icp/addControllers.vue";
import DeleteTips from "@/views/chainLink/icp/deleteTips.vue";
import {getControllers, getCs, getIcpDetail, handleStatus} from "@/apis/icp";
import { LoadingOutlined } from '@ant-design/icons-vue';

const showBuyCycle = ref(false);
const showAddCycle = ref(false);
const showInstall = ref(false);
const deleteTips = ref(false);
const InfoData = ref({});
const status = ref("")
const type = ref("");
const loading = ref(false);
const loadingAll = ref(false);

import { h } from 'vue';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '16px',
  },
  spin: true,
});

const showAddControllers = ref(false);
const canisterId = ref();
const controllerId = ref();

const router = useRouter();
const showMsg = ref(false);
const route = useRoute()
const nodeListData = ref([])
const csList = ref([])
const csColumns = reactive([
  {
    title: 'Cycles',
    dataIndex: 'cycles',
    key: 'cycles',
  },
  {
    title: 'Module Hash',
    dataIndex: 'moduleHash',
    key: 'moduleHash',
  },
  {
    title: 'Updated At',
    dataIndex: 'updateAt',
    key: 'updateAt',
  },
])
const nodeColumns = reactive([
  {
    title: 'Canister ID',
    dataIndex: 'principalId',
    key: 'principalId',
  },
  // {
  //   title: 'Name',
  //   dataIndex: 'name',
  //   key: 'name',
  // },
  // {
  //   title: 'Chain',
  //   dataIndex: 'chainProtocol',
  //   key: 'chainProtocol',
  //   align: 'chainProtocol',
  // },
  // {
  //   title: 'Node Status',
  //   dataIndex: 'status',
  //   key: 'status',
  //   customRender: ({ text }) => `${NodeStatusEnum[text]}`,
  // },
  // {
  //   title: 'Public IP',
  //   dataIndex: 'publicIp',
  //   key: 'publicIp',
  // },
  // {
  //   title: 'Region',
  //   dataIndex: 'region',
  //   key: 'region',
  // },
  {
    title: 'Action',
    key: 'action',
  },
])
const pagination = reactive({
  // 分页配置器
  pageSize: 10, // 一页的数据限制
  current: 1, // 当前页
  total: 10, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['10', '20', '30'], // 指定每页可以显示多少条
  onShowSizeChange: (current: number, pagesize: number) => {

    // 改变 pageSize时的回调
    pagination.current = current;
    pagination.pageSize = pagesize;
    getTableData(current, pagesize)
  },
  onChange: (current: number) => {

    // 切换分页时的回调，
    pagination.current = current;
    getTableData(current, pagination.pageSize)
  },
});

const paginationCs = reactive({
  // 分页配置器
  pageSize: 10, // 一页的数据限制
  current: 1, // 当前页
  total: 10, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['10', '20', '30'], // 指定每页可以显示多少条
  onShowSizeChange: (current: number, pagesize: number) => {
    // 改变 pageSize时的回调
    paginationCs.current = current;
    paginationCs.pageSize = pagesize;
    getCsData(current, pagesize)
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    paginationCs.current = current;
    getCsData(current, paginationCs.pageSize)
  },
});

const getCsData = async(page:number = paginationCs.current, size:number = paginationCs.pageSize) => {


  try {
    const { data } = await getCs({ id:page, size },route.query.canisterId)
    console.log(data)

    paginationCs.total = data.total
    paginationCs.current = data.page
    paginationCs.pageSize = data.pageSize
    csList.value = data.data

  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}

const showBuyCycleMsg = ()=>{
  showAddCycle.value = false
  showMsg.value = true
}

const changeStatus = async(status:string) =>{
  const st = status !=="Running"? 1:2;
  loading.value = true;

  // 1: running,2: stopped
  try {
    const { data } = await handleStatus({Status:st,CanisterId:route.query.canisterId})
    console.log(data)


  } catch(err:any) {
    console.error('changeStatus:', err)
  }finally {
    getOverview()
  }
}

const handleAdd = () =>{
  showAddCycle.value = true;
}
const cancelAddCycle = () =>{
  showAddCycle.value = false;
}
const handleInstallShow = () =>{
  showInstall.value = true;
}
const handleController = () =>{
  showAddControllers.value = true;
}

const getOverview = async () =>{
  loadingAll.value = true;
  try {
    const { data } = await getIcpDetail(route.query.canisterId)
    InfoData.value = data;
    status.value = data.status;
    loading.value = false;
    loadingAll.value = false;
  } catch(err:any) {
    console.log('InfoData:', err)
  }
}

const AddressFormate = (address: string, ) => {
  if (!address) return '';

  const frontStr = address.substring(0, 10);

  const afterStr = address.substring(address.length -10, address.length);

  return `${frontStr}...${afterStr}`;
};

const getTableData = async(page:number = pagination.current, size:number = pagination.pageSize) => {


  try {
    const { data } = await getControllers({ page, size },route.query.canisterId)
    console.log(data)

    pagination.total = data.total
    pagination.current = data.page
    pagination.pageSize = data.pageSize
    nodeListData.value = data.data

  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}
const goDelete = (item:any)=>{
  deleteTips.value = true;
  type.value = pagination.total >1 ? "confirm":"del"
  controllerId.value = item.principalId;

}


const refreshCanister = ()=>{
  getTableData()
  getOverview();
  getCsData();
}
onMounted(() => {
  canisterId.value = route.query.canisterId;
  getTableData();
  getCsData();
  getOverview();


})
</script>
<style lang="less">
.ethereum-container {

@apply dark:bg-[#36322D];
  /* display: inline-block; */
  /* // height: 326px; */
  /* min-width: 400px; */
  padding: 30px;
  background: #F3F3F3;
  border-radius: 12px;
  /* margin: 10px; */
  border: 1px solid transparent;
  margin-top: 20px;
  dl{
    display: flex;
    flex-direction: column;
    width: 25%;
    align-items: center;
  }
  dd{
    display: flex;
    align-items: center;
    img{
      width: 16px;
      height: 16px;
    }
    span{
      padding-left: 5px;
    }
  }
}
.loading{
  margin-left: 10px;
}
.titleLft{
  font-size: 24px;
  font-weight: bold;
}
.number{
  font-size: 36px;
  font-weight: 400;
  font-family: NotoSans-Regular, NotoSans;
}
.box30{
  padding: 30px;
  margin-bottom: 30px;
}
.rhtTop{
  flex-shrink: 0;
}
.rhtBtn{
  min-width: 143px;
  min-height: 43px;
  margin-left: 20px;
}
.mt30{
  margin-bottom: 30px;
  align-items: center;
}
.infoBox{
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;

  dl{
    width: 50%;
  }
  dt{
    font-size: 14px;
    font-weight: 400;
    color: #73706E;
    line-height: 19px;
  }
  dd{
    font-size: 16px;
    line-height: 22px;
    margin-top: 5px;

    font-weight: 500;
    display: flex;
    align-items: center;
    img{
      width: 18px;
      margin-right: 5px;
    }
  }
  .linkBox{
    font-size: 16px;
    font-weight: 400;
    color: #E2B578;
    line-height: 22px;
    margin-left: 20px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
