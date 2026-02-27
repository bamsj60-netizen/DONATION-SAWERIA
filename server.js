/*
    ========================================
    🎁 BMS STUDIO SAWERIA - Fixed V2
    ========================================
    Credit: BMS STUDIO SAWERIA
    ========================================
*/

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let donasi = []
let topDonatur = {}
let totalDonasi = 0
let lastRawData = null // Simpan data mentah untuk debug

app.post('/webhook', (req, res) => {
    // Simpan data mentah
    lastRawData = req.body
    console.log("📦 RAW DATA:", JSON.stringify(req.body, null, 2))
    
    const body = req.body
    
    // Coba semua kemungkinan field dari Saweria
    const nama = body.donator_name 
        || body.donatorName 
        || body.empiId
        || body.name 
        || body.sender
        || body.from
        || "Anonim"
    
    // PENTING: Convert ke number dan coba berbagai field
    let jumlah = 0
    
    if (body.amount) jumlah = Number(body.amount)
    else if (body.total) jumlah = Number(body.total)
    else if (body.amount_raw) jumlah = Number(body.amount_raw)
    else if (body.donation) jumlah = Number(body.donation)
    else if (body.value) jumlah = Number(body.value)
    else if (body.price) jumlah = Number(body.price)
    
    // Jika masih 0, coba cari di nested object
    if (jumlah === 0 && body.data) {
        jumlah = Number(body.data.amount) || Number(body.data.total) || 0
    }
    
    const pesan = body.message 
        || body.msg 
        || body.note
        || body.text
        || ""
    
    console.log(`💰 PARSED: ${nama} - Rp${jumlah} - "${pesan}"`)
    
    const waktu = Date.now()
    
    donasi.push({ nama, jumlah, pesan, waktu })
    
    if (!topDonatur[nama]) {
        topDonatur[nama] = { total: 0, count: 0 }
    }
    topDonatur[nama].total += jumlah
    topDonatur[nama].count += 1
    
    totalDonasi += jumlah
    
    res.status(200).send("OK")
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

// DEBUG - Lihat data mentah terakhir dari Saweria
app.get('/raw', (req, res) => {
    res.json({
        message: "Data mentah terakhir dari Saweria:",
        data: lastRawData
    })
})

app.get('/debug', (req, res) => {
    res.json({
        pendingDonasi: donasi,
        topDonatur,
        totalDonasi,
        lastRawData
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
    lastRawData = null
    res.send("Reset berhasil!")
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
