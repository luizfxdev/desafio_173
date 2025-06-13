// Função principal para decifrar as notas musicais
function decipherMusicalNotes(notes) {
  // Verifica se o array de notas está vazio
  if (!notes || notes.length === 0) {
    return { melody: '', steps: 'Nenhuma nota fornecida para decifrar.' }
  }

  let melody = ''
  let steps = 'Passo a passo:\n'
  let groupCount = 0

  // Processa cada nota no array
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]

    // Verifica se a nota é válida (entre 1 e 26)
    if (note < 1 || note > 26) {
      steps += `Nota ${note} na posição ${i + 1} é inválida (deve ser entre 1 e 26). Ignorando...\n`
      continue
    }

    // Calcula a letra correspondente (A=1, B=2, ..., Z=26)
    const letter = String.fromCharCode(64 + note)

    // Adiciona a letra ao grupo atual
    if (groupCount === 0) {
      melody += letter
      steps += `- Nota ${note} → '${letter}' (início de novo grupo)\n`
    } else {
      melody += letter
      steps += `- Nota ${note} → '${letter}'\n`
    }

    groupCount++

    // Adiciona espaço após cada grupo de 3 notas
    if (groupCount === 3) {
      melody += ' '
      groupCount = 0
      steps += `→ Grupo completo. Adicionando espaço.\n`
    }
  }

  // Remove espaços extras no final
  melody = melody.trim()

  return { melody, steps }
}

// Função para converter string de entrada em array de números
function parseInput(input) {
  // Remove espaços e divide por vírgulas
  const parts = input.replace(/\s/g, '').split(',')
  const notes = []

  // Converte cada parte para número
  for (const part of parts) {
    if (part === '') continue
    const num = parseInt(part, 10)
    if (!isNaN(num)) {
      notes.push(num)
    }
  }

  return notes
}

// Função para atualizar a interface com o resultado
function updateResult(result, steps) {
  const resultOutput = document.getElementById('result-output')
  const calculationSteps = document.getElementById('calculation-steps')

  resultOutput.textContent = result || 'Nenhum resultado para exibir.'
  calculationSteps.textContent = steps || ''
}

// Aguardar o carregamento do DOM antes de adicionar os event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Evento de clique no botão DECIFRAR
  document.getElementById('decipher-btn').addEventListener('click', () => {
    const input = document.getElementById('notes-input').value
    const notes = parseInput(input)

    const { melody, steps } = decipherMusicalNotes(notes)
    updateResult(melody, steps)
  })

  // Evento de clique no botão RETORNAR
  document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('notes-input').value = ''
    updateResult('', '')
  })

  // Permite pressionar Enter no input para decifrar
  document.getElementById('notes-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      document.getElementById('decipher-btn').click()
    }
  })
})
