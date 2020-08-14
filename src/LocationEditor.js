import React, {Component} from 'react'
import SelectableTable from "./selectable_table";
import axios from "axios";
import CONSTANTS from "./constants"
import SimpleMap from "./simplemap";
import retrieveItems from "./util";
import LoadingIndicator from "./LoadingIndicator";
import {trackPromise} from "react-promise-tracker";


function locationFilter(f){
    return CONSTANTS.ST+'Locations?$orderby=id&$filter='+f
}

class LocationEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {'locations': null,
                      'things': null,
            selected_locations: null,
            edit_param: 'description',
            edit_str: 'No Da',
            search_param: 'description',
            search_mode:'startswith',
            location_search_str: 'No D'}
    }
    onRefresh(){
        this.setState({selected_locations: this.state.locations.filter(f=>(f.isSelected))})
    }
    onLocationSelect(selection){
        console.debug(selection)
        var row =selection['row']
        row['isSelected'] = selection['isSelected']
        this.onRefresh()
    }

    handleSearch(evt){
        let url=''
        if (this.state.location_search_str){
            let fs = ''
            switch (this.state.search_mode){
                case 'equal':
                    fs = this.state.search_param+' eq \''+this.state.location_search_str+'\''
                    break;
                case 'startswith':
                    fs = 'startswith('+this.state.search_param+',\''+this.state.location_search_str+'\')'
                    break;
            }
            url = locationFilter(fs)
        }else{
            url=CONSTANTS.ST+'Locations?$orderby=id'
        }
        // console.log(url)
        trackPromise(retrieveItems(url, null,
            resp=>{
                let locations = resp.map((d, i)=>{
                    d['id'] = d['@iot.id']
                    d['latitude']=d['location']['coordinates'][1]
                    d['longitude']=d['location']['coordinates'][0]
                    return d
                })
                this.setState({locations: locations})
            },
            null, null, 'value',
        ))
    }

    // editing
    handleEdit(evt){
        if (this.state.edit_str){
            console.log('edit '+this.state.edit_param+' '+this.state.edit_str)
            let fl = this.state.locations.filter(f=>f.isSelected)
            if (CONSTANTS.loggedin){
                fl.forEach(f=>{
                let url = CONSTANTS.ST+'Locations('+f.id+')'
                let value = {}
                value[this.state.edit_param] = this.state.edit_str
                axios.patch(url, JSON.stringify(value)).then(resp=>{
                    console.log('patch response')
                    console.log(resp)
                         }
                    )
                })
            }else{

                alert('Please login')
            }

        }
    }

    render() {
        const location_columns = [  {'label': 'ID', 'key': 'id'},
                                    {'label': 'Name', 'key': 'name'},
                                    {'label': 'Description', 'key': 'description'},
                                    {'label': 'Lat.', 'key': 'latitude'},
                                    {'label': 'Long.', 'key': 'longitude'}]

        return (
            <div>
                <div className='hcontainer'>
                    <div className='divL'>
                        <div>
                            <select
                                value={this.state.search_param}
                                onChange={(evt)=>{this.setState({search_param: evt.target.value})}}>
                                <option value='name'>Name</option>
                                <option value='description'>Description</option>
                            </select>
                            <select
                                value={this.state.search_mode}
                                onChange={(evt)=>{this.setState({search_mode: evt.target.value})}}>
                                <option value='equal'>==</option>
                                <option value='startswith'>startswith</option>
                            </select>
                            <input
                                value={this.state.location_search_str}
                                onChange={(evt)=>{this.setState({location_search_str: evt.target.value})}}
                            />
                            <button onClick={evt=>this.handleSearch(evt)}>Search</button>
                        </div>
                        <div>
                            <select onChange={(evt)=>{this.setState({edit_param: evt.target.value})}}>
                                {/*<option value='name'>Name</option>*/}
                                <option value='description'>Description</option>
                            </select>
                            <input value={this.state.edit_str}
                            onChange={(evt)=>{this.setState({edit_str: evt.target.value})}}/>
                            <button onClick={evt=>this.handleEdit(evt)}>Edit</button>
                        </div>
                        <h3>Locations</h3>
                        <LoadingIndicator />
                        <SelectableTable
                            columns = {location_columns}
                            items = {this.state.locations}
                            onSelect = {sel=>this.onLocationSelect(sel)}
                            onRefresh={()=>this.onRefresh()}>
                        </SelectableTable>
                    </div>
                    <div className='divR'>
                     <SimpleMap
                            center={[34.359593, -106.906871]}
                            locations={this.state.selected_locations}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default LocationEditor