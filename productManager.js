const fs = require('fs')

class ProductManager {
    #idProduct = 1
    constructor(path) {
        this.path = path
        fs.writeFileSync(this.path, JSON.stringify([]))
        this.products = []
    }

    async addProduct(title, description, price, thumbnail, code, stock = 0) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        product.id = this.#getId()
        const listadoProductos = await this.#getAllProducts()
        const chkProduct = listadoProductos.findIndex((producto) => producto.code === code)
        if (chkProduct === -1) {
            listadoProductos.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos));
        } else {
            console.log('Ya existe un producto con ese codigo')
            return
        }
    }

    async #getAllProducts() {
        let productos = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(productos)
    }

    async getProducts() {
        let productos = await fs.promises.readFile(this.path, 'utf-8')
        console.log(JSON.parse(productos))
    }

    async getProductById(idProd) {
        const listadoProductos = await this.#getAllProducts()
        const producto = listadoProductos.findIndex((item) => item.id === idProd)
        if (producto >= 0) {
            console.log(listadoProductos[producto])
            return
        }
        console.log('Not Found')
    }

    #getId() {
        const oldID = this.#idProduct
        this.#idProduct += 1
        return oldID;
    }
    async updateProduct(idProd, campo, valor) {
        let camposIncluidos = await this.#checkCampos(campo)
        if (camposIncluidos) {
            const listadoProductos = await this.#getAllProducts()
            const indexProducto = listadoProductos.findIndex((item) => item.id === idProd)
            if (indexProducto >= 0) {
                if (typeof (campo) === 'object') {
                    let campos = Object.entries(campo)
                    for (let n in campos) {
                        if (campos[n][0] !== 'id') {
                            listadoProductos[indexProducto][campos[n][0]] = campos[n][1]
                            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos))
                        }
                    }
                }
                else {
                    if (campo === "id") {
                        console.log('el campo ID no puede ser modificado')
                    } else {
                        listadoProductos[indexProducto][campo] = valor
                        await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos))
                    }
                }
            } else {
                console.log('El id indicado no corresponde a un producto valido')
            }
        } else {
            console.log('Uno o más campos no son válidos')
        }
    }
    async #checkCampos(campos) {
        const valoresCampos = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']
        if (typeof (campos) === 'object') {
            const valorEnviado = Object.keys(campos)

            for (let n of valorEnviado) {
                if (!valoresCampos.includes(n)) {
                    return false
                }
                return true
            }
        } else {
            if (!valoresCampos.includes(campos)) {
                return false
            } else {
                return true
            }
        }

    }

    async deleteProduct(idProd) {
        const listadoProductos = await this.#getAllProducts()
        const indexProducto = listadoProductos.findIndex((item) => item.id === idProd)
        if (indexProducto >= 0) {
            listadoProductos.splice(indexProducto, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos));
        } else {
            console.log('el id indicado no existe en el listado de productos')
        }
    }
}

const pm = new ProductManager('./products.json')


//updateProduct: El parametro "campos" puede ser un objeto con multiples pares key:value o bien un string
async function tests() {
    await pm.getProducts()
    await pm.addProduct('remera', 'remera de algodon blanca', 1500, 'sin imagen', 12870001, 20)
    await pm.addProduct('Patalon', 'Pantalon de Jean', 3500, 'sin imagen', 12870002, 10)
    await pm.addProduct('Zapatos', 'Zapatos negros', 4500, 'sin imagen', 12870004, 10)
    await pm.getProducts()
    await pm.updateProduct(1, { 'title': 'camisa', 'price': 2000, 'id': 5 }, 5000)
    await pm.getProducts()
    await pm.updateProduct(1, { 'nombre': 'tela', 'price': 2000, 'id': 5 }, 5000)
    await pm.getProducts()
    await pm.updateProduct(1, 'description', 'Camisa color blanco')
    await pm.deleteProduct(3)
    await pm.deleteProduct(3)
    await pm.getProducts()
    await pm.getProductById(1)
    await pm.getProductById(5)

}
tests()