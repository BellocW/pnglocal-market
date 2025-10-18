const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static('public'));

// Ensure images folder exists
const imagesDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix);
    }
});
const upload = multer({ storage: storage });

// Helper: Read products.json safely
function readProductsFile() {
    try {
        if (!fs.existsSync('products.json')) return [];
        const data = fs.readFileSync('products.json', 'utf8');
        if (!data) return [];
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products.json:', err);
        return [];
    }
}

// Route: Get all products
app.get('/products', (req, res) => {
    const products = readProductsFile();
    res.json(products);
});

// Route: Add a new product
app.post('/upload', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ message: 'Name, description, and price are required' });
    }

    const image = req.file ? `/images/${req.file.filename}` : '';

    const newProduct = { id: Date.now(), name, description, price, image };

    const products = readProductsFile();
    products.push(newProduct);

    fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Error writing products.json:', err);
            return res.status(500).send('Error saving product');
        }
        res.json({ message: 'Product added successfully', product: newProduct });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
