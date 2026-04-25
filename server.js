const { Server } = require("socket.io")

const PORT = process.env.PORT || 3001

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
})

let currentItems = []
let forcedIndex = null

io.on("connection", (socket) => {
  console.log("✅ connected:", socket.id)

  socket.emit("list:update", currentItems)

  socket.on("list:update", (list) => {
    currentItems = list
    io.emit("list:update", currentItems)
  })

  socket.on("admin:select", (index) => {
    forcedIndex = index
  })

  socket.on("spin", () => {
    if (!currentItems.length) return

    console.log("🎯 forcedIndex:", forcedIndex)

    let index

    if (
      forcedIndex !== null &&
      forcedIndex >= 0 &&
      forcedIndex < currentItems.length
    ) {
      index = forcedIndex
      console.log("🔥 ADMIN PICK:", index)
    } else {
      index = Math.floor(Math.random() * currentItems.length)
      console.log("🎲 RANDOM:", index)
    }

    // ❗ reset SAU khi dùng
    forcedIndex = null

    io.emit("spin:result", index)
  })
})