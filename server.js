const express = require('express')
const app = express()
app.use(express.json())

let donasi = []

// Terima dari Saweria
app.post('/webhook', (req, res) => {
    donasi.push({
        nama: req.body.donator_name || "Anonim",
        jumlah: req.body.amount || 0,
        pesan: req.body.message || ""
    })
    res.send("OK")
})

// Roblox ambil data
app.get('/cek', (req, res) => {
    let data = [...donasi]
    donasi = []
    res.json(data)
})

// Test donasi (buka di browser buat test)
app.get('/test', (req, res) => {
    donasi.push({ nama: "TestUser", jumlah: 10000, pesan: "Halo bang!" })
    res.send("Test donasi ditambahkan! Cek di Roblox")
})

app.listen(process.env.PORT || 3000)
