import { Game } from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'God of War Ragnarök',
    slug: 'god-of-war-ragnarok',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura', 'RPG'],
    rating: 4.9,
    ratingCount: 1420,
    downloadsCount: 38450,
    size: '84.2 GB',
    releaseDate: '2022-11-09',
    developer: 'Santa Monica Studio',
    region: 'GLOBAL (CUSA-34388)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-34388',
    description: 'Do Santa Monica Studio vem a sequência da aclamada versão de 2018 de God of War. O Fimbulwinter já começou. Kratos e Atreus devem viajar pelos Nove Reinos em busca de respostas enquanto as forças de Asgard se preparam para uma batalha profetizada que fim ao mundo.',
    downloadLinks: [
      { id: 'dl-1-1', label: 'Google Drive (Servidor Rápido)', url: 'https://drive.google.com/file/d/sample-gow-ragnarok', type: 'Google Drive' },
      { id: 'dl-1-2', label: 'MEGA.nz Mirror 1', url: 'https://mega.nz/file/sample-gow-ragnarok', type: 'MEGA' },
      { id: 'dl-1-3', label: 'Torrent (Magnet Link PKG)', url: 'magnet:?xt=urn:btih:gowragnarokps4pkg', type: 'Torrent' },
      { id: 'dl-1-4', label: '1Fichier Servidor Direto', url: 'https://1fichier.com/?gowragnarok', type: '1Fichier' }
    ],
    status: 'Active',
    featured: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'game-2',
    title: 'The Last of Us Part II',
    slug: 'the-last-of-us-part-2',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura', 'Terror'],
    rating: 4.8,
    ratingCount: 2310,
    downloadsCount: 52100,
    size: '78.5 GB',
    releaseDate: '2020-06-19',
    developer: 'Naughty Dog',
    region: 'USA (CUSA-07820)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '7.55 / 9.00 / 11.00',
    cusaCode: 'CUSA-07820',
    description: 'Cinco anos após a jornada perigosa pelos Estados Unidos pós-pandêmicos, Ellie e Joel se estabeleceram em Jackson, Wyoming. A paz é interrompida por um evento violento e Ellie embarca em uma jornada implacável de vingança.',
    downloadLinks: [
      { id: 'dl-2-1', label: 'Google Drive VIP', url: 'https://drive.google.com/file/d/sample-tlou2', type: 'Google Drive' },
      { id: 'dl-2-2', label: 'MEGA.nz Direct', url: 'https://mega.nz/file/sample-tlou2', type: 'MEGA' },
      { id: 'dl-2-3', label: 'Torrent PKG Repack v1.09', url: 'magnet:?xt=urn:btih:tlou2ps4pkg', type: 'Torrent' }
    ],
    status: 'Active',
    featured: true,
    createdAt: '2026-01-12T14:30:00Z'
  },
  {
    id: 'game-3',
    title: 'Ghost of Tsushima: Director\'s Cut',
    slug: 'ghost-of-tsushima-directors-cut',
    coverUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura', 'RPG'],
    rating: 4.9,
    ratingCount: 1890,
    downloadsCount: 41200,
    size: '60.3 GB',
    releaseDate: '2021-08-20',
    developer: 'Sucker Punch Productions',
    region: 'GLOBAL (CUSA-27389)',
    language: 'Português BR + Áudio Japonês Orginal',
    firmware: '8.50 / 9.00 / 11.00',
    cusaCode: 'CUSA-27389',
    description: 'No final do século XIII, o império mongol devastou nações inteiras. A ilha de Tsushima é tudo o que resta entre o Japão e uma enorme frota mongol. Jin Sakai deve superar a tradição samurai para criar um novo caminho e travar uma guerra não convencional.',
    downloadLinks: [
      { id: 'dl-3-1', label: 'Servidor Direto High Speed', url: 'https://drive.google.com/file/d/sample-got', type: 'Google Drive' },
      { id: 'dl-3-2', label: 'MEGA.nz Mirror', url: 'https://mega.nz/file/sample-got', type: 'MEGA' },
      { id: 'dl-3-3', label: 'Torrent Complete Edition', url: 'magnet:?xt=urn:btih:gotdirectorscutps4', type: 'Torrent' }
    ],
    status: 'Active',
    featured: true,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'game-4',
    title: 'Spider-Man: Miles Morales',
    slug: 'spider-man-miles-morales',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura'],
    rating: 4.7,
    ratingCount: 1150,
    downloadsCount: 31800,
    size: '51.8 GB',
    releaseDate: '2020-11-12',
    developer: 'Insomniac Games',
    region: 'USA (CUSA-20177)',
    language: 'Português BR (Dublado)',
    firmware: '7.55 / 9.00 / 11.00',
    cusaCode: 'CUSA-20177',
    description: 'Na mais recente aventura do universo do Spider-Man da Marvel, o adolescente Miles Morales está se adaptando à sua nova casa enquanto segue os passos de seu mentor, Peter Parker, para se tornar um novo Homem-Aranha.',
    downloadLinks: [
      { id: 'dl-4-1', label: 'Google Drive Link', url: 'https://drive.google.com/file/d/sample-spiderman-miles', type: 'Google Drive' },
      { id: 'dl-4-2', label: '1Fichier Mirror', url: 'https://1fichier.com/?spidermanmiles', type: '1Fichier' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-01-18T11:20:00Z'
  },
  {
    id: 'game-5',
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura', 'Mundo Aberto'],
    rating: 5.0,
    ratingCount: 3890,
    downloadsCount: 89400,
    size: '105.0 GB',
    releaseDate: '2018-10-26',
    developer: 'Rockstar Games',
    region: 'GLOBAL (CUSA-03041)',
    language: 'Legendas em Português BR',
    firmware: '6.72 / 9.00 / 11.00',
    cusaCode: 'CUSA-03041',
    description: 'Estados Unidos, 1899. O fim da era do Velho Oeste começou. Arthur Morgan e a gangue Van der Linde são fora da lei em fuga. Com agentes federais e os melhores caçadores de recompensas no seu encalço, a gangue precisa roubar e lutar para sobreviver.',
    downloadLinks: [
      { id: 'dl-5-1', label: 'Google Drive Multi-Part PKG', url: 'https://drive.google.com/file/d/sample-rdr2', type: 'Google Drive' },
      { id: 'dl-5-2', label: 'Torrent Alta Velocidade', url: 'magnet:?xt=urn:btih:rdr2ps4complete', type: 'Torrent' }
    ],
    status: 'Active',
    featured: true,
    createdAt: '2026-01-20T16:00:00Z'
  },
  {
    id: 'game-6',
    title: 'Elden Ring',
    slug: 'elden-ring',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['RPG', 'Ação'],
    rating: 4.9,
    ratingCount: 2980,
    downloadsCount: 61500,
    size: '48.9 GB',
    releaseDate: '2022-02-25',
    developer: 'FromSoftware',
    region: 'GLOBAL (CUSA-28863)',
    language: 'Legendas em Português BR',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-28863',
    description: 'O NOVO RPG DE AÇÃO DE FANTASIA. Levante-se, Maculado, e seja guiado pela graça para empunhar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.',
    downloadLinks: [
      { id: 'dl-6-1', label: 'MEGA.nz Fast Mirror', url: 'https://mega.nz/file/sample-eldenring', type: 'MEGA' },
      { id: 'dl-6-2', label: 'Google Drive Link', url: 'https://drive.google.com/file/d/sample-eldenring', type: 'Google Drive' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-01-22T08:15:00Z'
  },
  {
    id: 'game-7',
    title: 'Horizon Forbidden West',
    slug: 'horizon-forbidden-west',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura', 'RPG'],
    rating: 4.8,
    ratingCount: 1240,
    downloadsCount: 35900,
    size: '91.4 GB',
    releaseDate: '2022-02-18',
    developer: 'Guerrilla Games',
    region: 'USA (CUSA-24705)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-24705',
    description: 'Junte-se à Aloy para encarar o Oeste Proibido, uma fronteira majestosa, porém perigosa, que esconde novas ameaças misteriosas.',
    downloadLinks: [
      { id: 'dl-7-1', label: 'Google Drive Server 1', url: 'https://drive.google.com/file/d/sample-hfw', type: 'Google Drive' },
      { id: 'dl-7-2', label: 'Torrent Link', url: 'magnet:?xt=urn:btih:horizonfwps4', type: 'Torrent' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-01-25T13:40:00Z'
  },
  {
    id: 'game-8',
    title: 'EA SPORTS FC 24 (FIFA 24)',
    slug: 'ea-sports-fc-24',
    coverUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Esportes'],
    rating: 4.5,
    ratingCount: 3100,
    downloadsCount: 78900,
    size: '44.1 GB',
    releaseDate: '2023-09-29',
    developer: 'EA Canada',
    region: 'GLOBAL (CUSA-40321)',
    language: 'Português BR (Narração Gustavo Villani + Caio Ribeiro)',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-40321',
    description: 'O EA SPORTS FC 24 traz para você o Jogo de Todo Mundo, com a experiência de futebol mais autêntica de todos os tempos, mais de 19.000 atletas licenciados, mais de 700 times e mais de 30 ligas.',
    downloadLinks: [
      { id: 'dl-8-1', label: 'Servidor Direto High Speed', url: 'https://drive.google.com/file/d/sample-eafc24', type: 'Google Drive' },
      { id: 'dl-8-2', label: '1Fichier Mirror', url: 'https://1fichier.com/?eafc24ps4', type: '1Fichier' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-01-28T19:00:00Z'
  },
  {
    id: 'game-9',
    title: 'Bloodborne: GOTY Edition',
    slug: 'bloodborne-goty',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['RPG', 'Ação', 'Terror'],
    rating: 4.9,
    ratingCount: 3400,
    downloadsCount: 58000,
    size: '36.5 GB',
    releaseDate: '2015-11-25',
    developer: 'FromSoftware',
    region: 'GLOBAL (CUSA-03173)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '5.05 / 9.00 / 11.00',
    cusaCode: 'CUSA-03173',
    description: 'Enfrente seus medos enquanto busca respostas na cidade antiga de Yharnam, agora amaldiçoada com uma doença fantástica e estranha que se espalha pelas ruas como um fogo selvagem.',
    downloadLinks: [
      { id: 'dl-9-1', label: 'Google Drive Link', url: 'https://drive.google.com/file/d/sample-bloodborne', type: 'Google Drive' },
      { id: 'dl-9-2', label: 'MEGA.nz Link', url: 'https://mega.nz/file/sample-bloodborne', type: 'MEGA' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'game-10',
    title: 'Resident Evil 4 Remake',
    slug: 'resident-evil-4-remake',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Terror', 'Ação'],
    rating: 4.9,
    ratingCount: 2100,
    downloadsCount: 46200,
    size: '58.4 GB',
    releaseDate: '2023-03-24',
    developer: 'Capcom',
    region: 'GLOBAL (CUSA-33388)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-33388',
    description: 'A sobrevivência é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City. Leon S. Kennedy, um dos sobreviventes, rastreia a filha sequestrada do presidente até uma vila europeia isolada.',
    downloadLinks: [
      { id: 'dl-10-1', label: 'Google Drive VIP', url: 'https://drive.google.com/file/d/sample-re4remake', type: 'Google Drive' },
      { id: 'dl-10-2', label: 'Torrent Repack', url: 'magnet:?xt=urn:btih:re4remakeps4pkg', type: 'Torrent' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-03T12:00:00Z'
  },
  {
    id: 'game-11',
    title: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Mundo Aberto'],
    rating: 4.9,
    ratingCount: 5600,
    downloadsCount: 120400,
    size: '68.0 GB',
    releaseDate: '2014-11-18',
    developer: 'Rockstar North',
    region: 'USA (CUSA-00419)',
    language: 'Legendas em Português BR',
    firmware: '5.05 / 9.00 / 11.00',
    cusaCode: 'CUSA-00419',
    description: 'Um jovem ladrão de ruas, um assaltante de bancos aposentado e um psicopata aterrorizante precisam realizar uma série de assaltos perigosos para sobreviver em uma cidade cruel.',
    downloadLinks: [
      { id: 'dl-11-1', label: 'Google Drive High Speed', url: 'https://drive.google.com/file/d/sample-gtav', type: 'Google Drive' },
      { id: 'dl-11-2', label: '1Fichier Servidor', url: 'https://1fichier.com/?gtavps4', type: '1Fichier' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-05T15:30:00Z'
  },
  {
    id: 'game-12',
    title: 'Tekken 8',
    slug: 'tekken-8',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Luta'],
    rating: 4.7,
    ratingCount: 890,
    downloadsCount: 22100,
    size: '52.3 GB',
    releaseDate: '2024-01-26',
    developer: 'Bandai Namco',
    region: 'GLOBAL (CUSA-31299)',
    language: 'Legendas em Português BR',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-31299',
    description: 'A rivalidade Kazama-Mishima continua! O próximo capítulo da franquia lendária de luta traz gráficos impressionantes e novas mecânicas de combate agressivo.',
    downloadLinks: [
      { id: 'dl-12-1', label: 'MEGA.nz Link', url: 'https://mega.nz/file/sample-tekken8', type: 'MEGA' },
      { id: 'dl-12-2', label: 'Google Drive Direct', url: 'https://drive.google.com/file/d/sample-tekken8', type: 'Google Drive' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-07T11:00:00Z'
  },
  {
    id: 'game-13',
    title: 'Gran Turismo 7',
    slug: 'gran-turismo-7',
    coverUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Corrida', 'Esportes'],
    rating: 4.6,
    ratingCount: 1050,
    downloadsCount: 27400,
    size: '110.2 GB',
    releaseDate: '2022-03-04',
    developer: 'Polyphony Digital',
    region: 'USA (CUSA-24765)',
    language: 'Português BR (Menus e Textos)',
    firmware: '9.00 / 11.00',
    cusaCode: 'CUSA-24765',
    description: 'Gran Turismo 7 traz de volta os melhores recursos do simulador de corridas real com mais de 420 carros disponíveis na Brand Central e na concessionária de Usados.',
    downloadLinks: [
      { id: 'dl-13-1', label: 'Google Drive Direct PKG', url: 'https://drive.google.com/file/d/sample-gt7', type: 'Google Drive' },
      { id: 'dl-13-2', label: 'Torrent Speed', url: 'magnet:?xt=urn:btih:gt7ps4complete', type: 'Torrent' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-08T09:40:00Z'
  },
  {
    id: 'game-14',
    title: 'Uncharted 4: A Thief\'s End',
    slug: 'uncharted-4-a-thiefs-end',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    ],
    genres: ['Ação', 'Aventura'],
    rating: 4.9,
    ratingCount: 2800,
    downloadsCount: 65100,
    size: '48.0 GB',
    releaseDate: '2016-05-10',
    developer: 'Naughty Dog',
    region: 'GLOBAL (CUSA-00341)',
    language: 'Português BR (Dublado e Legendado)',
    firmware: '5.05 / 9.00 / 11.00',
    cusaCode: 'CUSA-00341',
    description: 'Três anos após os eventos de Uncharted 3, Nathan Drake deixou o mundo de caçador de tesouros para trás. No entanto, o destino bate à sua porta quando seu irmão Sam reaparece pedindo ajuda.',
    downloadLinks: [
      { id: 'dl-14-1', label: 'Google Drive Server', url: 'https://drive.google.com/file/d/sample-uc4', type: 'Google Drive' },
      { id: 'dl-14-2', label: '1Fichier Direct', url: 'https://1fichier.com/?uncharted4ps4', type: '1Fichier' }
    ],
    status: 'Active',
    featured: false,
    createdAt: '2026-02-09T14:10:00Z'
  }
];
