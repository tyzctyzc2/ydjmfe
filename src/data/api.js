import '../config';
import textIcon from '../text.png';
import binaryIcon from '../binary.png';

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

export function renderIconImage(file) {
    if (file == undefined) {
      return textIcon;
    }
    switch(file.fileType) {
      case 'png':
      case 'jpg':
      case 'JPG':
      case 'mov':
      case 'pdf':
        return "http://localhost:8080\\ydjm\\" + file.filePath + "\\" + file.fileName;
        //return ".\\ydjm\\" + file.filePath + "\\" + file.fileName;
      case 'txt':
        return textIcon;
      default:
        return binaryIcon; 
    }
}

export function handleZoom(e) {
    console.log(e)
    let { clientHeight, clientWidth, style } = e.target
    let ratio = clientHeight / clientWidth
    console.log("ratio===" + ratio)
    console.log("clientHeight===" + clientHeight)
    console.log("clientWidth===" + clientWidth)
    if (e.nativeEvent.deltaY <= 0 && clientWidth < 1000) {
        style.transform = "scale(2.5)"
    } else if (e.nativeEvent.deltaY > 0) {
        style.transform = "scale(1)"
    }
}