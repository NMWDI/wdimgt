import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from "@material-ui/core/TablePagination";
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import useStyles from "./styles";

function toCSVRow(items){
    return items.reduce((acc, cur)=>(acc+'\t'+cur))+'\n'
}

function saveFile(txt, name){
    const blob = new Blob([txt], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement("a")

    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
}
function exportTable(columns, items, name) {
    // map to list of values
    items = items.map(f=>{ return columns.map(c=>{return f[c.key]})})

    let doc = toCSVRow(columns.map(c=>{return c.key}))
    items.forEach(f=>{
        doc+=toCSVRow(f)
    })
    saveFile(doc, name)
}

function SelectableTable(props){
    const classes = useStyles();
    const data = props.items ? props.items : []
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const labels = props.columns.map((c, i)=>{
        return (<TableCell className={classes.sizeSmall} key={i}>{c.label}</TableCell>)})

    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row.id);
        let newSelected = [];
        var iss = false;

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row.id);
            console.info('a')
            iss = true;
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            console.info('b')
            iss = false;
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            console.info('c')
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            console.info('b')
        }

        props.onSelect({row: row, isSelected: iss})
        setSelected(newSelected)
    };

    const isSelected = (name) => selected.indexOf(name) !== -1 ;

    const handleSelectAll =( ) => {
        props.items.forEach(t=> {
            t['isSelected'] = true
        })
        setSelected(props.items.map( t => {return t.id }))
        if (props.onRefresh){
            props.onRefresh()
        }
    }
    const handleUnselectAll=()=>{
        props.items.forEach(t=> {
            t['isSelected'] = false
        })
        setSelected([])
        if (props.onRefresh){
            props.onRefresh()
        }
    }

    const handleExportAll=()=>{
        console.log('Export all')
        exportTable(props.columns, data, 'exportall.csv')
    }
    const handleExportSelected=()=>{
        console.log('Export selected')
        exportTable(props.columns, data.filter(f=>{return f.isSelected}), 'exportselected.csv')
    }

    return (
        <div>
            <div align='right'>
                <button onClick={()=>handleSelectAll()}>Select All</button>
                <button onClick={()=>handleUnselectAll()}>Unselect All</button>
                <button onClick={()=>handleExportAll()}>Export All</button>
                <button onClick={()=>handleExportSelected()}>Export Selected</button>
            </div>

            <TableContainer component={Paper}>
            <Table size='small' aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.sizeSmall}></TableCell>
                        {labels}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, index) => {
                        const isItemSelected = isSelected(r.id);
                        return (
                            <TableRow key={r.id}
                                      className={classes.row}
                                      // hover
                                      // role='checkbox'
                                      selected={isItemSelected}>

                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onClick={evt=>handleClick(evt, r)}
                                        color={'primary'}
                                        // className={classes.paddingCheckbox}
                                        checked={isItemSelected}/>
                                </TableCell>

                                {props.columns.map(c=><TableCell
                                    className={classes.sizeSmall}
                                    component={c.component?c.component:''}
                                    href={r.href?r.href:''}
                                    target={r.href?'_blank':''}
                                    key={c.key}>{r[c.key]}</TableCell>)}

                            </TableRow>
                        )})
                    }
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </TableContainer>
        </div>

    )

}

export default SelectableTable