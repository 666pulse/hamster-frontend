<template>
  <div class="dashboard dark:bg-[#1D1C1A] bg-[#FFFFFF]">
    <div class="font-bold text-[24px] mb-[8px]">My Middleware</div>
    <div class="grid grid-cols-3 gap-4 ">
      <div v-for="item in dashboardList" :key="item"
        class="border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] p-[24px] dark:bg-[#36322D] bg-[#ffffff] relative">
        <div class="text-[16px] font-bold mb-[16px]">{{ item }}</div>

        <div v-if="item === 'RPC' && rpcSer">
          <div class="box flex justify-between pb-[14px]">
            <div>{{ rpcSer }}</div>
            <div class="open-link-css cursor-pointer" @click="networkClick(rpcSer)">View</div>
          </div>
          <div class="flex justify-between w-full mt-[18px] cursor-pointer open-link-css">
            <span @click="goMiwaspaceTab('RPC')">Add service</span>
            <span @click="goRPC">View more</span>
          </div>
        </div>

        <div v-else-if="item === 'Internet Computer'">
          <div v-if="JSON.stringify(nodeInfo)=='{}'">
            <div class="text-center">
              <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
              <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
            </div>

            <div class="text-center mt-[12px] dark:text-[#8A8A8A] text-[#73706E]">The node has not been created yet</div>
            <div class="text-center mt-[10px] open-link-css cursor-pointer" @click="goMiwaspaceTab(item)">Add node</div>
          </div>
          <div v-else>
            <span class="open-link-css cursor-pointer node-view" @click="goNode(item)">View</span>
            <div class="text-center">
              <div class="text-[60px] text-[#E2B578]">{{ nodeInfo.nodes }}</div>
              <div class="text-[16px] mb-[16px]">Nodes</div>
            </div>
            <div class="flex justify-between border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6]">
              <div>
                <span class="mr-[10px] font-light">Synced</span>
                <span class="text-[18px]">{{ nodeInfo.synced }}</span>
              </div>
              <div>
                <span class="mr-[10px] font-light">Halted</span>
                <span class="text-[18px]">{{ nodeInfo.halted }}</span>
              </div>
            </div>
            <div class="text-center mt-[18px] open-link-css cursor-pointer" @click="goMiwaspaceTab(item)">Add Canister</div>
          </div>
        </div>
        <div v-else-if="isShowOracle && item === 'Oracle'">
          <div v-for="val in oracleList"
            class="flex justify-between pt-[6px] border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6] pb-[14px]">
            <div>{{val}}</div>
            <div class="cursor-pointer open-link-css" @click="oracleClick">View</div>
          </div>
          <div class="flex justify-center">
            <div class="mt-[18px] cursor-pointer open-link-css" @click="goMiwaspaceTab('Oracle')">Add service</div>
            <!-- <div class="mt-[18px] cursor-pointer open-link-css" @click="oracleClick">View more</div> -->
          </div>
        </div>
        <div v-else-if="item === 'Node'">
          <div v-if="JSON.stringify(nodeInfo)=='{}'">
            <div class="text-center">
              <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
              <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
            </div>

            <div class="text-center mt-[12px] dark:text-[#8A8A8A] text-[#73706E]">The node has not been created yet</div>
            <div class="text-center mt-[10px] open-link-css cursor-pointer" @click="goMiwaspaceTab(item)">Add node</div>
          </div>
          <div v-else>
            <span class="open-link-css cursor-pointer node-view" @click="goNode(item)">View</span>
            <div class="text-center">
              <div class="text-[60px] text-[#E2B578]">{{ nodeInfo.nodes }}</div>
              <div class="text-[16px] mb-[16px]">Nodes</div>
            </div>
            <div class="flex justify-between border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6]">
              <div>
                <span class="mr-[10px] font-light">Synced</span>
                <span class="text-[18px]">{{ nodeInfo.synced }}</span>
              </div>
              <div>
                <span class="mr-[10px] font-light">Halted</span>
                <span class="text-[18px]">{{ nodeInfo.halted }}</span>
              </div>
            </div>
            <div class="text-center mt-[18px] open-link-css cursor-pointer" @click="goMiwaspaceTab(item)">Add node</div>
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
          </div>

          <div class="text-center mt-[12px] dark:text-[#8A8A8A] text-[#73706E]">The service has not been opened yet</div>
          <div class="text-center mt-[10px] open-link-css cursor-pointer" @click="goMiwaspaceTab(item)">Get service now</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="Dashboard">
