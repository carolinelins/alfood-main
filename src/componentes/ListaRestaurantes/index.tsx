import { TextField } from '@mui/material'
import axios, { AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { IPaginacao } from '../../interfaces/IPaginacao'
import IRestaurante from '../../interfaces/IRestaurante'
import style from './ListaRestaurantes.module.scss'
import Restaurante from './Restaurante'

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState('')
  const [paginaAnterior, setPaginaAnterior] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    }

    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }, [busca])

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <TextField
      value={busca}
      onChange={evento => setBusca(evento.target.value)}
      label="Buscar restaurante"
      variant="standard"
    />
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {<button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
      Página Anterior
    </button>}
    {<button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
      Próxima página
    </button>}
  </section>)
}

export default ListaRestaurantes