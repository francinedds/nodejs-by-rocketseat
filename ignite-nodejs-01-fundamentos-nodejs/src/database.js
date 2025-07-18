// Importa o módulo 'fs/promises' do Node.js para trabalhar com o sistema de arquivos de forma assíncrona
import fs from 'node:fs/promises'

// Define o caminho para o arquivo db.json, que atua como banco de dados
const databasePath = new URL('../db.json', import.meta.url)

// Classe que simula um banco de dados simples baseado em um arquivo JSON
export class Database {
  // Atributo privado que armazena os dados em memória
  #database = {}

  // Construtor: ao instanciar a classe, tenta ler o conteúdo do db.json
  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        // Se o arquivo existir, os dados são carregados para memória
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        // Se o arquivo não existir ou houver erro, cria um -novo arquivo- com estrutura vazia
        this.#persist()
      })
  }

  // #persist é um método privado para salvar os dados da memória no arquivo JSON
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  // Método para BUSCAR registros em uma tabela
  // Pode receber um filtro de busca (search) como objeto com chave-valor
  select(table, search) {
    // Pega os dados da tabela especificada ou um array vazio, caso não exista
    let data = this.#database[table] ?? []

    // Se houver filtros de busca, aplica um filtro nos dados
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    // Retorna os dados encontrados
    return data
  }

  // Método para INSERIR um novo registro em uma tabela
  insert(table, data) {
    // Se a tabela já existir, insere o dado; senão, cria uma nova tabela com esse dado
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    // Persiste as alterações no arquivo
    this.#persist()

    return data
  }

  // Método para ATUALIZAR um registro existente em uma tabela, baseado no ID
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      // Atualiza o registro mantendo o ID original
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }

  // Método para DELETAR um registro de uma tabela com base no ID
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      // Remove o registro da lista
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}

