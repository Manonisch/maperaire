import { FlatMap } from "../components/coreMap/FlatMap";
import { GlobeMap } from "../components/coreMap/GlobeMap";
import { FoodOverlay } from "../components/foodQuery";
import { CharacterOverlay } from "../components/characterjourneys/CharacterOverlay";
import { TopBar } from "../components/Topbar";
import { useMap, useQuery } from "../stores";
import { DragonOverlay } from "../components/dragonJourneys/DragonOverlay";

export function JustMapView() {
    const mapType = useMap(s => s.mapType)
    const query = useQuery(s => s.query)

    return <div className="themappa">
        <TopBar />
        {query === 'Food' && <FoodOverlay />}
        {query === 'Characters' && <CharacterOverlay />}
        {query === 'Dragons' && <DragonOverlay />}
        {mapType === 'globe' && <GlobeMap />}
        {mapType === 'flatmap' && <FlatMap />}
    </div>
}