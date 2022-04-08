export default [
  {
    "type": "concurrent",
    "workflowId": "3d9c7d9adf0be8996fb830e0d7b73bbb",
    "displayName": "concurrent",
    "terminal": false,
    "id": "concurrentl0anh89p1",
    "config": {
      "branches": [
        {
          "displayName": "1",
          "pipeline": [
            {
              "type": "logicFlow",
              "workflowId": "3d9c7d9adf0be8996fb830e0d7b73bbb",
              "moduleId": null,
              "displayName": "logicFlow",
              "terminal": false,
              "id": "dataOperationl0atbpj53",
              "config": {},
              "domInfo": {
                "width": 140,
                "height": 63
              },
              "originParameters": [
                {
                  "type": "Model",
                  "path": "a",
                  "model": "taurus_Test22"
                }
              ]
            }
          ]
        },
        {
          "displayName": "else",
          "pipeline": []
        }
      ]
    },
    "originParameters": [
      {
        "type": "Model",
        "path": "a",
        "model": "taurus_Test22"
      }
    ]
  }
]
