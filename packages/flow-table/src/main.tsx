import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { mock1 } from './mock'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      value={mock1}
      onChange={(value) => {
        console.log(`onChange `, value);
      }}

      beforeAddNode={({ nodeType, previousNode }) => {
        console.log(`beforeAddNode `, nodeType, previousNode);
      }}
      afterAddNode={({ targetNode }) => {
        console.log(`afterAddNode `, targetNode);
      }}
      beforeDeleteNode={({ targetNode }) => {
        console.log(`beforeDeleteNode `, targetNode);
      }}
      afterDeleteNode={({ targetNode }) => {
        console.log(`afterDeleteNode `, targetNode);
      }}

      beforeAddBranch={({ targetNode }) => {
        console.log(`beforeAddBranch `, targetNode);
      }}
      afterAddBranch={({ targetNode }) => {
        console.log(`afterAddBranch `, targetNode);
      }}
      beforeDeleteBranch={({ targetBranch }) => {
        console.log(`beforeDeleteBranch `, targetBranch);
      }}
      afterDeleteBranch={({ targetBranch }) => {
        console.log(`afterDeleteBranch `, targetBranch);
      }}

      // onAddNode={({ nodeType, previousNode }) => {
      //   console.log(`onAddNode `, nodeType, previousNode);
      // }}
      onAddBranch={({ targetNode }) => {
        console.log(`onAddBranch `, targetNode);
      }}
      onDeleteNode={({ targetNode }) => {
        console.log(`onDeleteNode `, targetNode);
      }}
      onDeleteBranch={({ targetBranch }) => {
        console.log(`onDeleteBranch `, targetBranch);
      }}
    />
  </React.StrictMode>
)
