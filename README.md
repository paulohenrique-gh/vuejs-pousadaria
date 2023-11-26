# Pousadaria

Aplicação front-end em Vue.js que consome dados da API do [projeto Pousadaria em Ruby on Rails](https://github.com/paulohenrique-gh/rails-pousadaria)

## Listagem de pousadas

As pousadas são listadas ao iniciar a aplicação, cada uma com um botão que carrega seus detalhes

Endpoint utilizado:
- ```/guesthouses```

## Detalhes de uma pousada

Ao clicar no botão de uma pousada, seus detalhes são carregados e incluem um botão para carregar seus quartos

Endpoints utilizados:
- ```/guesthouses/:guesthouse_id```
- ```/guesthouses/:guesthouse_id/rooms```

## Busca de pousadas

A qualquer momento, é possível utilizar o campo de buscas para pesquisar pousadas pelo nome. As pousadas são carregadas como na listagem inicial, mas são filtradas de acordo com o termo de busca utilizado. O botão "Carregar todas" volta a exibir todas as pousadas disponíveis

Endpoint utilizado:
- ```/guesthouses```

Parâmetro:
- ```search```

## Consulta de disponibilidade de um quarto

A listagem de quartos disponível no botão "Carregar quartos" nos detalhes de uma pousada inclui formulários para consultar a disponibilidade de cada quarto no período informado

Endpoint utilizado:
- ```/api/v1/rooms/:room_id/check_availability```

Parâmetros:
- ```checkin```
- ```checkout```
- ```guest_count```