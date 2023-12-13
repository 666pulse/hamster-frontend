<template>
    <div>
      <div class="flex justify-between mb-[25px]">
        <div class="text-[24px] font-bold">Internet Computer</div>

      </div>
      <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] box30">
        <div class="flex justify-between">
          <div class="titleLft">Overview</div>
          <a-button type="primary" @click="handleBuy" class="rhtBtn">Buy Cycles</a-button>
        </div>

        <div class="ethereum-container flex justify-between">
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">5</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Canisters.png" alt="">
              <span>Canisters</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">1</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Projects.png" alt="">
              <span>Projects</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">0.30 T</dt>
            <dd class="dark:text-[#8A8A8A] text-[#73706E]">
              <img src="../../../assets/images/Cycles.png" alt="">
              <span>Cycles</span>
            </dd>
          </dl>
          <dl>
            <dt class="number text-[#151210] dark:text-[#FFFFFF]">0.0001</dt>
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
              <a-button type="link" @click="goNodeDetail(record.id)">Detail</a-button>
            </template>
          </template>
        </a-table>
      </div>

      <BuyCycles v-if="showBuyCycle" :visible="showBuyCycle" @handleCancel="showBuyCycle = false"></BuyCycles>
      <AddCanister v-if="showAdd" :visible="showAdd" @handleCancel="showAdd = false"></AddCanister>
      <DeployIC v-if="accountIdFlag" :visible="showDeployIC" @CancelDeployIC="CancelDeployIC" @showDfxFn="showDfxFn" :detailId="id" :accountIdFlag="accountIdFlag" :walletIdFlag="walletIdFlag"/>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { NodeStatusEnum } from "@/enums/statusEnum";
import { apiGetNodeList } from "@/apis/node";
import BuyCycles from "@/views/projects/projectsListDetails/components/BuyCycles.vue";
import AddCanister from "@/views/chainLink/icp/addCanister.vue";
import DeployIC from "@/views/projects/projectsList/components/DeployIC.vue";
import {apiIcpAccount} from "@/apis/canister";


const showBuyCycle = ref(false);
const showAdd = ref(false);
const showDeployIC = ref(false);
const accountIdFlag = ref()

const router = useRouter();
const route = useRoute()
const nodeListData = ref([])
const nodeColumns = reactive([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    customRender: ({ index }:any) => index+1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Chain',
    dataIndex: 'chainProtocol',
    key: 'chainProtocol',
    align: 'chainProtocol',
  },
  {
    title: 'Node Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => `${NodeStatusEnum[text]}`,
  },
  {
    title: 'Public IP',
    dataIndex: 'publicIp',
    key: 'publicIp',
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
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
    const { data } = await apiGetNodeList({ page, size })

    pagination.total = data.total
    pagination.current = data.page
    pagination.pageSize = data.pageSize
    nodeListData.value = data.data

  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}
const goNodeDetail = (id:number)=>{
  router.push(`/middleware/dashboard/node/detail?id=${id}`)
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
  let id = "fdasfsaf"
  const res = await apiIcpAccount(id)
  accountIdFlag.value = res.data.accountIdFlag
}

onMounted(() => {
  getTableData();
  getAccount()
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
