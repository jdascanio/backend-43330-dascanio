class ProductManager {

    #idProduct = 1
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock = 0) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock

        }
        product.id = this.#getId()
        const chkProduct = this.products.findIndex((producto) => producto.code === code)
        if (chkProduct === -1) {
            this.products.push(product)
        } else {
            console.log('Ya existe un producto con ese codigo')
            return
        }
    }

    getProducts() {
        console.log(this.products)
    }

    getProductById(idProd) {
        const producto = this.products.findIndex((item) => item.id === idProd)
        if (producto >= 0) {
            console.log(this.products[producto])
            return
        }
        console.log('Not Found')
    }

    #getId() {
        const oldID = this.#idProduct
        this.#idProduct += 1
        return oldID;
    }
}

const pm = new ProductManager()
pm.getProducts()
pm.addProduct('remera','remera de algodon blanca', 1500, 'sin imagen', 12870001, 20)
pm.addProduct('Patalon','Pantalon de Jean', 3500, 'sin imagen', 12870002, 10)
pm.addProduct('Patalon','Pantalon de Jean', 3500, 'sin imagen', 12870002, 10)
pm.getProducts()
pm.getProductById(2)
pm.getProductById(5)