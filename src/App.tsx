import { PropsWithChildren, HTMLProps } from "react";
import { JustMapView } from "./views/JustMapView"
import { SourcesView } from "./views/attributation";
import { usePage } from "./stores/PageStore";
import { useWorldData } from "./components/utils";
import { useWorldDataStore } from "./stores/WorldDataStore";

function App() {
  const AppWrapper = ({ children, ...rest }: PropsWithChildren<HTMLProps<HTMLDivElement>>) => {
    return (<div {...rest}>{children}</div>);
  }

  const data = useWorldData();
  const setWorldData = useWorldDataStore(s => s.setWorldData)
  setWorldData(data);

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
