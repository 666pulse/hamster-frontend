const middlewareRoute = [
  {
    path: "/middleware/dashboard",
    redirect: "/middleware/dashboard",
    component: () => import('@/views/chainLink/dashboard/index.vue'),
    children: [
      {
        path: "/middleware/dashboard",
        name: "Dashboard",
        component: () => import('@/views/chainLink/dashboard/dashboard.vue'),
        meta: {
          isShow: true,
          sidebarMap: ['Dashboard'],
        }
      },
      {
        path: "/middleware/dashboard/default/:type",
        name: "Default",
        component: () => import('@/views/chainLink/components/rpcAndOracleDefault.vue'),
        meta: {
          isShow: false,
        },
      },
      {
        path: "/middleware/dashboard/RPC",
        name: "RPC",
        key: 'RPC',
        redirect: "/middleware/dashboard/RPC",
        meta: {
          isShow: true,
        },
        children: [
          {
            path: "/middleware/dashboard/RPC",
            name: "RPC",
            component: () => import('@/views/middleware/rpc/index.vue'),
            meta: {
              sidebarMap: ['RPC'],
            }
          },
          {
            path: "/middleware/dashboard/RPC/home",
            name: "Home",
            key: 'RPCIndex',
            component: () => import('@/views/chainLink/rpc/indexNew.vue'),
            meta: {
              // sidebarMap: ['RPC'],
              isShow: true,
              sidebarMap: ['Home'],
            }
          },
          {
            path: "/middleware/dashboard/RPC/myapp",
            name: "Apps",
            component: () => import('@/views/chainLink/rpc/myApp.vue'),
            meta: {
              isShow: true,
              sidebarMap: ['Apps'],
            }
          },
          {
            path: "/middleware/dashboard/RPC/Billing",
            name: "Billing",
            key: 'RPCBilling',
            component: () => import('@/views/chainLink/rpc/billing.vue'),
            meta: {
              isShow: true,
              sidebarMap: ['Billing'],
            },
          },
          {
            path: "/middleware/dashboard/RPC/pricing",
            name: "Pricing",
            key: 'RPCVersionPlan',
            component: () => import('@/views/chainLink/rpc/versionPlan.vue'),
            meta: {
              isShow: true,
              sidebarMap: ['Pricing'],
            },
          },
          {
            path: "/middleware/dashboard/RPC/myapp/detail",
            name: "Detail",
            component: () => import('@/views/chainLink/rpc/appDetail.vue'),
            meta: {
              // isShow: true,
              sidebarMap: ['Apps'],
            }
          },
          {
            path: "/middleware/dashboard/rpc/zan/auth",
            name: "zanAuth",
            component: () => import('@/views/middleware/rpc/zanAuth.vue'),
            meta: {
              sidebarMap: ['RPC'],
            }
          },
          {
            path: "/middleware/dashboard/rpc/zan/apiKeyDetail/:apiKeyId",
            name: "zanApiKeyDetail",
            component: () => import('@/views/middleware/rpc/apiKeyDetail.vue'),
            meta: {
              sidebarMap: ['RPC'],
            }
          },
          {
            path: "/middleware/dashboard/RPC/rpc-detail/:chain",
            name: "rpcDetail",
            component: () => import('@/views/chainLink/rpc/rpcDetail.vue'),
            meta: {
              sidebarMap: ['RPC'],
            }
          }
        ]
      },
      {
        path: "/middleware/dashboard/icp",
        name: "Internet Computer",
        redirect: "/middleware/dashboard/icp",
        meta: {
          isShow: true,
        },
        children: [
          {
            path: "/middleware/dashboard/icp",
            name: "Internet Computer",
            component: () => import('@/views/chainLink/icp/index.vue'),
            meta: {
              sidebarMap: ['Internet Computer'],
            }
          },
        //   {
        //     path: "/middleware/dashboard/node/create",
        //     name: "createNode",
        //     component: () => import('@/views/chainLink/Node/createNode.vue'),
        //     meta: {
        //       sidebarMap: ['Node'],
        //     }
        //   },
          {
            path: "/middleware/dashboard/icp/detail",
            name: "InternetComputerdetail",
            component: () => import('@/views/chainLink/icp/detail.vue'),
          },
        ]
      },
      {
        path: "/middleware/dashboard/node",
        name: "Node",
        redirect: "/middleware/dashboard/node",
        meta: {
          isShow: true,
        },
        children: [
          {
            path: "/middleware/dashboard/node",
            name: "Node",
            component: () => import('@/views/chainLink/Node/index.vue'),
            meta: {
              sidebarMap: ['Node'],
            }
          },
          {
            path: "/middleware/dashboard/node/create",
            name: "createNode",
            component: () => import('@/views/chainLink/Node/createNode.vue'),
            meta: {
              sidebarMap: ['Node'],
            }
          },
          {
            path: "/middleware/dashboard/node/detail",
            name: "nodeDetail",
            component: () => import('@/views/chainLink/Node/nodeDetail.vue'),
          },
        ]
      },
      {
        path: "/middleware/dashboard/oracle",
        name: "Oracle",
        redirect: "/middleware/dashboard/oracle",
        meta: {
          isShow: true,
        },
        children: [
          {
            path: "/middleware/dashboard/oracle",
            name: "Oracle",
            component: () => import('@/views/chainLink/oracle/index.vue'),
            meta: {
              sidebarMap: ['Oracle'],
            }
          },
          {
            path: "/middleware/dashboard/oracle/sublist",
            name: "subList",
            component: () => import('@/views/chainLink/oracle/mySubscription/subList.vue'),
            meta: {
              sidebarMap: ['Oracle'],
            }
          },
          {
            path: "/middleware/dashboard/oracle/subList/sublist-detail",
            name: "subListDetail",
            component: () => import('@/views/chainLink/oracle/mySubscription/subListDetail.vue'),
            meta: {
              sidebarMap: ['Oracle'],
            }
          },
          {
            path: "/middleware/dashboard/oracle/create-request",
            name: "CreateRequest",
            component: () => import('@/views/chainLink/oracle/createRequest/index.vue'),
            meta: {
              sidebarMap: ['Oracle'],
            }
          },
        ]
      },
      {
        path: "/middleware/dashboard/ZKP",
        name: 'ZKP',
        redirect: "/middleware/dashboard/ZKP",
        meta: {
          isShow: true,
          isTag: true,
          sidebarMap: ['ZKP'],
        },
        children: [
          {
            path: "/middleware/dashboard/ZKP",
            name: "ZKP",
            component: () => import('@/views/chainLink/miwaspace/index.vue'),
          },
        ]
      },
      {
        path: "/middleware/dashboard/graph",
        name: 'Graph',
        redirect: "/middleware/dashboard/graph",
        meta: {
          isShow: true,
          isTag: true,
          sidebarMap: ['Graph'],
        },
        children: [
          {
            path: "/middleware/dashboard/graph",
            name: "Graph",
            component: () => import('@/views/chainLink/miwaspace/index.vue'),
          },
        ]
      },
      {
        path: "/middleware/dashboard/storage",
        name: 'Storage',
        redirect: "/middleware/dashboard/storage",
        meta: {
          isShow: true,
          isTag: true,
          sidebarMap: ['Storage'],
        },
        children: [
          {
            path: "/middleware/dashboard/storage",
            name: "Storage",
            component: () => import('@/views/chainLink/miwaspace/index.vue'),
          },
        ]
      },
      {
        path: "/middleware/dashboard/others",
        name: "Others",
        redirect: "/middleware/dashboard/others",
        meta: {
          isShow: true,
          isTag: true,
          sidebarMap: ['Others'],
        },
        children: [
          {
            path: "/middleware/dashboard/others",
            name: "Others",
            component: () => import('@/views/chainLink/miwaspace/index.vue'),
          },
        ]
      },
    ],
  },
  {
    path: "/middleware/miwaspace",
    redirect: "/middleware/miwaspace",
    children: [
      {
        path: "/middleware/miwaspace",
        name: "Miwaspace",
        component: () => import('@/views/chainLink/miwaspace/index.vue'),
      },
    ]
  }
]
export default middlewareRoute
