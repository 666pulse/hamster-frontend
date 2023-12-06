<template>
  <div class="my-10">
    <span class="text-2xl font-bold">Internet Computer</span>
    <div class="ethereum-container">
      <div class="flex justify-between items-center">
        <div>
          <p>
            The Internet Computer is a blockchain that runs canister smart contracts, which are code units bundling together WebAssembly bytecode and the memory pages the bytecode runs in. The Internet Computer is composed of individual subnet blockchains running in parallel and connected together by the use of chain key cryptography. This means that canisters running on a subnet can seamlessly call canisters hosted in any other subnet of the Internet Computer blockchain. Moreover, the governance system of the Internet Computer can dynamically increase the capacity of the Internet Computer by adding new subnets, allowing dapps to scale out.
          </p>
          <p>
            Developers can thus build new dapps consisting of multiple canisters running in parallel on different subnets and possibly integrate them with existing canisters already running on the Internet Computer.
          </p>

        </div>

      </div>


      <div>
        <a-button class="enter" @click="togo" >Enter Now</a-button>
      </div>
    </div>
  </div>
</template>
<script  setup>
import {useRouter} from "vue-router";

const router = useRouter();
  const togo = () =>{
    router.push("/middleware/dashboard/icp")
  }
</script>

<style scoped>
.ethereum-container {
  @apply dark:bg-[#10100F];
  /* display: inline-block; */
  /* // height: 326px; */
  /* min-width: 400px; */
  padding: 30px;
  background: #F3F3F3;
  border-radius: 12px;
  /* margin: 10px; */
  border: 1px solid transparent;
  margin-top: 20px;
}
.ethereum-container:hover{
  border: 1px solid #E2B578;
}
.enter{
  width: 240px;
  margin-top: 30px;
  height: 43px;
}
</style>
