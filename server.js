/*
    ========================================
    🎁 BMS STUDIO SAWERIA - Server
    ========================================
*/

const express = require('express')
const app = express()
app.use(express.json())

let donasi = []
let topDonatur = {}

app.post('/webhook', (req, res) => {
    const nama = req.body.donator_name || "Anonim"
    const jumlah = req.body.amount || 0
    const pesan = req.body.message || ""
    
    donasi.push({ nama, jumlah, pesan, waktu: Date.now() })
    
    if (!topDonatur[nama]) topDonatur[nama] = 0
    topDonatur[nama] += jumlah
    
    console.log(`💰 ${nama} - Rp${jumlah}`)
    res.send("OK")
})

app.get('/cek', (req, res) => {
    let data = [...donasi]
    donasi = []
    res.json(data)
})

// UNLIMITED top donatur (tidak dibatasi 10)
app.get('/top', (req, res) => {
    let sorted = Object.entries(topDonatur)
        .map(([nama, total]) => ({ nama, total }))
        .sort((a, b) => b.total - a.total)
    
    res.json(sorted)
})

app.get('/test', (req, res) => {
    const names = ["Budi", "Ani", "Caca", "Doni", "Eka", "Fira", "Gani", "Hani"]
    const nama = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100)
    const jumlah = Math.floor(Math.random() * 100000) + 5000
    
    donasi.push({ nama, jumlah, pesan: "Test!", waktu: Date.now() })
    if (!topDonatur[nama]) topDonatur[nama] = 0
    topDonatur[nama] += jumlah
    
    res.send(`OK! ${nama} Rp${jumlah}`)
})

app.get('/reset', (req, res) => {
    topDonatur = {}
    donasi = []
    res.send("Reset!")
})

app.get('/', (req, res) => {
    res.json({ status: "BMS STUDIO SAWERIA", donatur: Object.keys(topDonatur).length })
})

app.listen(process.env.PORT || 3000)
