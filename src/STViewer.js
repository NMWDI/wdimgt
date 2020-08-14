import React, {Component} from 'react'
import axios from "axios";
import ReactJson from 'react-json-view'
import LoadingIndicator from "./LoadingIndicator";
import {trackPromise} from "react-promise-tracker";
import retrieveItems from "./util";
const BASE = 'https://st.newmexicowaterdata.org/FROST-Server/v1.1/'

const makeURL = (tag, id)=>{
    return BASE + tag+ '('+id+')'
}
function saveFile(txt, name){
    const blob = new Blob([txt], { type: 'application/json;charset=utf-8;' });
    const a = document.createElement("a")

    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
}

class STViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
                        location: '',
                        activeLocationThing: {},
                        location_link: '',
                        thing_link: '',
                        nobservations: 0,
                        activeDatastream: {}
                    }
    }

    handleExportLocations(){
        // let url = BASE+'Locations?$expand=Things/Datastreams'
        let url = BASE+'Locations?$expand=Things'
        trackPromise(retrieveItems(url, null,
            resp=>{
                let features = resp.map( loc => ({type: 'feature',
                                                  geometry: loc.location,
                                                  things: loc.Things.map(t=> (
                                                      {
                                                          name: t['name'],
                                                          description: t['description'],
                                                          properties: t['properties'],
                                                          datastreams: t['Datastreams'].map(d=>(
                                                              {
                                                                  name: d['name'],
                                                                  description: d['description'],
                                                                  link: d['@iot.selfLink']
                                                              }))
                                                      })),
                                                  link: loc['@iot.selfLink'],
                                                  name: loc.name
                                              }))
                saveFile(JSON.stringify({type: 'FeatureCollection',
                                            features: features},
                    null , ' '), 'locations.json')
            },
            null, null, 'value',
        ))
    }
    handleLoadLocation(evt){
        let url = makeURL('Locations', this.state.location)+'?$expand=Things'
        console.debug(url)
        if (this.state.location){
            axios.get(url).then(resp=>{
                console.log(resp)
                this.setState({activeLocationThing: resp.data,
                         location_link: resp.data['@iot.selfLink'],
                            thing_link: resp.data['Things'][0]['@iot.selfLink']
                    })
            })
        }
    }

    handleLoadThing(evt){
        let url = makeURL('Things', this.state.thing)
        console.debug(url)
        if (this.state.thing){
            axios.get(url).then(resp=>{
                console.log(resp)
                this.setState({activeLocationThing: resp.data,
                thing_link: resp.data['@iot.selfLink']})
            })
        }
    }

    handleDatastream(evt){
        let datastream = makeURL('Datastreams', this.state.datastream)
        axios.get(datastream+'/Observations?$count=true&$orderby=phenomenonTime&$top=1').then(resp=> {
                this.setState({nobservations: resp.data['@iot.count']})
            }
        )

        axios.get(datastream).then(resp=>{
            this.setState({activeDatastream: resp.data})
        })
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={()=>this.handleExportLocations()}>Export Locations</button>
                    <LoadingIndicator />
                </div>
                <div>
                    <label>Location</label>
                    <input type={'number'}
                           value={this.state.location}
                           onChange={(evt)=>{this.setState({location: evt.target.value})}}/>
                    <button onClick={(evt)=>this.handleLoadLocation(evt)}>Load</button>
                    <label>Thing</label>
                    <input type={'number'}
                           value={this.state.thing}
                           onChange={(evt)=>{this.setState({thing: evt.target.value})}}/>
                    <button onClick={(evt)=>this.handleLoadThing(evt)}>Load</button>
                </div>
                <ul align='left'>
                    <li><a href={this.state.location_link}>Location: {this.state.location_link}</a></li>
                    <li><a href={this.state.thing_link}>Thing: {this.state.thing_link}</a></li>
                </ul>

                <div align='left'>
                    <ReactJson src={this.state.activeLocationThing}/>
                </div>


                <h3>Datastreams/Observations</h3>
                <div>
                    <label>Datastream</label>
                    <input type={'number'}
                           value={this.state.datastream}
                           onChange={(evt)=>{this.setState({datastream: evt.target.value})}}/>
                    <button onClick={(evt)=>this.handleDatastream(evt)}>Load</button>
                    NObservations: {this.state.nobservations}
                </div>

                <div align='left'>
                    <ReactJson src={this.state.activeDatastream}/>
                </div>

            </div>
        )
    }
}

export default STViewer