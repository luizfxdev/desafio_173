// Configuração e animação do background
class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById('background-canvas')
    if (!this.canvas) {
      console.error('Canvas não encontrado!')
      return
    }
    this.ctx = this.canvas.getContext('2d')
    this.noise = new SimplexNoise()
    // Constantes matemáticas
    this.TAU = Math.PI * 2
    this.THIRD = 1 / 3
    this.TWO_THIRDS = 2 / 3
    this.ZERO = 0
    this.ONE = 1
    this.setupCanvas()
    this.startAnimation()
    // Redimensionar canvas quando a janela muda de tamanho
    window.addEventListener('resize', () => this.setupCanvas())
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.width_half = this.width / 2
    this.height_half = this.height / 2
  }

  // Função para mapear valores de um intervalo para outro
  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

  // Função para criar cor HSL
  hsl(h, s, l, a = 1) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`
  }

  draw(timestamp) {
    // Limpar canvas
    this.ctx.clearRect(0, 0, this.width, this.height)
    const time = timestamp * 0.001
    const xCount = 40
    const yCount = 60
    const iXCount = 1 / (xCount - 1)
    const iYCount = 1 / (yCount - 1)
    const timeStep = 0.01

    // Criar gradiente linear com transição suave
    const grad = this.ctx.createLinearGradient(0, 0, this.width, this.height)
    const t = time % 1
    const tSide = Math.floor(time % 2) === 0
    const hueA = tSide ? 340 : 210
    const hueB = !tSide ? 340 : 210

    const colorA = this.hsl(hueA, 100, 50)
    const colorB = this.hsl(hueB, 100, 50)

    grad.addColorStop(this.map(t, 0, 1, this.THIRD, this.ZERO), colorA)
    grad.addColorStop(this.map(t, 0, 1, this.TWO_THIRDS, this.THIRD), colorB)
    grad.addColorStop(this.map(t, 0, 1, this.ONE, this.TWO_THIRDS), colorA)

    // Background base
    this.ctx.fillStyle = '#27272c'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Definir alpha variável
    this.ctx.globalAlpha = this.map(Math.cos(time), -1, 1, 0.15, 0.3)
    this.ctx.fillStyle = grad
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalAlpha = 1

    // Desenhar ondas
    this.ctx.beginPath()
    let currentTime = time
    for (let j = 0; j < yCount; j++) {
      const tj = j * iYCount
      const c = Math.cos(tj * this.TAU + time) * 0.1

      for (let i = 0; i < xCount; i++) {
        const t = i * iXCount
        const n = this.noise.noise3D(t, currentTime, c)
        const y = n * this.height_half + this.height_half
        const x = t * this.width // Mudança aqui: usando width diretamente

        if (i === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      currentTime += timeStep
    }
    // Efeitos de composição
    this.ctx.globalCompositeOperation = 'lighter'
    this.ctx.filter = 'blur(10px)'
    this.ctx.strokeStyle = grad
    this.ctx.lineWidth = 5
    this.ctx.stroke()

    this.ctx.filter = 'none'
    this.ctx.strokeStyle = this.hsl(0, 0, 100, 0.8)
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    // Resetar configurações
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.filter = 'none'
  }

  startAnimation() {
    const animate = timestamp => {
      this.draw(timestamp)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }
}

// Inicializar animação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que todos os scripts foram carregados
  setTimeout(() => {
    if (window.SimplexNoise) {
      new BackgroundAnimation()
      console.log('Animação de background iniciada!')
    } else {
      console.error('SimplexNoise não está disponível!')
    }
  }, 100)
})
