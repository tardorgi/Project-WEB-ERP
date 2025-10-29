const menus = [
  {
    title: 'Cadastro',
    icon: 'cadastro.png',
    items: [
      { label: 'Empresa', route: 'empresa' },
      { label: 'Funcionário/ Representante', route: 'funcionario-representante' },
      { label: 'Tipo de Movimento', route: 'tipo-movimento' },
      { label: 'Condição de Pagamento', route: 'condicao-pagamento' },
      { label: 'Grupo', route: 'grupo' },
      { label: 'Subgrupo', route: 'subgrupo' },
      { label: 'Carteira', route: 'carteira' },
      { label: 'Centro de Custo', route: 'centro-custo' },
      { label: 'Loteamento', route: 'loteamento' },
      { label: 'Loteamento - Lotes', route: 'loteamento-lotes' },
      { label: 'Região/Setor', route: 'regiao-setor' },
    ],
  },
  {
    title: 'Pessoa JF',
    icon: 'pessoa_jf.png',
    items: [
      { label: 'Cadastro de Pessoa JF', route: 'cadastro-pessoa-jf' },
    ],
  },
  {
    title: 'Contas a Receber',
    icon: 'cr.png',
    items: [
      { label: 'Cadastro de Documento', route: 'cr-cadastro-documento' },
    ],
  },
  {
    title: 'Contas a Pagar',
    icon: 'cp.png',
    items: [
      { label: 'Cadastro de Documento', route: 'cp-cadastro-documento' },
    ],
  },
  {
    title: 'Material',
    icon: 'material.png',
    items: [
      { label: 'Cadastro de Material', route: 'cadastro-material' },
      { label: 'Ordem de Produção', route: 'ordem-producao' },
      { label: 'Recebimento de Material', route: 'recebimento-material' },
    ],
  },
  {
    title: 'Faturamento',
    icon: 'faturamento.png',
    items: [
      { label: 'Faturamento', route: 'faturamento' },
      { label: 'Carteira de Pedido', route: 'carteira-pedido' },
      { label: 'Orçamento de Venda', route: 'orcamento-venda' },
    ],
  }
];
export default menus;