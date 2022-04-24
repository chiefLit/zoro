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
              "type": "query1",
              "displayName": "findAll"
            }
          ]
        },
        {
          pipeline: [
            {
              "id": "aHty12D",
              "type": "query",
              "displayName": "findAll"
            },
            {
              "id": "aH1ty2D",
              "type": "query1",
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
                      "id": "IHrGm123K",
                      "type": "branch",
                      "displayName": "ownerADataPermissionFunc",
                      config: {
                        branches: [
                          {
                            pipeline: [
                              {
                                "id": "aHty1q'e2D",
                                "type": "query1",
                                "displayName": "findAll"
                              }
                            ]
                          },
                          {
                            pipeline: [
                              {
                                "id": "aHqwety12D",
                                "type": "query",
                                "displayName": "findAll"
                              },
                              {
                                "id": "aH1ty2D",
                                "type": "query1",
                                "displayName": "findAll"
                              }
                            ]
                          },
                          {
                            pipeline: [
                              {
                                "id": "aHqwe12ty2D",
                                "type": "group",
                                "displayName": "findAll",
                                config: {
                                  group: {
                                    pipeline: [
                                      {
                                        "id": "aHt123qwe123y12D",
                                        "type": "query1",
                                        "displayName": "findAll"
                                      },
                                      {
                                        "id": "aqweH1ty21231D",
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
  },
  {
    "id": "fRUmvbnvnMS",
    "type": "end",
    "displayName": "END"
  }
]
