export const TAXONOMY = {
    natureza_economica: [
        {
            label: 'Despesas Operacionais', children: [
                'Pessoal e encargos', 'Serviços de terceiros', 'Material de consumo',
                'Despesas administrativas', 'Despesas comerciais', 'Despesas pedagógicas',
                'Tecnologia e sistemas', 'Comunicação e marketing', 'Manutenção', 'Utilidades'
            ]
        },
        {
            label: 'Despesas Não Operacionais', children: [
                'Multas', 'Juros e encargos financeiros', 'Perdas extraordinárias',
                'Baixas contábeis', 'Ajustes não recorrentes'
            ]
        },
        {
            label: 'Despesas Financeiras', children: [
                'Juros de empréstimos', 'IOF', 'Tarifas bancárias',
                'Descontos concedidos', 'Encargos sobre parcelamentos'
            ]
        }
    ],
    funcao_cc: [
        { label: 'PAIDEIA', children: ['Infantil', 'Fundamental 1', 'Fundamental 2', 'Ensino Médio', 'Coordenação Pedagógica'] },
        { label: 'OIKOS', children: ['Formação de Pais', 'Eventos Família', 'Material Oikos'] },
        { label: 'BIBLOS', children: ['Treinamento Líderes', 'Material Teológico', 'Cursos Bíblicos'] },
        { label: 'CVE (Cidade Viva Education)', children: ['Administrativo Geral', 'Comercial/Marketing', 'Expansão', 'Tecnologia/ERP'] }
    ],
    comportamento: ['Fixas', 'Variáveis', 'Semi-variáveis'],
    temporalidade: ['Recorrentes mensais', 'Recorrentes anuais', 'Sazonais', 'Não recorrentes', 'Investimentos pontuais'],
    finalidade_estrategica: [
        'Despesas de manutenção', 'Despesas de crescimento', 'Despesas de inovação',
        'Despesas missionais', 'Despesas regulatórias', 'Despesas obrigatórias', 'Despesas discricionárias'
    ],
    classificacao_contabil: [
        'Custos diretos', 'Custos indiretos', 'Despesas administrativas',
        'Despesas comerciais', 'Despesas gerais', 'Despesas financeiras',
        'Provisões', 'Depreciação', 'Amortização', 'Exaustão'
    ],
    natureza_gasto: [
        { label: 'Pessoas', children: ['Salários', 'Pró-labore', 'Bolsas', 'Autônomos', 'INSS', 'FGTS', 'Férias', '13º', 'Rescisões'] },
        { label: 'Serviços', children: ['Consultorias', 'Assessoria jurídica', 'Contabilidade', 'Marketing', 'Tecnologia', 'Design', 'Impressão'] },
        { label: 'Infraestrutura', children: ['Aluguel', 'Condomínio', 'Energia', 'Água', 'Internet', 'Manutenção predial'] },
        { label: 'Tecnologia', children: ['Licenças SaaS', 'Desenvolvimento', 'Servidores', 'ERP', 'BI'] },
        { label: 'Operacional', children: ['Fretes', 'Correios', 'Embalagens', 'Armazenagem'] },
        { label: 'Financeiro', children: ['Juros', 'Multas', 'Tarifas', 'IOF'] }
    ],
    orcamento_educacional: [
        'Desenvolvimento de conteúdo', 'Direitos autorais', 'Revisão técnica',
        'Diagramação', 'Ilustração', 'Impressão', 'Plataforma digital',
        'Formação continuada', 'Mentoria escolar', 'Eventos pedagógicos',
        'Suporte às escolas', 'Avaliação externa', 'Expansão comercial', 'Compliance educacional'
    ],
    grau_controle: ['Controláveis', 'Parcialmente controláveis', 'Não controláveis'],
    impacto_resultado: [
        'Impactam margem bruta', 'Impactam EBITDA',
        'Impactam lucro líquido', 'Impactam fluxo de caixa'
    ]
};
