

const sketch = (p) => {
    let socket
    let player
    let allPlayers = {}
    
    p.setup = () => {
        p.createCanvas(800, 600)
        socket = io()
        socket.on('connect', () =>{
            console.log("Connected")
        })
        socket.on("updatePlayers", (players) => {
            allPlayers = players
        })

        player = new p.Sprite()
        player.width = 50
        player.height = 25
        player.collider = 'd'
        player.color = 'red'
    }
    p.draw = () => {
        p.background(200)

        if(p.keyIsDown(87)){
            if(slowed){
                if(player.speed < 1){
                    player.speed += (20/120)
                }
            } else {
                if (player.speed < 3){
                    player.speed += (45/120)
                }
            }
            player.direction = player.rotation
        }
        if (p.keyIsDown(83)){
            if (player.speed > 0){
                player.drag = 10
                player.friction = 10
                player.direction = player.rotation
            }
        } else {
            player.drag = 5
            player.friction = 5
        }
        socket.emit('playerUpdate', {
            x: player.x,
            y: player.y,
            speed: player.speed,
            direction: player.direction
        })

        for (let id in allPlayers){
            if (id !== socket.id){
                let others = allPlayers[id]
                let otherPlayers = p.Sprite(others.x, others.y, 50, 50,)
                otherPlayers.collider = 'd'
            }
        }

        p.drawSprites()
    }
}

new p5(sketch)