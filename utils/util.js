const fs = require("node:fs")

function readFromFile(path){
    return fs.readFileSync(path,"utf8")
}
function writeToFile(path ,content){
    fs.writeFileSync(path,JSON.stringify(content),"utf8" ,(err)=>{
        if(err){
            console.log(err)
        }
    })
}

module.exports = {
    readFromFile,
    writeToFile
}