import { ref,onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiGetRpc } from '@/apis/rpcs'
import { apiGetNodeStatistics } from '@/apis/node'
import { apiGetIfOpenService } from '@/apis/middleWare'
import { message } from "ant-design-vue";
const dashboardList = ref(['RPC','Node',"Internet Computer", 'Oracle', 'Storage', 'Graph', 'ZKP', 'Others'])
const RPCList = ref<any>([]);
const nodeInfo = ref<any>({});
const router = useRouter();
// 用来记录跳转的具体页面
const index = ref()
// oracle是否开通服务
const isShowOracle = ref(false)
const oracleList = ref<any>([])
// 已经开通 rpc 信息
const rpcSer = ref('')

const networkClick = (val: any) => {
  console.log('networkClick',val)
  router.push(`/middleware/dashboard/RPC/home`)
}
// more 跳转rpc
const goRPC = ()=>{
  router.push('/middleware/dashboard/RPC/pricing')
}

// more 跳转 oracle
const goOracleMore = ()=>{
  router.push('')
}

const oracleClick = () => {
  router.push('/middleware/dashboard/Oracle')
}

// 获取rpc信息
const getRpc = async()=>{
  try {
    const res = await apiGetRpc()
    rpcSer.value = res.data
    console.log('获取rpc信息:',res)
  } catch (error:any) {
    // message.error(error)
    console.log(error)
  }
}

// 开通服务跳转对应的miwaspace
const goMiwaspaceTab = (tab:any)=>{
  console.log('goMiwaspaceTab',tab)
  switch(tab) {
      case 'RPC':
        index.value = 1;
        break;
      case 'Oracle':
        index.value = 2;
        break;
      case 'Storage':
        index.value = 3;
        break;
      case 'Graph':
        index.value = 4;
        break;
      case 'ZKP':
        index.value = 5;
        break;
      case 'Others':
        index.value = 6;
        break;
      case 'Node':
        index.value = 7;
        break;
      default: break;
    }
  router.push(`/middleware/miwaspace?key=${index.value}`)
}
const openService = async()=>{
  const res = await apiGetIfOpenService('oracle')
  if(res.code === 200){
    isShowOracle.value = res.data.isActive
    oracleList.value = res.data.childList
  }
}
const goNode = (item:any)=>{
  router.push('/middleware/dashboard/node')
}
const getNodeStatistics = async()=>{
  const { data } = await apiGetNodeStatistics()
  if (data.halted > 0 || data.nodes > 0 || data.synced > 0) {
    nodeInfo.value = data;
  }
}
onMounted(()=>{
  getRpc()
  openService()
  getNodeStatistics();
})
</script>
<style scoped lang="less">
.box{
  border-bottom: 1px solid #434343;
}
.box div{
  // margin: -5px;
  // left: 5px;
}
.name{
  float: left;
  padding-top: 15px;
}
.network{
  display: flex;
  clear: both;
  flex-wrap: wrap;
  color: #ccc;
  font-weight: 100;
  padding-top: 10px;
  bottom: 5px;

}
.view{
  width: 50px;
  height: 40px;
  cursor: pointer;
  // color:#E2B578;
  text-align: right;
  float: right;
  top: -40px;
  padding-right: 10px;
}
.node-view{
  position: absolute;
  top: -39px;
  right: 0;
}
</style>
