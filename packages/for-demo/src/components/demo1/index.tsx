import React from 'react'

export interface DemoComponentProps {
  host: string;
  id: string;
}

// const DemoComponent = (props: DemoComponentProps) => {
//   return (
//     <div>
//       <p>Host: {pr}</p>
//     </div>
//   )
// } 

class DemoComponent extends React.Component<DemoComponentProps>  {
  constructor(parameters: DemoComponentProps) {
    super(parameters)
  }

  render(): React.ReactNode {
    const { host, id } = this.props
    return (
      <div>
        <div>
          <p>Host: {host}</p>
          <p>ID: {id}</p>
        </div>
      </div>
    )
  }
}

export { DemoComponent }