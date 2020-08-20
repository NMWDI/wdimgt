import React, {Component} from 'react'
import SelectableTable from "./selectable_table";
import axios from "axios";
import CONSTANTS from "./constants"
import retrieveItems from "./util";
import {trackPromise} from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";



class ThingEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {things: null}
    }

    onThingSelect(selection){
        console.debug(selection)
        var row =selection['row']
        row['isSelected'] = selection['isSelected']
    }

    // custom
    handleCustom(evt){
        let url = CONSTANTS.ST+'Things?$orderby=id'
        console.log(url)
        retrieveItems(url, null, (result)=>{
            console.log(result)

            let things = result.filter(f=>{ return f['properties'] ? f['properties']['welldepth']: null})
            things.map(f=>{ f['properties_display']=JSON.stringify(f['properties'])
                            f['id']=f['@iot.id']})
            console.log(things)
            this.setState({things: things.slice(0, -1)})
        },
            null, null, 'value')
    }

    handleCustomEdit(evt){
        if (CONSTANTS.loggedin){
            this.state.things.filter(f=>{return f.isSelected}).forEach(f=>{
            let payload = {properties: {welldepth: parseInt(f['properties']['welldepth']),
                                        datasource: f['properties']['datasource']}}
            axios.patch(CONSTANTS.ST+'Things('+f.id+')', JSON.stringify(payload)).then(resp=>{
                console.debug(resp)
                })
            })
        }else{
            alert('Please login')
        }
    }

    exportThings(url){
        trackPromise(retrieveItems(url, null, resp=>{
            console.log(resp)

            let csv='data:text/csv;charset=utf-8,'
            csv += resp.map(e=>e['name']).join('\n')
            let encodedUri = encodeURI(csv);
            window.open(encodedUri);

        }, null, null, 'value'))

    }

    handleExportWaterLevelThingsCSV(evt) {
        let url = CONSTANTS.ST + "Things?$expand=Datastreams&$filter=Datastreams/name eq 'Depth Below Surface'"
        this.exportThings(url)

    }

    handleExportWaterQualityThingsCSV(evt){
        let url = CONSTANTS.ST+"Things?$expand=Datastreams&$filter=Datastreams/name ne 'Depth Below Surface'"
        this.exportThings(url)
    }


    render() {
        const thing_columns = [{'label': 'Name', 'key': 'name'},
                        {'label': 'ID', 'key': 'id'},
                        {'label': 'Description', 'key': 'description'},
                        {'label': 'Properties', 'key': 'properties_display'}]
        return (
            <div>
                <div>
                    <button onClick={evt=>this.handleCustom(evt)}>CustomSearch</button>
                    <button onClick={evt=>this.handleCustomEdit(evt)}>CustomEdit</button>
                    <button onClick={evt=>this.handleExportWaterLevelThingsCSV(evt)}>Export WaterLevel Things</button>
                    <button onClick={evt=>this.handleExportWaterQualityThingsCSV(evt)}>Export WaterQuality Things</button>
                </div>
                <LoadingIndicator />
                <div>
                        <h3>Things</h3>
                        <SelectableTable
                            columns = {thing_columns}
                            items = {this.state.things}
                            onSelect = {this.onThingSelect}
                            >
                        </SelectableTable>
                </div>
            </div>
        )
    }
}

export default ThingEditor