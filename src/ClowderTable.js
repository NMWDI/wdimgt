import React, {Component} from 'react'
import SelectableTable from "./selectable_table";
import axios from "axios";
import CONSTANTS from "./constants";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import retrieveItems from "./util";

const SECRET_KEY='ee7b388d-fdf9-4ac4-bbc0-fb9156984cb9'
function files(id, extra){
    return CONSTANTS.CLOWDER_FILES+id+extra+'?key='+SECRET_KEY

}

class ClowderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {'files': null,
            'selected_file_text': '',
            'search_string': null}
    }

    execute_query(q){
        retrieveItems('https://clowder.newmexicowaterdata.org/api/search?query='+q,
            null,
                // res=>{this.setState({files: res})},
            res=>{
            console.log(res.length)
            this.setState({files: res})
            },
            'next',
            'https://clowder.newmexicowaterdata.org',
            'results')

    }

    handleQuery(){
        console.debug('Handle query')
        if (this.state.search_string){

            let s = this.state.search_string
            s = s.replace('=', ':')
            this.execute_query(s)
        }
    }

    handleSTNeeded(){
        console.debug('Handle STNeeded')
        this.execute_query('tag%3Astneeded')
    }
    handleCKANNeeded(){
        console.debug('Handle CKANNeeded')
        this.execute_query('tag%3Ackanneeded&size=10')
    }

    onSelect(selection){
        console.debug(selection)
        var row =selection['row']
        row['isSelected'] = selection['isSelected']
        if (!row['isSelected']){
            this.setState({selected_file_text: ''})
        } else{
            axios.get(files(row['id'], '/blob')).then(resp=>{
            console.log(resp.data)
            this.setState({selected_file_text: resp.data})
            })
        }


    }
    handleCKANSubmit(){
        console.debug('submit ckan')
        console.warn('ckan extraction not yet enabled')
    }

    handleSTSubmit(){
        console.debug('submit st')
        // for each file submit for st extraction
        if (CONSTANTS.loggedin){
            this.state.files.filter(f=>f.isSelected).forEach(f=>{
            axios.post(files(f.id, '/extractions'),
                {'extractor': 'wdi.st'}
                ).then(resp=>{
                    console.log(resp)
            })
            })
        }else{
            alert('Please login')
        }



    }
    handleRemoveSTNeeded(){
        this.state.files.filter(f=>f.isSelected).forEach(f=>{
            axios.delete(files(f.id, '/tags'),
                {data: {tags: ['STNeeded']}}).then(resp=>{
                console.log(resp)
            })
        })

        this.handleSTNeeded()
    }
    handleSearchInput(evt){
        console.log(evt.target.value)
        this.setState({'search_string': evt.target.value})
    }

    render() {
        const columns = [{'label': 'Name', 'key': 'name'},
                        {'label': 'ID', 'key': 'id'},
                        {'label': 'Create Date', 'key': 'created'},
        ]
        return (
            <div>
                <div align='left'>
                    <h3>Search Examples</h3>
                     <table >
                        <tr><td width="120"><b>field</b></td>
                            <td width="250"><b>example</b></td>
                            <td width="400"></td></tr>
                        <tr><td><i>(basic)</i></td>
                            <td>agriculture</td>
                            <td>searches <b>name, description, creator name, and tag</b> fields</td></tr>
                        <tr><td><i>(regular expression)</i></td>
                            <td>tre.*s</td>
                            <td>get anything with &quot;trees&quot; or &quot;streetcars&quot; in basic fields</td></tr>
                        <tr><td>name</td>
                            <td>name:VIS_SV_180_z1_1207272.png</td>
                            <td>searches file, dataset or collection names</td></tr>
                        <tr><td>creator</td>
                            <td>creator:5a8c4bd574d559ca9b46ef58</td>
                            <td>creator ID can be found in their profile URL</td></tr>
                        <tr><td>resource_type</td>
                            <td>resource_type:collection</td>
                            <td>can be file, dataset or collection</td></tr>
                        <tr><td>tag</td>
                            <td>tag:animal</td>
                            <td>filter search results by specific tags</td></tr>
                        <tr><td>in</td>
                            <td>in:5ccafdf97ceaec481ae86812</td>
                            <td>a dataset or collection ID can be specified</td></tr>
                        <tr><td>contains</td>
                            <td>contains:5ccafe167ceaec481ae86816</td>
                            <td>a file, dataset or collection ID can be specified</td></tr>
                        <tr><td>metadata</td>
                            <td>"Funding Institution":"University of Illinois"</td>
                            <td>if the field is not any of the above, it is assumed to be a metadata field</td></tr>
                        <tr><td><i>(multiple)</i></td>
                            <td>test resource_type:file tag:^tr.*s</td>
                            <td>get any files tagged &quot;trees&quot; or &quot;trust&quot;, and with &quot;test&quot; in basic fields</td></tr>
                    </table>
                </div>
                <div>
                    <input onChange={(evt)=>this.handleSearchInput(evt)}></input>
                    <button onClick={()=>this.handleQuery()}>Search</button>
                    <button onClick={()=>this.handleSTNeeded()}>STNeeded</button>
                    <button onClick={()=>this.handleCKANNeeded()}>CKANNeeded</button>
                </div>
                <div>
                    <button onClick={()=>this.handleSTSubmit()}>ST Submit</button>
                    <button onClick={()=>this.handleCKANSubmit()}>CKAN Submit</button>
                    <button onClick={()=>this.handleRemoveSTNeeded()}>RemoveSTNeeded</button>
                </div>

                <div className='hcontainer'>
                    <div className='divL'>
                        <SelectableTable
                            columns = {columns}
                            items = {this.state.files}
                            onSelect = {(selection)=>this.onSelect(selection)}
                                >
                        </SelectableTable>
                    </div>
                    <div align='left' className='divR'>
                        <SyntaxHighlighter language="text" style={docco}>
                          {this.state.selected_file_text}
                        </SyntaxHighlighter>
                    </div>
                </div>



            </div>
        )
    }
}

export default ClowderTable