/*
    ========================================
    🎁 BMS STUDIO SAWERIA - Premium Server
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
let recentDonations = []

app.post('/webhook', (req, res) => {
    const nama = req.body.donator_name || "Anonim"
    const jumlah = req.body.amount || 0
    const pesan = req.body.message || ""
    const waktu = Date.now()
    
    donasi.push({ nama, jumlah, pesan, waktu })
    
    if (!topDonatur[nama]) topDonatur[nama] = { total: 0, count: 0, lastDonation: 0 }
    topDonatur[nama].total += jumlah
    topDonatur[nama].count += 1
    topDonatur[nama].lastDonation = waktu
    
    totalDonasi += jumlah
    
    // Keep last 50 donations
    recentDonations.unshift({ nama, jumlah, pesan, waktu })
    if (recentDonations.length > 50) recentDonations.pop()
    
    console.log(`💰 ${nama} - Rp${jumlah}`)
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
            count: data.count,
            lastDonation: data.lastDonation
        }))
        .sort((a, b) => b.total - a.total)
    
    res.json(sorted)
})

app.get('/stats', (req, res) => {
    res.json({
        totalDonasi,
        totalDonatur: Object.keys(topDonatur).length,
        recentDonations: recentDonations.slice(0, 10)
    })
})

app.get('/test', (req, res) => {
    const names = ["Rizky", "Andi", "Sari", "Budi", "Maya", "Dika", "Putri", "Fajar", "Luna", "Reza"]
    const messages = ["Semangat!", "GG bang!", "Lanjutkan!", "Mantap!", "Keep it up!", ""]
    const nama = names[Math.floor(Math.random() * names.length)]
    const jumlah = Math.floor(Math.random() * 150000) + 5000
    const pesan = messages[Math.floor(Math.random() * messages.length)]
    const waktu = Date.now()
    
    donasi.push({ nama, jumlah, pesan, waktu })
    
    if (!topDonatur[nama]) topDonatur[nama] = { total: 0, count: 0, lastDonation: 0 }
    topDonatur[nama].total += jumlah
    topDonatur[nama].count += 1
    topDonatur[nama].lastDonation = waktu
    
    totalDonasi += jumlah
    recentDonations.unshift({ nama, jumlah, pesan, waktu })
    
    res.send(`✅ ${nama} donated Rp${jumlah.toLocaleString()}`)
})

app.get('/reset', (req, res) => {
    topDonatur = {}
    donasi = []
    totalDonasi = 0
    recentDonations = []
    res.send("Reset complete!")
})

app.get('/', (req, res) => {
    res.json({ 
        name: "BMS STUDIO SAWERIA",
        status: "Active",
        totalDonatur: Object.keys(topDonatur).length,
        totalDonasi
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("🎁 BMS STUDIO SAWERIA - Server Running!")
})
