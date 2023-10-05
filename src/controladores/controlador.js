let { banco, contas, saques, depositos, transferencias } = require('../bancodedados')

const verificarSenhaBanco = (req, res, next) => {
    const senhaInformada = req.query.senha_banco

    if (!senhaInformada) {
        res.status(401).json({ "mensagem": "A senha do banco precisa ser informada na URL (/contas?senha_banco=*SENHA*)" })
    }

    if (senhaInformada === "Cubos123Bank") {
        next()
    } else {
        res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    }
}

const listarContas = (req, res) => {
    return res.status(200).json(contas)
}

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório' })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' })
    }

    const cpfExistente = contas.some(conta => conta.usuario.cpf === cpf)
    const emailExistente = contas.some(conta => conta.usuario.email === email)

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF ou e-mail informado.' })
    }

    const novaConta = {
        numero: contas.length + 1,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(novaConta)

    return res.status(201).send()

}

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' })
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório' })
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' })
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório' })
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório' })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' })
    }

    const cpfExistente = contas.some(conta => conta.usuario.cpf === cpf)
    const emailExistente = contas.some(conta => conta.usuario.email === email)

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF ou e-mail informado.' })
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    conta.usuario.nome = nome
    conta.usuario.cpf = cpf
    conta.usuario.data_nascimento = data_nascimento
    conta.usuario.telefone = telefone
    conta.usuario.email = email
    conta.usuario.senha = senha

    return res.status(204).send()

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    if (conta.saldo !== 0) {
        return res.status(404).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' })
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta)
    })

    return res.status(204).send()
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor não pode ser negativo ou zerado!' })
    }

    if (!valor || !numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' })
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    conta.saldo += valor

    const deposito = {
        data: new Date(),
        numero_conta,
        valor
    }

    depositos.push(deposito)

    return res.status(204).send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor não pode ser negativo ou zerado!' })
    }

    if (!valor || !numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' })
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    if (senha !== Number(conta.usuario.senha)) {
        return res.status(401).json({ mensagem: 'Senha da conta incorreta' })
    }

    conta.saldo -= valor

    const saque = {
        data: new Date(),
        numero_conta,
        valor
    }

    saques.push(saque)

    return res.status(204).send()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!valor || !numero_conta_origem || !senha || !numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O número da conta (de destino e de origem), valor e senha são obrigatórios!' })
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada' })
    }

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada' })
    }

    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'O valor não pode ser negativo ou zerado!' })
    }

    if (contaOrigem.usuario.senha != senha) {
        return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' })
    }

    if (contaOrigem.saldo - valor < 0) {
        return res.status(404).json({ mensagem: 'Saldo insuficiente!' })
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const transferencia = {
        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(transferencia)

    return res.status(204).send()
}

const saldo = (req, res) => {
    const numeroConta = req.query.numero_conta
    const senhaConta = req.query.senha

    if (!senhaConta || !numeroConta) {
        return res.status(401).json({ message: 'A senha e o numero da conta são obrigatórios!' })
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    if (conta.usuario.senha != senhaConta) {
        return res.status(401).json({ message: 'A senha da conta informada é inválida!' })
    }

    return res.status(200).json({ "saldo": conta.saldo })
}

const extrato = (req, res) => {
    const numeroConta = req.query.numero_conta
    const senhaConta = req.query.senha

    if (!senhaConta || !numeroConta) {
        return res.status(401).json({ message: 'A senha e o numero da conta são obrigatórios!' })
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' })
    }

    if (conta.usuario.senha != senhaConta) {
        return res.status(401).json({ message: 'A senha da conta informada é inválida!' })
    }

    const extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }

    for (let i = 0; i < depositos.length; i++) {
        if (Number(numeroConta) == depositos[i].numero_conta) {
            extrato.depositos.push(depositos[i])
        }
    }

    for (let i = 0; i < saques.length; i++) {
        if (Number(numeroConta) == saques[i].numero_conta) {
            extrato.saques.push(saques[i])
        }
    }

    for (let i = 0; i < transferencias.length; i++) {
        if (Number(numeroConta) == transferencias[i].numero_conta_origem) {
            extrato.transferenciasEnviadas.push(transferencias[i])
        }
        if (Number(numeroConta) == transferencias[i].numero_conta_destino) {
            extrato.transferenciasRecebidas.push(transferencias[i])
        }
    }

    return res.status(200).json(extrato)
}

module.exports = {
    verificarSenhaBanco,
    listarContas,
    cadastrarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}



// fazer um for no deposito e dar push no extrato.depositos.push() (pro saque também)
// 