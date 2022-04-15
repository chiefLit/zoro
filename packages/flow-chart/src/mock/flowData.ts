export default [
  {
    "id": "aHty2D",
    "type": "query",
    "displayName": "findAll"
  },
  {
    "id": "IHrGmK",
    "type": "branch",
    "displayName": "ownerADataPermissionFunc",
    config: {
      branches: [
        {
          pipeline: [
            {
              "id": "aHty12D",
              "type": "query",
              "displayName": "findAll"
            },
            {
              "id": "aH1ty2D",
              "type": "query",
              "displayName": "findAll"
            }
          ]
        },
        {
          pipeline: [
            {
              "id": "aH12ty2D",
              "type": "group",
              "displayName": "findAll",
              config: {
                group: {
                  pipeline: [
                    {
                      "id": "aHt123123y12D",
                      "type": "query1",
                      "displayName": "findAll"
                    },
                    {
                      "id": "aH1ty21231D",
                      "type": "query2",
                      "displayName": "findAll"
                    }
                  ]
                }

              }
            }
          ]
        },
      ]
    }
    // children: [
    //   {
    //     "id": "aHty1232123D",
    //     "type": "query",
    //     "displayName": "findAll"
    //   },
    //   {
    //     "id": "123123",
    //     "type": "group",
    //     "displayName": "findAll",
    //     children: [
    //       {
    //         "id": "qweqwe",
    //         "type": "query",
    //         "displayName": "findAll"
    //       },
    //       {
    //         "id": "qweqwe",
    //         "type": "query",
    //         "displayName": "findAll"
    //       },
    //       {
    //         "id": "qweqwe",
    //         "type": "query",
    //         "displayName": "findAll"
    //       },
    //       {
    //         "id": "aHtyasdasd2D",
    //         "type": "branch",
    //         "displayName": "findAll",
    //         children: [
    //           {
    //             "id": "qweqwe",
    //             "type": "query",
    //             "displayName": "findAll"
    //           },
    //           {
    //             "id": "aHtyasdasd2D",
    //             "type": "query",
    //             "displayName": "findAll"
    //           }
    //         ]
    //       },
    //       {
    //         "id": "aHtyfsg2D",
    //         "type": "query",
    //         "displayName": "findAll"
    //       }
    //     ]
    //   },
    //   {
    //     "id": "aHtrtyrty2D",
    //     "type": "query",
    //     "displayName": "findAll"
    //   }
    // ]
  },
  {
    "id": "fRUmvbnvnMS",
    "type": "end",
    "displayName": "END"
  }
]
