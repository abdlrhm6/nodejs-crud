const { readFromFile, writeToFile } = require("../utils/util")




function home(req, res) {

    let html = readFromFile("./templates/home.html")
    const products = JSON.parse(readFromFile("./data.json"))
    let data = "<tr><th>id</th><th>Name</th><th>Description</th><th>Price</th><th>actions</th></></tr>"

    products.forEach(p => {
        data += `<tr>
        <td>${p?.id}</td>
        <td>${p?.name}</td>
        <td>${p?.desc}</td>
        <td>${p?.price} $</td>
        <td>
        <a href="/edit/${p.id}">Edit</a>
        <a href="/delete/${p.id}">delete</a>
        </td>
        </tr>`
    })

    data = `<table>${data} </table>`

    html = html.replace("{{data}}", data)
        .replace("{{title}}", "Products List")

    res.writeHead(200, { 'Content-Type': 'text/html' })
        .end(html)
}

function productForm(req, res) {
    let html = readFromFile("./templates/home.html")
    let form = readFromFile("./templates/product-form.html")
    form = form.replace("{{action}}" ,"/add")

    html = html.replace("{{data}}", form)
        .replace("{{title}}", "Add A Product")

    res.writeHead(200, { 'Content-Type': 'text/html' })
        .end(html)
}

function saveProduct(req, res) {
    let data = ''
    try {
        req.on('data', (chunk) => {
            data += chunk.toString()
        })

        req.on("end", () => {
            let body = data.split("&")
            let name = body[0].split("=")[1].split("+").join(" ")
            let desc = body[1].split("=")[1].split("+").join(" ")
            let price = body[2].split("=")[1]

            let products = JSON.parse(readFromFile("./data.json"))
            let id = products.length +1
            
            let product = { id, name, desc, price }
            products = [...products, product]
            writeToFile('./data.json', products)
            res.writeHead(302, {
                'Location': '/'
            }).end();


        })
    } catch (err) {
        console.log(err)
    }

}

function deleteForm(req,res){
    const id = req.url.split("/")[2]
    const products = JSON.parse(readFromFile("./data.json"))
    const product = products.find( p=> p.id ==id)
    let html = readFromFile("./templates/home.html")

    const form = `<div> 
    <form action='/delete/${product.id}' method='POST'>

    <h3> Are you sure you want to delete : </h3>
    <div>
            <p>Name :</p> <b>${product.name}</b>
            <p>description :</p> <b>${product.desc}</b>
            <p>price :</p> <b>${product.price}</b>
    </div>
    <input type ="submit" value="Confirm"/>

    </form>
    </div>`
    html = html.replace("{{data}}", form)
        .replace("{{title}}", "Confirm delete")

    res.writeHead(200, { 'Content-Type': 'text/html' })
        .end(html)
}

function confirmDelete(req,res){
    const id = req.url.split("/")[2]
    const products = JSON.parse(readFromFile("./data.json"))
    const remainingProducts = products.filter( p=> p.id !=id)
    writeToFile('./data.json', remainingProducts)
            res.writeHead(302, {
                'Location': '/'
            }).end();
}

function editForm(req,res){
    const id = req.url.split("/")[2]
    const products = JSON.parse(readFromFile("./data.json"))
    const product = products.find( p=> p.id ==id)
    let html = readFromFile("./templates/home.html")
    let form = readFromFile("./templates/product-form.html")
    form = form.replace("{{action}}" ,`/edit/${product.id}`)
                .replace("{{1}}",`value="${product.name}"`)
                .replace("{{2}}",`value="${product.desc}"`)
                .replace("{{3}}",`value="${product.price}"`)
    html = html.replace("{{data}}",form)
    .replace("{{title}}","Confirm Edit")

    res.writeHead(200, { 'Content-Type': 'text/html' })
        .end(html)
}


function confirmEdit(req,res){
    const id = req.url.split("/")[2]
    let data = ''
    try {
        req.on('data', (chunk) => {
            data += chunk.toString()
        })

        req.on("end", () => {
            let body = data.split("&")
            let name = body[0].split("=")[1].split("+").join(" ")
            let desc = body[1].split("=")[1].split("+").join(" ")
            let price = body[2].split("=")[1]

            let products = JSON.parse(readFromFile("./data.json"))
            products.forEach( p=>{
                if(p.id == id){
                    p.name=name
                    p.desc=desc
                    p.price=price
                }
            })

            writeToFile('./data.json', products)
            res.writeHead(302, {
                'Location': '/'
            }).end();


        })
    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    home,
    productForm,
    saveProduct,
    deleteForm,
    confirmDelete,
    editForm,
    confirmEdit
}