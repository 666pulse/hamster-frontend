<template>
    <div>
      <div class="flex justify-between mb-[25px]">
        <div class="text-[24px] font-bold">Internet Computer</div>

      </div>
      <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
        <div class="flex justify-between">
          <div class="titleLft">Overview
            <span class="loading" v-if="loading"><a-spin :indicator="indicator" /></span>
          </div>
          <a-button type="primary" @click="handleBuy" class="rhtBtn">Buy Cycles</a-button>
        </div>

        <div class="ethereum-container flex justify-between">
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">{{canister_over}}</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Canisters.png" alt="">
              <span>Canisters</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">{{pro_over}}</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Projects.png" alt="">
              <span>Projects</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">{{cycles_over}} T</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Cycles.png" alt="">
              <span>Cycles</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">{{icp_over}}</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/ICPs.png" alt="">
              <span>ICPs</span>
            </dd>
          </dl>
        </div>

      </div>
      <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
        <div class="flex justify-between mt30">
          <div class="titleLft">Canisters</div>
          <a-button type="primary" @click="handleAdd" class="rhtBtn">Add Canister</a-button>
        </div>
        <a-table :dataSource="nodeListData" :columns="nodeColumns" :pagination="pagination" style="width:100%">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="goDetail(record.canisterId)">Detail</a-button>
              <a-button type="link" @click="addCycles(record.canisterId,record.cycles)">Add Cycles</a-button>
            </template>
          </template>
        </a-table>
      </div>

      <CustomMsg v-if="showMsg" :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam" @handleCancel="showMsg = false" @showBuyCycle="showBuyCycle = true"></CustomMsg>

      <AddCycles v-if="showAddCycle" :visible="showAddCycle" :canisterId="canisterId" :cycles="cycles" @handleCancel="cancelAddCycle" @showBuyCycles="showBuyCycle=true" @showBuyCycleMsg="showBuyCycleMsg" @refreshCanister="refreshCanister"  :userId="accountId"></AddCycles>
      <BuyCycles v-if="showBuyCycle" :visible="showBuyCycle" @handleCancel="refresh" :key="Math.random()" :userId="accountId"></BuyCycles>
      <AddCanister v-if="showAdd" :visible="showAdd" @handleCancel="showAdd = false" @refreshCanister="refreshCanister"></AddCanister>
      <DeployIC v-if="accountIdFlag" :visible="showDeployIC" @CancelDeployIC="CancelDeployIC" @showDfxFn="showDfxFn" :detailId="accountId" :accountIdFlag="accountIdFlag" :walletIdFlag="walletIdFlag"/>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref,watchEffect } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { NodeStatusEnum } from "@/enums/statusEnum";
import { apiGetNodeList } from "@/apis/node";
import BuyCycles from "@/views/projects/projectsListDetails/components/BuyCycles.vue";
import AddCanister from "@/views/chainLink/icp/addCanister.vue";
import DeployIC from "@/views/projects/projectsList/components/DeployIC.vue";
import {apiCheckDfx, apiCreateICPIdentity, apiIcpAccount} from "@/apis/canister";
import {getCanisterList, getCanisterOverview} from "@/apis/icp";
import AddCycles from "@/views/projects/projectsListDetails/components/AddCycles.vue";
import CustomMsg from "@/components/CustomMsg.vue";
import {getUserInfo} from "@/apis/login";
import { LoadingOutlined } from '@ant-design/icons-vue';

const loading = ref(false);

import { h } from 'vue';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '20px',
  },
  spin: true,
});


const canister_over = ref(0);
const pro_over = ref(0);
const cycles_over = ref(0);
const icp_over = ref(0);

const showBuyCycle = ref(false);
const showAdd = ref(false);
const showDeployIC = ref(false);
const accountIdFlag = ref()
const walletIdFlag = ref()
const showAddCycle = ref(false);
const showMsg = ref(false);
const canisterId = ref("");
const cycles = ref("");
const msgType = ref('byCycles');
const msgParam = ref({});
const showDFX = ref(false);
const accountId = ref("");

const router = useRouter();
const route = useRoute()
const nodeListData = ref([])
const nodeColumns = reactive([
  {
    title: 'Canister ID',
    dataIndex: 'canisterId',
    key: 'canisterId',
  },
  {
    title: 'Canister Name',
    dataIndex: 'canisterName',
    key: 'canisterName',
  },
  {
    title: 'Cycles',
    dataIndex: 'cycles',
    key: 'cycles',
    align: 'cycles',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
  },
  {
    title: 'Updated At',
    dataIndex: 'updateAt',
    key: 'updateAt',
  },
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
const getTableData = async(page:number = pagination.current, size:number = pagination.pageSize) => {


  try {
    const {data} = await getCanisterList({ page, size })

    pagination.total = data.total
    pagination.current = data.page
    pagination.pageSize = data.pageSize
    nodeListData.value = data.data

  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}
const goDetail = (id:number)=>{
  router.push(`/middleware/dashboard/icp/detail?canisterId=${id}&id=${accountId.value}`)
}

const handleBuy = () =>{
  showBuyCycle.value = true;
}
const handleAdd = () =>{
  showAdd.value = true;
}
const CancelDeployIC = () =>{
  showDeployIC.value = false;
}

const getAccount = async() =>{


  try {
    const { data } = await getUserInfo();
    const {id} = data;
    accountId.value = id;
    const res = await apiIcpAccount(id)
    accountIdFlag.value = res.data.accountIdFlag;
    walletIdFlag.value = res.data.walletIdFlag;



    if (!res.data.accountIdFlag || !res.data.walletIdFlag) {
      if (!res.data.accountIdFlag) {
        const res = await apiCreateICPIdentity(id)
      }
      showDeployIC.value = true
    }

  } catch (err: any) {
    console.error(err)
  }

}
const showDfxFn = () => {
  showDFX.value = true;
}

const refresh = () =>{
  showBuyCycle.value = false
  refreshCanister()
}

const refreshCanister = () =>{
  getTableData()
  getOverView()
}


const addCycles = (id:string,cy:string) =>{
  showAddCycle.value = true;
  canisterId.value = id;
  cycles.value = cy
}
const cancelAddCycle = () =>{
  showAddCycle.value = false;
  canisterId.value = '';
  cycles.value = ''
}

const showBuyCycleMsg = ()=>{
  showAddCycle.value = false
  showMsg.value = true
}

const truncateDecimals = (num:number, decimals:number) => {
  const re = new RegExp('(\\d+\\.\\d{' + decimals + '})(\\d)'),
      m = num.toString().match(re);
  return m ? parseFloat(m[1]) : num.valueOf();
}

const getOverView = async() =>{
  loading.value = true;
  try{
    let rt = await getCanisterOverview();

    const {canisters,projects,cycles,icps } = rt.data;
    console.log(canisters,projects,cycles,icps)
    canister_over.value = canisters;
    pro_over.value = projects;
   
    cycles_over.value =truncateDecimals(Number(cycles), 2);
    icp_over.value = Number(icps);
    loading.value = false;

  }catch (e) {
    console.error("getOverView",e)
  }


}



onMounted(() => {
  getAccount()
  getTableData();
  getOverView()

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
.titleLft{
  font-size: 16px;
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
.rhtBtn{
  min-width: 147px;
  min-height: 43px;
}
.mt30{
  margin-bottom: 30px;
  align-items: center;
}
</style>
