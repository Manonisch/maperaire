import { PropsWithChildren, HTMLProps } from "react";
import { JustMapView } from "./views/JustMapView"
import { SourcesView } from "./views/attributation";
import { usePage } from "./stores/PageStore";

function App() {
  const AppWrapper = ({ children, ...rest }: PropsWithChildren<HTMLProps<HTMLDivElement>>) => {
    return (<div {...rest}>{children}</div>);
  }

  return (
    <AppWrapper className="wrapper">
      <div className="background-image" />
      <Routing />
    </AppWrapper>
  )
}

function Routing() {
  const page = usePage(s => s.page);
  switch (page) {
    case 'sources':
      return <SourcesView />
    case 'map':
      return <JustMapView />
    default:
      return "Loading..."
  }
}

export default App
