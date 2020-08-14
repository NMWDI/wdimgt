import React, {Component} from 'react'
import {Map, CircleMarker, TileLayer,
    LayersControl, LayerGroup, FeatureGroup,
    Popup, Rectangle, Circle,
    GeoJSON, withLeaflet} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import {ReactLeafletSearch} from "react-leaflet-search";
import * as counties from './data/new_mexico_counties.json'


const Search = withLeaflet(ReactLeafletSearch)
const { BaseLayer, Overlay } = LayersControl
const center = [51.505, -0.09]
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
]
class SimpleMap extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let locations = this.props.locations? this.props.locations:[]

        const countiesGeoJSON = ()=>{
            console.log(counties.default)
            return <GeoJSON data={counties.default}/>
        }
        return (
            <div>
                <Map
                    zoom={6}
                    center={this.props.center}>
                     <Search
                        className="custom-style"
                        position="topleft"
                        mapStateModifier="flyTo"
                        inputPlaceholder="The default text in the search bar"
                        showMarker={true}
                        showPopup={true}
                        openSearchOnLoad={false}
                        closeResultsOnClick={false}
                    />
                    <LayersControl position="topright">
                        <BaseLayer name='OpenStreetMap'>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name='OpenTopoMap'>
                            <TileLayer
                                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                        <BaseLayer name='Esri.WorldImagery'>
                            <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'"
                            />
                        </BaseLayer>
                        <BaseLayer name='Esri.WorldStreetMap'>
                            <TileLayer
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                            />
                        </BaseLayer>
                        <BaseLayer name='Esri.WorldShadedRelief'>
                            <TileLayer
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
                                attribution='Tiles &copy; Esri &mdash; Source: Esri'
                                maxZoom= {13}
                            />
                        </BaseLayer>

                        <BaseLayer checked name='Stamen.Terrain'>
                            <TileLayer
                                url='https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}'
                                attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                subdomains='abcd'
                                minZoom= {0}
                                maxZoom= {18}
                                ext='png'
                            />

                        </BaseLayer>
                        <Overlay checked name='Counties'>
                            {countiesGeoJSON()}
                        </Overlay>


                    </LayersControl>

                    {locations.map(l=>(
                    <CircleMarker
                        radius={5}
                        color={'blue'}
                        center={[l['latitude'], l['longitude']]}
                    />))}

            </Map>
            </div>
        )
    }
}
export default SimpleMap