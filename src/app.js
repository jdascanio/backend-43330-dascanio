import express from 'express';
import ProductManager from './productManager.js';

const app = express();
const pm = new ProductManager('./products.json')

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send('<p>Para testear deberás tipear en la url:</p><p><strong>/products?limit=</strong> y luego un numero para indicar el limite de productos a mostrar o <strong>/products</strong> para mostrar el listado completo</p><p><strong>/products/</strong> y el número de id del producto a mostrar</p>')
})

app.get("/products", async (req, res) => {
    try {
        let productos = await pm.getProducts()
        let limit = req.query.limit
        if (!limit || parseInt(limit) >= productos.length) {
            res.send(productos)
        } else if (parseInt(limit) <= 0) {
            res.send('<h4 style="color: red; text-transform: uppercase"> el limite de productos no puede ser igual o menor a cero</h4>')
        } else if (isNaN(+limit)) {
            res.send(`Seleccione un número entre 0 y ${productos.length} para limitar la cantidad de productos mostrados`)
        } else {
            let newProductList = productos.splice(0, limit)
            res.send(newProductList)
        }
    }
    catch (err) {
        res.send(err)
    }
})
app.get("/products/:pid", async (req, res) => {
    try {
        let pid = req.params.pid
        let producto = await pm.getProductById(parseInt(pid))
        res.send(producto)

    } catch (err) {
        res.send(err)
    }
})

app.listen(8080, async () => {
    console.log('listening to port 8080')
})