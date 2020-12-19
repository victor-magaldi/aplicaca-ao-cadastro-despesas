class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
    }
}

class Bd{
    // JSON.stringfy(objetoliteral) => vai passar o objeto json para um objeto literal
    //JSON.parse(produtoJSON)=>vai passar um objeto literal para um json
    constructor(){
        let id= localStorage.getItem('id') // null

        if(id===null){
            localStorage.setItem('id',0)
        }
    }
    getproximoId(){
        let proximoId= localStorage.getItem('id') // null
        return parseInt(proximoId) + 1
    }
    gravar(d){
        let id = this.getproximoId()
        localStorage.setItem(id,JSON.stringify(d))
        localStorage.setItem('id',id)
    }
    recuperarTodosRegistros(){
        //array de despesas 
        let despesas = [];

        let id = localStorage.getItem('id')
        localStorage.getItem('id')
        //recuperar todas despesas cadastradas 
        for(let i=1; i<=id; i++){
            let despesa= JSON.parse(localStorage.getItem(i))

            // existe possibilidade de indices que foram removidos, o continue vai evitar fazer com que acione a proxima iteração
            if(despesa===null){
                continue
            }
            despesa.id = i;
            despesas.push(despesa)
        }
        return despesas;
    }
    pesquisar(despesa){
        let despesasFiltradas = [];
        despesasFiltradas = this.recuperarTodosRegistros();
        console.log(despesa)
        console.log(despesasFiltradas)

        //ano 
        if(despesa.ano !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.mes == despesa.mes)
        }
        //dia 
        if(despesa.dia !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.dia == despesa.dia)
        }
        //tipo 
        if(despesa.tipo !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.tipo == despesa.tipo)
        }

        //descricao
        if(despesa.descricao !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.descricao == despesa.descricao)
        }

        //valor 
        if(despesa.descricao !=""){
            despesasFiltradas = despesasFiltradas.filter(d=> d.descricao == despesa.descricao)
        }
        return despesasFiltradas;
    }
    remover(id){
        localStorage.removeItem(id)

    }
}

let bd = new Bd()


function cadastrarDespesa (){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value, 
        dia.value,
        tipo.value,
        descricao.value, 
        valor.value
    )
    if ( despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = "Registro inserido com sucesso"
        document.getElementById('modal_titulo_div').className ='modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = "despesa cadastrada com sucesso"
        document.getElementById('modal_btn').innerHTML = " Voltar"
        document.getElementById('modal_btn').className =  "btn btn-success"


        $('#erroGravacao').modal('show');
        // limpa os campos da despesa quando cadastrada
        ano.value =""
        mes.value =""
        dia.value =""
        tipo.value =""
        descricao.value =""
        valor.value =""


    }else{
        document.getElementById('modal_titulo').innerText = "Erro na inclusão de registro"
        document.getElementById('modal_titulo_div').className ='modal-header text-danger'
        document.getElementById('modal_conteudo').innerText = "Erro na gravação, Verifique se todos os campos obrigatorios foram preenchidos"
        document.getElementById('modal_btn').innerHTML = " Voltar e corrigir"
        document.getElementById('modal_btn').className =  "btn btn-danger"

        $('#erroGravacao').modal('show')
    }
}

function carregaListaDespesas(despesas = Array()){    

    if(despesas.length == 0){
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemento tbody
    var listaDespesas = document.getElementById('listaDespesas')
    
    //apaga os elementos da tabela 
    listaDespesas.innerHTML = ""


/*
                <tr>
                <td>15/03</td>
                <td>alimentacao</td>
                <td>compras do mes</td>
                <td>442.8</td>
                </tr>
*/
    // percorre o array despesas, listando cada despesa da forma dinamica
    despesas.forEach(function(d){
        //criando linhas(tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML=`${d.dia}/0${d.mes}/${d.ano}`
       

        //ajustando o tipo 
        switch(parseInt(d.tipo)){
            case 1: d.tipo = "Alimentação"
            break
            case 2: d.tipo = "Educação"
            break
            case 2: d.tipo = "Lazer "
            break
            case 4: d.tipo = "Saúde"
            break
            case 5: d.tipo = "Transporte"
            break
        }
        linha.insertCell(1).innerHTML=d.tipo
        linha.insertCell(2).innerHTML=d.descricao
        linha.insertCell(3).innerHTML=d.valor

        //cria botao de exclusao
        let btn = document.createElement("button")
        btn.className="btn btn-danger "
        btn.innerHTML="<i class='fas fa-times'></i>"
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            // remover despesa
            
            let id = this.id.replace("id_despesa_","")
            
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)

    })

}
function pesquisarDespesas(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor);
    
    let despesas = bd.pesquisar(despesa)
    console.log(despesas)
    
    carregaListaDespesas(despesas);
    
}