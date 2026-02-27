/*
    ========================================
    🎁 BMS STUDIO SAWERIA - Server
    ========================================
    Credit: BMS STUDIO SAWERIA
    ========================================
*/

const express = require('express')
const app = express()
app.use(express.json())

let donasi = []
let topDonatur = {}

// Terima webhook dari Saweria
app.post('/webhook', (req, res) => {
    const nama = req.body.donator_name || "Anonim"
    const jumlah = req.body.amount || 0
    const pesan = req.body.message || ""
    
    // Simpan donasi baru
    donasi.push({ nama, jumlah, pesan, waktu: Date.now() })
    
    // Update top donatur
    if (!topDonatur[nama]) {
        topDonatur[nama] = 0
    }
    topDonatur[nama] += jumlah
    
    console.log(`💰 ${nama} donasi Rp${jumlah}`)
    res.send("OK")
})

// Roblox ambil donasi baru
app.get('/cek', (req, res) => {
    let data = [...donasi]
    donasi = []
    res.json(data)
})

// Roblox ambil top donatur
app.get('/top', (req, res) => {
    // Sort dan ambil top 10
    let sorted = Object.entries(topDonatur)
        .map(([nama, total]) => ({ nama, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
    
    res.json(sorted)
})

// Test donasi
app.get('/test', (req, res) => {
    const nama = "Tester" + Math.floor(Math.random() * 100)
    const jumlah = Math.floor(Math.random() * 50000) + 5000
    
    donasi.push({ nama, jumlah, pesan: "Test donasi!", waktu: Date.now() })
    
    if (!topDonatur[nama]) topDonatur[nama] = 0
    topDonatur[nama] += jumlah
    
    res.send(`Berhasil! ${nama} donasi Rp${jumlah}`)
})

// Reset top donatur
app.get('/reset', (req, res) => {
    topDonatur = {}
    donasi = []
    res.send("Reset berhasil!")
})

app.get('/', (req, res) => {
    res.json({
        status: "BMS STUDIO SAWERIA - Active",
        endpoints: ["/webhook", "/cek", "/top", "/test", "/reset"]
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("🎁 BMS STUDIO SAWERIA Server Running!")
})
