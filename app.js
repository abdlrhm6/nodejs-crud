const http = require("node:http")
const Controller = require("./controllers/productController")


const server = http.createServer((req,res)=> {
    
    if(req.url =='/' && req.method =='GET'){
        return Controller.home(req,res)

    }else if(req.url =='/add' && req.method =='GET'){
        return Controller.productForm(req,res)
    }else if(req.url =='/add' && req.method =='POST'){
        return Controller.saveProduct(req,res)
    }else if(req.url.match(/\/delete\/\w+/) && req.method =='GET'){
        return Controller.deleteForm(req,res)
    }else if(req.url.match(/\/delete\/\w+/) && req.method =='POST'){
        return Controller.confirmDelete(req,res)
    }else if(req.url.match(/\/edit\/\w+/) && req.method =='GET'){
        return Controller.editForm(req,res)
    }else if(req.url.match(/\/edit\/\w+/) && req.method =='POST'){
        return Controller.confirmEdit(req,res)
    }
    
})

server.listen(4000,()=>console.log("serve running on http://localhost:4000"))