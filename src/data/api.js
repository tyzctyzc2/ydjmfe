import '../config';

export function getTagList(cb){
    fetch(global.constants.website + "api/tag/list")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (cb != undefined) {
                cb(data)
            }
        })
}