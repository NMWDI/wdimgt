import axios from "axios";

const getItems = (url, maxitems, i, items, resolve, reject, next, base, key) =>{
    axios.get(url).then(response=>{
        let data = response.data

        let ritems = items.concat( key ? data[key] : data)
        if (maxitems>0){
            if (ritems.length>maxitems){
                ritems = ritems.slice(0,maxitems)
                resolve(ritems)
                return
            }
        }
        next = next ? next : '@iot.nextLink'
        if (data[next]){
            let nurl = base ? base+data[next] : data[next]
            getItems(nurl, maxitems, i+1, ritems, resolve, reject, next, base, key)
        }else{
            resolve(ritems)
        }
    })
}

const retrieveItems = (url, maxitems, callback, next, base, key) => {
    return new Promise((resolve, reject) => {
        getItems(url, maxitems, 0, [], resolve, reject, next, base, key)}).then(callback)
}

export default retrieveItems