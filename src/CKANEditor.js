import React, {Component} from 'react'
import SelectableTable from "./selectable_table";
import axios from "axios";
import CONSTANTS from "./constants"
import retrieveItems from "./util";
import {trackPromise} from "react-promise-tracker";
import LoadingIndicator from "./LoadingIndicator";



class CKANEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {items: null}
    }

    handleGetOutDated(evt){
        console.log('Get outdated')
        let url = CONSTANTS.CKAN+'api/3/action/package_search?fq=metadata_modified:[* TO NOW-6MONTH]'
        trackPromise(axios.get(url).then(resp=>{
            console.log('resp:', resp)

            // this.setState({items: resp.data.result.results})
            this.setState({items: resp.data.result.results.map(i=>{
                i['href']=CONSTANTS.CKAN+'dataset/'+i['name']
                return i

            //     return {'name': i['name'],
            //             'id': i['id'],
            //             'metadata'
            //             'data_collection_contact_email': i['data_collection_contact_email'],
            //             'data_collection_contact_name': i['data_collection_contact_name'],
            //             'data_collection_organization': i['data_collection_organization'],
            //             'data_collection_procedures': i['data_collection_procedures'],
            //             'data_owner_contact_email': i['data_owner_contact_email'],
            //             'data_owner_contact_name': i['data_owner_contact_name'],
            //             'data_owner_organization': i['data_owner_organization'],
            //             'data_qaqc_contact_email': i['data_qaqc_contact_email'],
            //             'data_qaqc_contact_name': i['data_qaqc_contact_name'],
            //             'data_qaqc_organization': i['data_qaqc_organization'],}
            })})
        }))

    }
    onSelect(){
        console.log('Selected')
    }
    render() {
         const columns = [{'label': 'Title', 'key': 'title', 'component': 'a'},
                          {'label': 'Last Modified', 'key': 'metadata_modified'},
                          {'label': 'Collection email', 'key':'data_collection_contact_email'},
                          {'label': 'Collection name', 'key':'data_collection_contact_name'},
                          {'label': 'Collection organization', 'key':'data_collection_organization'},
                          {'label': 'Owner email', 'key':'data_owner_contact_email'},
                          {'label': 'Owner name', 'key':'data_owner_contact_name'},
                          {'label': 'Owner organization', 'key':'data_owner_organization'},
                          {'label': 'QAQC email', 'key':'data_qaqc_contact_email'},
                          {'label': 'QAQC name', 'key':'data_qaqc_contact_name'},
                          {'label': 'QAQC organization', 'key':'data_qaqc_organization'},
                          {'label': 'ID', 'key': 'id'},]


        return (
            <div>
                <button onClick={evt=>this.handleGetOutDated(evt)}>GetOutDated</button>
                <LoadingIndicator />
                <SelectableTable
                columns = {columns}
                items = {this.state.items}
                onSelect = {this.onSelect}
                />
            </div>
        );
    }
}

export default CKANEditor;