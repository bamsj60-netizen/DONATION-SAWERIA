/*
    ========================================
    🎁 BMS STUDIO SAWERIA - Fixed Server
    ========================================
    Credit: BMS STUDIO SAWERIA
    ========================================
*/

const express = require('express')
const app = express()
app.use(express.json())

let donasi = []
let topDonatur = {}
let totalDonasi = 0

app.post('/webhook', (req, res) => {
    // Log untuk debug
    console.log("📦 Data masuk:", JSON.stringify(req.body))
    
    // Saweria bisa kirim dengan berbagai nama field
    const nama = req.body.donator_name 
        || req.body.donatorName 
        || req.body.name 
        || req.body.sender
        || "Anonim"
    
    const jumlah = req.body.amount 
        || req.body.total 
        || req.body.donation
        || req.body.value
        || 0
    
    const pesan = req.body.message 
        || req.body.msg 
        || req.body.note
        || ""
    
    const waktu = Date.now()
    
    console.log(`💰 Parsed: ${nama} - Rp${jumlah} - "${pesan}"`)
    
    donasi.push({ nama, jumlah, pesan, waktu })
    
    if (!topDonatur[nama]) {
        topDonatur[nama] = { total: 0, count: 0 }
    }
    topDonatur[nama].total += jumlah
    topDonatur[nama].count += 1
    
    totalDonasi += jumlah
    
    res.send("OK")
})

app.get('/cek', (req, res) => {
    let data = [...donasi]
    donasi = []
    res.json(data)
})

app.get('/top', (req, res) => {
    let sorted = Object.entries(topDonatur)
        .map(([nama, data]) => ({ 
            nama, 
            total: data.total,
            count: data.count
        }))
        .sort((a, b) => b.total - a.total)
    
    res.json(sorted)
})

app.get('/stats', (req, res) => {
    res.json({
        totalDonasi,
        totalDonatur: Object.keys(topDonatur).length
    })
})

// Debug endpoint - lihat data mentah terakhir
app.get('/debug', (req, res) => {
    res.json({
        pendingDonasi: donasi,
        topDonatur,
        totalDonasi
    })
})

app.get('/test', (req, res) => {
    const nama = "Tester" + Math.floor(Math.random() * 100)
    const jumlah = Math.floor(Math.random() * 50000) + 1000
    
    donasi.push({ nama, jumlah, pesan: "Test!", waktu: Date.now() })
    
    if (!topDonatur[nama]) {
        topDonatur[nama] = { total: 0, count: 0 }
    }
    topDonatur[nama].total += jumlah
    topDonatur[nama].count += 1
    totalDonasi += jumlah
    
    res.send(`✅ ${nama} - Rp${jumlah}`)
})

app.get('/reset', (req, res) => {
    topDonatur = {}
    donasi = []
    totalDonasi = 0
    res.send("Reset!")
})

app.get('/', (req, res) => {
    res.json({ 
        status: "BMS STUDIO SAWERIA",
        totalDonatur: Object.keys(topDonatur).length,
        totalDonasi
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("🎁 Server Running!")
})
