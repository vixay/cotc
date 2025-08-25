// Character markdown file mapping and parsing utilities

import { paths } from './pathUtils.js'

// Get replacement SVG for Notion emoji URLs
function getNotionEmojiReplacement(notionUrl) {
    // Return a simple placeholder emoji as text instead of problematic SVG
    return '⚡'; // Simple emoji that works everywhere
}

// Normalize character name for matching
function normalizeCharacterName(name) {
    if (!name) return '';
    
    // Remove parenthetical content and normalize apostrophes/accents
    return name
        .replace(/\s*\(.*?\)\s*/g, '') // Remove parenthetical content
        .replace(/[\u0027\u2018\u2019\u0060]/g, '') // Remove all apostrophe types: ' ' ' `
        .replace(/[àáâãäåæ]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .trim();
}


// Complete mapping of character names to file paths
const characterFileMapping = {
    "2B": "data/Character Markdown/2B 4d53e4dd304b48ad98744b9b533822a7.md",
    "3 Stars": "data/Character Markdown/3 Stars a1b0d33025b345138666177c07607e6b.md",
    "4 Stars": "data/Character Markdown/4 Stars d483cb4e9194440b80c26169bcd1ea9c.md",
    "5 Stars": "data/Character Markdown/5 Stars 35cac8c51e8e44ff9736444e38bc802c.md",
    "9S": "data/Character Markdown/9S 2804f181146e4a32acb08d4ac6d7d0e8.md",
    "A2": "data/Character Markdown/A2 8f13b80b261b41f7a5668f4c13a99e69.md",
    "Adelle": "data/Character Markdown/Adelle b1646afb6bed4e45b4440e1270fc9038.md",
    "Aedelgard": "data/Character Markdown/Aedelgard c55e0c3df0604c7c974e7ebebec27176.md",
    "Agnea": "data/Character Markdown/Agnea 72773c66a6c1479d80b95efa446356ca.md",
    "Agnea EX": "data/Character Markdown/Agnea EX 957b26cd717843fb8f7db2b20c51dd05.md",
    "Agnes": "data/Character Markdown/Agnes 8afa64dfee594cf2a16abf36b24350ca.md",
    "Alaune": "data/Character Markdown/Alaune 19b8b4709eab4b7395adc265b6a3cfc9.md",
    "Alaune EX": "data/Character Markdown/Alaune EX ec7114138d15469eaba96dbcc2f2c77b.md",
    "Alfyn": "data/Character Markdown/Alfyn 0adaae0e4dab41ad9ecca346dfbdbd50.md",
    "Alrond": "data/Character Markdown/Alrond d29d3cb19e35446aaa0fb1d9a125e729.md",
    "Aoi": "data/Character Markdown/Aoi 221ebbc65396809a8422d16fb197cc0f.md",
    "Ashlan": "data/Character Markdown/Ashlan c833a487be604a9691b19d84ce911f73.md",
    "Aslyte": "data/Character Markdown/Aslyte d232fc52d1424dbe99416321e28a9d49.md",
    "Auguste": "data/Character Markdown/Auguste 14253cec865f4f649033f00dc8849c0b.md",
    "Avar": "data/Character Markdown/Avar 1d1ebbc6539680d892c8d2991a1694f0.md",
    "Aviette": "data/Character Markdown/Aviette 233ebbc65396808aaa5ef1585b3527b1.md",
    "Bargello": "data/Character Markdown/Bargello 6c7116e5271b4b2a96fcacab716cb72b.md",
    "Bargello EX": "data/Character Markdown/Bargello EX f7d7528ed95149d4be8dadc2ca3d82e9.md",
    "Barrad": "data/Character Markdown/Barrad 717bd41a5be245a9b51d7f23c93381af.md",
    "Bertrand": "data/Character Markdown/Bertrand 5189a8e9de49428398c33f046d41a1ef.md",
    "Billy": "data/Character Markdown/Billy f1c6c01cfaff4b10b395faf979349378.md",
    "Black Knight": "data/Character Markdown/Black Knight 17cebbc65396803e87b3c3476fb6d8d7.md",
    "Black Maiden": "data/Character Markdown/Black Maiden 17cebbc6539680e28887d7146dccb07e.md",
    "Brigitte": "data/Character Markdown/Brigitte b42abf38dc3f4cba84caed82e8286203.md",
    "Camilla": "data/Character Markdown/Camilla 02759ca04d984c6992d810c9c8a7ce26.md",
    "Canary": "data/Character Markdown/Canary a9085f20bf09486f9543b6c63048435c.md",
    "Cardona": "data/Character Markdown/Cardona 9604c31ecedb47f5886b8781e8e6def3.md",
    "Carroll": "data/Character Markdown/Carroll ff623797c56d42d591591c1d620bcc90.md",
    "Cassia": "data/Character Markdown/Cassia 221ebbc653968017ae27ec578c3da102.md",
    "Castti": "data/Character Markdown/Castti 47b3d85a2d4c4383a2626e73accea4e6.md",
    "Castti EX": "data/Character Markdown/Castti EX 1f0ebbc6539680648db9ccc813d68102.md",
    "Cecil": "data/Character Markdown/Cecil 3510b8a2aa724b76958949d110e1bcbe.md",
    "Cecily": "data/Character Markdown/Cecily 2c1be50e49cb4feb82e22b5ff137c75f.md",
    "Cedric": "data/Character Markdown/Cedric 5b839eaa49f74dafbc6324a89a229f8f.md",
    "Ceraphina": "data/Character Markdown/Ceraphina 11bebbc653968078b9b3c30223781d40.md",
    "Cerna": "data/Character Markdown/Cerna 92e2583fee504eb68fb17372833a73b4.md",
    "Chloe": "data/Character Markdown/Chloe 076335ce3e92485aa4cc0dd4cb79c003.md",
    "Cless": "data/Character Markdown/Cless 3ed11f12962842fc8f23d55e383ad7dd.md",
    "Conny": "data/Character Markdown/Conny 4f26090435314712b9fc5f2e1eab2ace.md",
    "Cornelia": "data/Character Markdown/Cornelia 509b635c3cf34d2a960b759e92b6e894.md",
    "Crick": "data/Character Markdown/Crick 144ebbc653968005a075dc679f5ec4ad.md",
    "Cyrus EX": "data/Character Markdown/Cyrus EX 198ebbc6539680aca1f5f76896724950.md",
    "Cyrus": "data/Character Markdown/Cyrus c0ae4537a77d4c128b6efbd26342a65c.md",
    "Devin": "data/Character Markdown/Devin bf2d6adf2f074c978248a21f643fead2.md",
    "Diego": "data/Character Markdown/Diego a13e29e180e74d1bab0d7c7bc376478a.md",
    "Ditraina": "data/Character Markdown/Ditraina 552389f008be43fea5f1eeeff1adf1d1.md",
    "Ditraina EX": "data/Character Markdown/Ditraina EX 129ebbc65396809a9978c62161d81589.md",
    "Dolcinaea": "data/Character Markdown/Dolcinaea 51e9fbc3bcf443ccb80a600544235d6c.md",
    "Dorothea": "data/Character Markdown/Dorothea bc9f8d3fb82c4e92a1d8843a03591ca0.md",
    "Dorrie": "data/Character Markdown/Dorrie 31c38bc1cfc24f0088828c940499d1c3.md",
    "Durand": "data/Character Markdown/Durand e455924302b948c8976078ce4f3ac387.md",
    "Edea": "data/Character Markdown/Edea 4d87730cb6b74b78b0788f81fb5d484b.md",
    "Efrain": "data/Character Markdown/Efrain 684c878ff0414fdbbb8433852736d24b.md",
    "Eleonora": "data/Character Markdown/Eleonora 46587ea5b1a04db082a17c24254fccd3.md",
    "Eliza": "data/Character Markdown/Eliza cb1df363db4e4e8597b60c44001aca07.md",
    "Elrica": "data/Character Markdown/Elrica 4e76ee1908514ff6a028390ff54752d5.md",
    "Elrica EX": "data/Character Markdown/Elrica EX 129ebbc6539680098cd2f94661257fd8.md",
    "Eltrix": "data/Character Markdown/Eltrix dd25020b671f468da8e35dfa8831e78b.md",
    "Elvis": "data/Character Markdown/Elvis 674c5ad3f15c424a86b3d5ad984d9489.md",
    "Emil": "data/Character Markdown/Emil 264857172c4d480a8fb5978f69d958b8.md",
    "Esmeralda": "data/Character Markdown/Esmeralda 20cebbc65396800c8948e4de6de05bcb.md",
    "Eunice": "data/Character Markdown/Eunice aa0acff804524a8682b3a79cdd970c65.md",
    "Evelyn": "data/Character Markdown/Evelyn 3f6803c735294d4885f648b8d3b17a4e.md",
    "Fabio": "data/Character Markdown/Fabio 9e6c21e78eec456e8fadcf351c2b102f.md",
    "Falco": "data/Character Markdown/Falco 0553966504eb4401aece17059442633b.md",
    "Felline": "data/Character Markdown/Felline f7ad7a58d7574f30968a4633b3d4aac8.md",
    "Fiore": "data/Character Markdown/Fiore 1a78e1b64fbd436da894dcb01e60226b.md",
    "Fiore EX": "data/Character Markdown/Fiore EX 2a3e30bbc3d346358382cef9d67fdd51.md",
    "Frederica": "data/Character Markdown/Frederica fbe95acb684e4183a893ee1537e9b4b4.md",
    "Gertrude": "data/Character Markdown/Gertrude 6eed317c1b3d41c58888633e55e3f0d3.md",
    "Gilderoy": "data/Character Markdown/Gilderoy 29f761caf41e4d0da662ffb0a78903e4.md",
    "Gloria": "data/Character Markdown/Gloria ddee867cb49b4f2b9ff58af16d921cd6.md",
    "Glossom": "data/Character Markdown/Glossom 0e258a3265434cc7abd227395326a27a.md",
    "Grieg": "data/Character Markdown/Grieg 0f743ab4139247af99a83adb17d6f64f.md",
    "Guti": "data/Character Markdown/Guti ab837e9dc3e440a381d21ebeff4d51f8.md",
    "Hammy": "data/Character Markdown/Hammy ff5b4c5ea21a4a84917aefb2792b7aa7.md",
    "Harley": "data/Character Markdown/Harley 6e6b6e0569a042859b094d66db74dd6b.md",
    "Harry": "data/Character Markdown/Harry cee04001c10a4420a8f13af486af99bf.md",
    "Hasumi": "data/Character Markdown/Hasumi 686065585d3f439aa0a22bf59606b57d.md",
    "Hayes": "data/Character Markdown/Hayes 09d6921c657a4a31961ec81fe71ed863.md",
    "Heathcote": "data/Character Markdown/Heathcote a0b559ba21f846f28df33c480a76a067.md",
    "Heinz": "data/Character Markdown/Heinz c40c358fe8544f82bbbee30be629a3e8.md",
    "Helga": "data/Character Markdown/Helga 210428a888a74dd483f38e31499dc45f.md",
    "Herminia": "data/Character Markdown/Herminia e264444c4f604236a29e03e95a61348a.md",
    "Hikari": "data/Character Markdown/Hikari 8d6a252422aa4aa390ed139c58969103.md",
    "Hikari EX": "data/Character Markdown/Hikari EX 16debbc6539680c483e1e62265b4e5e4.md",
    "Hujheb": "data/Character Markdown/Hujheb 4605156386384350afc89f8f4e6df34f.md",
    "Haanit EX": "data/Character Markdown/Haanit EX dab7c0f8141348628f4a050a136bcab0.md",
    "Haanit": "data/Character Markdown/Haanit ec935c0898cf43b782e1a2026cea0033.md",
    "Iris": "data/Character Markdown/Iris 5ce086ba2bfa4760aef7e02de8df1f09.md",
    "Isla": "data/Character Markdown/Isla 73fee5d09608404497f200406f7eea90.md",
    "Jane": "data/Character Markdown/Jane c9fe35fcb53f403db313f5fa306c5727.md",
    "Jillmeila": "data/Character Markdown/Jillmeila c2d2f84979444bf2958668454dbe03a0.md",
    "Jorge": "data/Character Markdown/Jorge b3e0546d3ea442a1a3a07a73e75d0c53.md",
    "Jorn": "data/Character Markdown/Jorn d75d8b4362654544a92483a5e5018f51.md",
    "Jose": "data/Character Markdown/Jose 6c02e64201494f8fa03b975ec63d2e4c.md",
    "Joshua": "data/Character Markdown/Joshua b4ab013ac82a43268fd7c56780045ca0.md",
    "Juan": "data/Character Markdown/Juan cf5d0bd6e557486fbb9b972f9b58adb1.md",
    "Julio": "data/Character Markdown/Julio 90d801d029be4a8fbf2a1ec88326c17d.md",
    "Kagemune": "data/Character Markdown/Kagemune 162ebbc65396808cb7bfd9530acb1e7a.md",
    "Kaine": "data/Character Markdown/Kaine 513f1fa9fc7f4586a7d7228dbcb5f006.md",
    "Kazan": "data/Character Markdown/Kazan 21febbc6539680f9b8caef2468681221.md",
    "Kenneth": "data/Character Markdown/Kenneth ac4d889b89b449b78159d94b746bc5df.md",
    "Kersjes": "data/Character Markdown/Kersjes 4f686bf7c46c493993f88d5f91e1a600.md",
    "Kilns": "data/Character Markdown/Kilns 2e179d6832b2405494c233b747f4b824.md",
    "Kouren": "data/Character Markdown/Kouren 5f32a0cf626d4837b32090c26830b924.md",
    "Krauser": "data/Character Markdown/Krauser 7b8b67b271cb483ab8d60e4807dfd5d4.md",
    "Kurtz": "data/Character Markdown/Kurtz 1abde49c0f264b9aa0c351571d7d9ce0.md",
    "Largo": "data/Character Markdown/Largo ad5773151d4f464c987cb646d84d2f92.md",
    "Lars": "data/Character Markdown/Lars 9abcb7e17ebc454689d3325b6d2fb9b9.md",
    "Laura": "data/Character Markdown/Laura da7090b374b24027840b99d4e19826bc.md",
    "Lemaire": "data/Character Markdown/Lemaire 4f1afeb5f7e543539abc66aa0df0e7a8.md",
    "Leon": "data/Character Markdown/Leon 31a5df6ec0be47e5b3e63a4a3dfba5ad.md",
    "Levan": "data/Character Markdown/Levan 3fee007cea0e4a419cb5459215f836ca.md",
    "Levina": "data/Character Markdown/Levina 048247e79aa847a58d08a4109c5f0530.md",
    "Lianna": "data/Character Markdown/Lianna ddc385d6c0b540178a07c805dbcaf7af.md",
    "Lionel": "data/Character Markdown/Lionel e3378a708e724d60911c8d24770e2557.md",
    "Lolo": "data/Character Markdown/Lolo bb953a859ce1424aa3108dcc9ac322be.md",
    "Lucetta": "data/Character Markdown/Lucetta cde30b2f85ae4ff8818a757d487caf59.md",
    "Lumis": "data/Character Markdown/Lumis 3e7fba0b6fa045e392875c7eb6af6f53.md",
    "Lumis EX": "data/Character Markdown/Lumis EX 37cb785214f84abea2fe98707323c6d5.md",
    "Lynette": "data/Character Markdown/Lynette 9eac141db41d466781587a639658b96f.md",
    "Mabel": "data/Character Markdown/Mabel 979f299e74bc4a04b3615a8282298f39.md",
    "Madelaine": "data/Character Markdown/Madelaine 933fc4ad82ed4dc5911e5add4f6bde9e.md",
    "Magnolia": "data/Character Markdown/Magnolia 20116b1bbd0840c8af8abddbf04c8bcc.md",
    "Mahrez": "data/Character Markdown/Mahrez 205ebbc65396801b9bdfea2658db1aad.md",
    "Manuel": "data/Character Markdown/Manuel ac0c38345cac428f9f2d89a2862391d4.md",
    "Meena": "data/Character Markdown/Meena f93da89c76304e14a88eb2231645d3e8.md",
    "Menno": "data/Character Markdown/Menno ff1dd646aabe46a7bdbae3dd3946d2cb.md",
    "Menny": "data/Character Markdown/Menny f8e48e04089147cf8e2e6d10b10cfa23.md",
    "Merrit": "data/Character Markdown/Merrit c76d731824624c478a12cb903f8d1b38.md",
    "Miles": "data/Character Markdown/Miles 2d1baafa39204bac8149332468543b1f.md",
    "Millard": "data/Character Markdown/Millard 39f80e25112d49548e22c2d5a19c43f5.md",
    "Millard EX": "data/Character Markdown/Millard EX b53f902c1e184a038055d1dd09c47e23.md",
    "Mirgardi": "data/Character Markdown/Mirgardi 29ec927fa9cf4c948283a48835391aa5.md",
    "Molrusso EX": "data/Character Markdown/Molrusso EX 198ebbc6539680608c54daa6b46c874f.md",
    "Molrusso": "data/Character Markdown/Molrusso d6241f7695904fe59f455d079f0ab5a4.md",
    "Molu": "data/Character Markdown/Molu ed8a91fba0aa46c0b3d09ebd214b603b.md",
    "Morena": "data/Character Markdown/Morena 153ebbc6539680248e23ffb1f5561185.md",
    "Morffins": "data/Character Markdown/Morffins 9fd9bf74f02a49508c79b05932a5ad6e.md",
    "Mydia": "data/Character Markdown/Mydia 136ebbc6539680f2a1d8f93c0899f86f.md",
    "Nanna": "data/Character Markdown/Nanna dcf625723dce471a986a0a1875678020.md",
    "Narr": "data/Character Markdown/Narr 7146f96e00874d1ba42fc890ebe28f86.md",
    "Neha": "data/Character Markdown/Neha 0dab86a4d4e345a6a8835c321377054d.md",
    "Nephti": "data/Character Markdown/Nephti 08e7fe5d31e1427699e7a9900902ec5f.md",
    "Nicola": "data/Character Markdown/Nicola f48bedc1b4fd49ddb16c105f3e30e2c9.md",
    "Nier": "data/Character Markdown/Nier 30268eef5c2d44c4a5f24e60c7d27ded.md",
    "Nina-Lanna": "data/Character Markdown/Nina-Lanna 41fafd7b5a0a43f6b2d48cc5f0b11169.md",
    "Nivelle": "data/Character Markdown/Nivelle 4acce64c0df94197bd001bbc2313ee03.md",
    "Noelle": "data/Character Markdown/Noelle dcb2f285314043e4b05809d45904e1b5.md",
    "Nona": "data/Character Markdown/Nona 51bf88f25ad248f7a69eda5f60c2f5da.md",
    "O Odio": "data/Character Markdown/O Odio 11d32277c12f4b7a910336badd61c34e.md",
    "O. Odio": "data/Character Markdown/O Odio 11d32277c12f4b7a910336badd61c34e.md",
    "Ochette EX": "data/Character Markdown/Ochette EX 1e3ebbc6539680578d1bf7b5d6d4061a.md",
    "Ochette": "data/Character Markdown/Ochette bf423c4223f047aa8e7576dae557ea38.md",
    "Odette": "data/Character Markdown/Odette 6fcff801aead446d9862d53300baff81.md",
    "Oersted": "data/Character Markdown/Oersted 4fa33078a2534909872fed84ae72a1b4.md",
    "Ogen": "data/Character Markdown/Ogen bc368805f3df4e109e4f5b2db89d0b17.md",
    "Olberic": "data/Character Markdown/Olberic 042d570f89724450960dad310c49cd7a.md",
    "Ophilia": "data/Character Markdown/Ophilia 72a44443a5874590bd7822bd2d0ce683.md",
    "Ophilia EX": "data/Character Markdown/Ophilia EX 13f3c778e1e24bb69acf30857683b4fe.md",
    "Ori": "data/Character Markdown/Ori 10debbc6539680ea8766ff1ad52ae9e1.md",
    "Oskha": "data/Character Markdown/Oskha be911aaadedd48ef97f27b7a066cbc7d.md",
    "Osvald": "data/Character Markdown/Osvald 32133453bf2e4a2aa84cf6b094dee5d6.md",
    "Osvald EX": "data/Character Markdown/Osvald EX 1e4ebbc653968070a9e4c7ee1588a898.md",
    "Pardis III": "data/Character Markdown/Pardis III 11bebbc65396801bb84fccfc754ccd5c.md",
    "Partitio": "data/Character Markdown/Partitio 9479ac566db44e1e9f0013d5e3141722.md",
    "Partitio EX": "data/Character Markdown/Partitio EX 1b4ebbc65396805cb00fea681b82ca8a.md",
    "Paula": "data/Character Markdown/Paula 9eea4477ceb74020bea0ebbdce9b2e21.md",
    "Pearl": "data/Character Markdown/Pearl 63160145a41945608e0f458502f729e9.md",
    "Penny": "data/Character Markdown/Penny d2d5576126aa4824aed923094b97bb99.md",
    "Peredir": "data/Character Markdown/Peredir 7a059ea026c84d50be779fdcaad2af40.md",
    "Pia": "data/Character Markdown/Pia d547366a8c004a8fac8e0f6198bd08af.md",
    "Pirro": "data/Character Markdown/Pirro 04f0886a45b248a1be8fcb9b16417e7a.md",
    "Primrose": "data/Character Markdown/Primrose 5eed6c354f1d474da4d78f995500d05a.md",
    "Primrose EX": "data/Character Markdown/Primrose EX 42afb94290ab4f4f9b4a9e8465a0281e.md",
    "Promme": "data/Character Markdown/Promme f0e76fb083bb4a2f9f89122bba1f2b1a.md",
    "Rai Mei": "data/Character Markdown/Rai Mei 16debbc6539680b8820dde00d4fb0d3a.md",
    "Ramona": "data/Character Markdown/Ramona d826377e12984452b7bf7ae1a8310afa.md",
    "Relisha": "data/Character Markdown/Relisha d662288eceb04e3da4d06976a194beef.md",
    "Richard": "data/Character Markdown/Richard 362c2751aafd471997d15aabca9739bc.md",
    "Ringabel": "data/Character Markdown/Ringabel 7f3ec91af1724d57a15d43881ee047c5.md",
    "Rinyuu": "data/Character Markdown/Rinyuu 94482574b6ba428f9ce260d49944723a.md",
    "Rinyuu EX": "data/Character Markdown/Rinyuu EX 39c064f89e9f4e50ab4715b4dae8f66c.md",
    "Rique": "data/Character Markdown/Rique 03cb41beb766464083f85e40d3bfaf82.md",
    "Rita": "data/Character Markdown/Rita a51cbe9fa0cc416a9e40f2cdbf2f8be2.md",
    "Ritu": "data/Character Markdown/Ritu b3d82486ade74487bf33193571d2a536.md",
    "Rodion": "data/Character Markdown/Rodion 34a30f0009e54b67a0d2065f4f43730d.md",
    "Roland": "data/Character Markdown/Roland d3f1987079004a03bd30bcfd7b5d8706.md",
    "Rondo": "data/Character Markdown/Rondo e8b398a94b624ba58a14e8dcb4304a47.md",
    "S Odio": "data/Character Markdown/S Odio d9f0b853ee8742d5890c40306a630a30.md",
    "S. Odio": "data/Character Markdown/S Odio d9f0b853ee8742d5890c40306a630a30.md",
    "Sail": "data/Character Markdown/Sail aa71b741d53b421b9add798960e4d2c4.md",
    "Saria": "data/Character Markdown/Saria a8b32d2ff6a34c50ae8fa771bae3f94e.md",
    "Sarisa": "data/Character Markdown/Sarisa 5e3faa6e104c4a628305ee55c2b2b4da.md",
    "Sazantos EX": "data/Character Markdown/Sazantos EX 6873dec8f7fc4f40a50f930e45574a77.md",
    "Sazantos": "data/Character Markdown/Sazantos a84bb990a2964b3c8a4bdcc48cbd0e45.md",
    "Scarecrow": "data/Character Markdown/Scarecrow d7c4eb5e8262427a94f91cf6de4d7122.md",
    "Serenoa": "data/Character Markdown/Serenoa 8a62f393d9824de3b49e6d5def009cc7.md",
    "Sertet": "data/Character Markdown/Sertet 4ba636bd37fe435882e1e171245151a9.md",
    "Shana": "data/Character Markdown/Shana 2de86ef4cff44c50bc6b2f504687e2aa.md",
    "Shelby": "data/Character Markdown/Shelby 68098643306d40afbef5151ac0a7e96d.md",
    "Signa": "data/Character Markdown/Signa 1f2215a0efde439985de36ab8b4308fb.md",
    "Signa EX": "data/Character Markdown/Signa EX 1b4ebbc6539680fc9a7cff99476433b0.md",
    "Sigrid EX": "data/Character Markdown/Sigrid EX 174ebbc653968010a8b8fc15dab6bf63.md",
    "Sigrid": "data/Character Markdown/Sigrid e8c2139a028b4923bbbb37496dfb9751.md",
    "Sofia": "data/Character Markdown/Sofia 00068123fe9b435bb0071c737bee5e8b.md",
    "Sofia EX": "data/Character Markdown/Sofia EX 0cd5fb04c5714f579a737206fb030b3a.md",
    "Soleil": "data/Character Markdown/Soleil 47332ff5677b4724a50d155c896f82f2.md",
    "Solon": "data/Character Markdown/Solon 0e4447087f6b4b8e842172d7180bed33.md",
    "Sonia": "data/Character Markdown/Sonia 1a52641a316e4328abaad736997a723f.md",
    "Sowan": "data/Character Markdown/Sowan f639447a2228444093dd68e45bf96e6c.md",
    "Stead": "data/Character Markdown/Stead 48526d8441c746b09732618916be5786.md",
    "Streibough": "data/Character Markdown/Streibough 9f1cafebe58b48d4966d68c34672869b.md",
    "Sunny": "data/Character Markdown/Sunny 7d4760df79a7493880978b610e7ad328.md",
    "Tahir": "data/Character Markdown/Tahir 8cbcafee87bd4d4b947d1b36e6ff3798.md",
    "Tatloch": "data/Character Markdown/Tatloch 0317ed510d074df59c8d147c133e6e30.md",
    "Tatloch EX": "data/Character Markdown/Tatloch EX 1926373cb6c243798c392230f48f6a02.md",
    "Telly": "data/Character Markdown/Telly 73de0ae29a4c4e1186c955e86d0568da.md",
    "Temenos": "data/Character Markdown/Temenos e9618150d4114b5697dbff2052b0ce94.md",
    "Theo": "data/Character Markdown/Theo 4daa8e3185ad44f5baeba9f1243d23f5.md",
    "Therese EX": "data/Character Markdown/Therese EX 1b5ebbc653968027b5edd0b40cbba48d.md",
    "Therese": "data/Character Markdown/Therese f1259e8a84e74d4eb4e9fd8e1101259c.md",
    "Therion": "data/Character Markdown/Therion 8c6c7322344d49f0b4b3ad546f12e697.md",
    "Throne": "data/Character Markdown/Throne 3e5b859554994db99efc90e493970dab.md",
    "Tikilen": "data/Character Markdown/Tikilen 666ea822f3e94ed9bef1345e885411d8.md",
    "Tithi": "data/Character Markdown/Tithi 6b0b78e90f9c46239c270d011403c015.md",
    "Tiziano": "data/Character Markdown/Tiziano 1c047902f28d439ab31333aa0088e6b2.md",
    "Tressa": "data/Character Markdown/Tressa 32ebb4b2b9b74f599fddb0edc5777a59.md",
    "Tressa EX": "data/Character Markdown/Tressa EX 0b5db6785d514c2ebb35033b73fd11b7.md",
    "Trish": "data/Character Markdown/Trish 534f3ac4bf62459285467d995c06316b.md",
    "Tytos": "data/Character Markdown/Tytos 6f897e4a2f9c48588c6ae7e50ce332e3.md",
    "Varkyn": "data/Character Markdown/Varkyn afa284a57f824c36acc544d4fe11f5a2.md",
    "Viola": "data/Character Markdown/Viola 5251b06411cc42dc992990a04d2eddd3.md",
    "Viola EX": "data/Character Markdown/Viola EX 198ebbc6539680889216cfe380b17678.md",
    "Vivian": "data/Character Markdown/Vivian a647184c363244cf83bd502dbca126ff.md",
    "Wingate": "data/Character Markdown/Wingate f4b1f95609ce4d1d879daafa91166229.md",
    "Wludai": "data/Character Markdown/Wludai 4edb449b69e34b5b8480e5e38d1c66c1.md",
    "Yan Long": "data/Character Markdown/Yan Long 386d5bd74f8b4a9ba740b0ca86e6aee6.md",
    "Yugo": "data/Character Markdown/Yugo 87a5c47902cb4c558758f236419a80b3.md",
    "Yukes": "data/Character Markdown/Yukes 80f17b157c0b4234a9eafee83f2ad2d7.md",
    "Yunnie": "data/Character Markdown/Yunnie 2c3735a715b84bf2899890ea29d7b21e.md",
    "Zenia": "data/Character Markdown/Zenia a87943df6c154cd691dac2a76d9a9c9d.md",
    "Zaanta": "data/Character Markdown/Zaanta 5997ce2d9c7b45d1b9ffb95344192998.md"
};

// Find markdown file for a character using the complete mapping
async function findMarkdownFile(character) {
    const originalName = character.name;
    const normalizedName = normalizeCharacterName(character.name);
    
    // Try original name first (for special characters)
    if (characterFileMapping[originalName]) {
        return characterFileMapping[originalName];
    }
    
    // Try original name with EX suffix
    if (characterFileMapping[originalName + ' EX']) {
        return characterFileMapping[originalName + ' EX'];
    }
    
    // Try normalized name
    if (characterFileMapping[normalizedName]) {
        return characterFileMapping[normalizedName];
    }
    
    // Try normalized name with EX suffix
    if (characterFileMapping[normalizedName + ' EX']) {
        return characterFileMapping[normalizedName + ' EX'];
    }
    
    // Try period variations for Odio characters
    const alternates = {
        'O Odio': 'O. Odio',
        'O. Odio': 'O Odio',
        'S Odio': 'S. Odio',
        'S. Odio': 'S Odio'
    };
    
    if (alternates[originalName] && characterFileMapping[alternates[originalName]]) {
        return characterFileMapping[alternates[originalName]];
    }
    
    return null;
}

// Extract metadata from markdown content
function extractMetadata(markdown) {
    const metadata = {};
    const lines = markdown.split('\n');
    
    for (const line of lines) {
        if (line.includes('HP:')) {
            const match = line.match(/HP:\s*([\d,]+)/);
            if (match) metadata.hp = match[1].replace(/,/g, '');
        }
        if (line.includes('SP:')) {
            const match = line.match(/SP:\s*([\d,]+)/);
            if (match) metadata.sp = match[1].replace(/,/g, '');
        }
        if (line.includes('P.Atk:')) {
            const match = line.match(/P\.Atk:\s*([\d,]+)/);
            if (match) metadata.pAtk = match[1].replace(/,/g, '');
        }
        if (line.includes('P.Def:')) {
            const match = line.match(/P\.Def:\s*([\d,]+)/);
            if (match) metadata.pDef = match[1].replace(/,/g, '');
        }
        if (line.includes('E.Atk:')) {
            const match = line.match(/E\.Atk:\s*([\d,]+)/);
            if (match) metadata.eAtk = match[1].replace(/,/g, '');
        }
        if (line.includes('E.Def:')) {
            const match = line.match(/E\.Def:\s*([\d,]+)/);
            if (match) metadata.eDef = match[1].replace(/,/g, '');
        }
        if (line.includes('Crit:')) {
            const match = line.match(/Crit:\s*([\d,]+)/);
            if (match) metadata.crit = match[1].replace(/,/g, '');
        }
        if (line.includes('Spd:')) {
            const match = line.match(/Spd:\s*([\d,]+)/);
            if (match) metadata.spd = match[1].replace(/,/g, '');
        }
    }
    
    return metadata;
}

// Create compact stats table
function createCompactStatsTable(metadata) {
    if (!metadata || Object.keys(metadata).length === 0) return '';
    
    return `
        <div class="stats-table-container">
            <h4>CHARACTER STATS</h4>
            <table class="stats-table">
                <tr>
                    <td class="stat-label">HP</td>
                    <td class="stat-value">${metadata.hp || 'N/A'}</td>
                    <td class="stat-label">SP</td>
                    <td class="stat-value">${metadata.sp || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="stat-label">P.Atk</td>
                    <td class="stat-value">${metadata.pAtk || 'N/A'}</td>
                    <td class="stat-label">P.Def</td>
                    <td class="stat-value">${metadata.pDef || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="stat-label">E.Atk</td>
                    <td class="stat-value">${metadata.eAtk || 'N/A'}</td>
                    <td class="stat-label">E.Def</td>
                    <td class="stat-value">${metadata.eDef || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="stat-label">Crit</td>
                    <td class="stat-value">${metadata.crit || 'N/A'}</td>
                    <td class="stat-label">Speed</td>
                    <td class="stat-value">${metadata.spd || 'N/A'}</td>
                </tr>
            </table>
        </div>
    `;
}

// Create attributes section
function createAttributesSection(metadata) {
    // This would be expanded based on actual metadata structure
    return '';
}

// Process image paths
function processImagePath(imagePath) {
    if (!imagePath) return '';
    
    // Handle Notion emoji URLs - replace with fallback
    if (imagePath.startsWith('notion://')) {
        return getNotionEmojiReplacement(imagePath);
    }
    
    // Handle paths that are already full URLs
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Use pathUtils for proper base URL handling
    return paths.images(imagePath);
}

// Normalize icon name by removing variants and URL encoding
function normalizeIconName(iconName) {
    if (!iconName) return '';
    
    // URL decode the name first
    let normalized = decodeURIComponent(iconName);
    
    // Remove numbered variants like " 1", " 2", etc.
    normalized = normalized.replace(/\s+\d+\.png$/, '.png');
    
    // Remove URL-encoded variants like "%201", "%202", etc.
    normalized = normalized.replace(/%20\d+\.png$/, '.png');
    
    return normalized;
}

// Get shared icon path
function getSharedIconPath(iconName) {
    const sharedIcons = {
        // Stat boosts - map to wiki-icons
        'Phys_Atk_Boost.png': 'wiki-icons/Buff_Phys._Atk._Up.png',
        'Elem_Atk_Boost.png': 'wiki-icons/Buff_Elem._Atk._Up.png',
        'Elem_atk_Boost.png': 'wiki-icons/Buff_Elem._Atk._Up.png',
        'BP_Recovery_Boost.png': 'wiki-icons/Buff_BP_Recovery_Up.png',
        'BP_Recovery.png': 'wiki-icons/Buff_BP_Recovery_Up.png',
        'Critical_Force.png': 'wiki-icons/Buff_Crit._Up.png',
        'Critical_Elemental_Damage.png': 'wiki-icons/Buff_Crit._Up.png',
        'Crit_Up.png': 'wiki-icons/Buff_Crit._Up.png',
        'Max_HP_Boost.png': 'wiki-icons/Buff_HP_Barrier.png',
        'Max_HP_Up.png': 'wiki-icons/Buff_HP_Barrier.png',
        'HP_Boost.png': 'wiki-icons/Buff_HP_Barrier.png',
        'Speed_Up.png': 'wiki-icons/Buff_Spd._Up.png',
        'Spd_Up.png': 'wiki-icons/Buff_Spd._Up.png',
        'Speed_Drain.png': 'wiki-icons/Debuff_Spd._Down.png',
        'Elem_Def_Up.png': 'wiki-icons/Buff_Elem._Def._Up.png',
        'Phys_Def_Up.png': 'wiki-icons/Buff_Phys._Def._Up.png',
        'Phys_Def_Boost.png': 'wiki-icons/Buff_Phys._Def._Up.png',
        'SP_Stock.png': 'wiki-icons/Buff_SP_Stock.png',
        'SP_Recovery.png': 'wiki-icons/Buff_SP_Stock.png',
        'SP_Regen.png': 'wiki-icons/Buff_SP_Stock.png',
        
        // Weapon icons - map to available wiki-icons weapon types
        'Sword.png': 'wiki-icons/Type_Swords.png',
        'Dagger.png': 'wiki-icons/Type_Daggers.png',
        'Staff_Staves.png': 'wiki-icons/Type_Staves.png',
        'Bow.png': 'wiki-icons/Type_Bows.png',
        'Axe.png': 'wiki-icons/Type_Axes.png',
        'Spear_Polearm.png': 'wiki-icons/Type_Polearms.png',
        'Fan.png': 'wiki-icons/Type_Fans.png',
        'Tome.png': 'wiki-icons/Type_Tomes.png',
        
        // Element icons - map to available wiki-icons
        'Lightning_Thunder.png': 'wiki-icons/Type_Lightning.png',
        'Dark.png': 'wiki-icons/Type_Dark.png',
        'Fire.png': 'wiki-icons/Type_Fire.png',
        'Ice.png': 'wiki-icons/Type_Ice.png',
        'Wind.png': 'wiki-icons/Type_Wind.png',
        'Light.png': 'wiki-icons/Type_Light.png',
        
        // Resistances
        'Fire_Resilience.png': 'wiki-icons/Buff_Fire_Res._Up.png',
        'Ice_Resilience.png': 'wiki-icons/Buff_Ice_Res._Up.png',
        'Lightning_Resilience.png': 'wiki-icons/Buff_Lightning_Res._Up.png',
        'Wind_Resilience.png': 'wiki-icons/Buff_Wind_Res._Up.png',
        'Light_Resilience.png': 'wiki-icons/Buff_Light_Res._Up.png',
        'Dark_Resilience.png': 'wiki-icons/Buff_Dark_Res._Up.png',
        
        // Special abilities
        'Thief_Evasion.png': 'wiki-icons/Buff_Thief\'s_Evasion.png',
        'Thiefs_Evasion.png': 'wiki-icons/Buff_Thief\'s_Evasion.png',
        'Vim_and_Vigor.png': 'wiki-icons/Buff_Vim_and_Vigor.png',
        'Sidesstep.png': 'wiki-icons/Buff_Evade_Phys._Atk.png',
        
        // Direct mapping for existing wiki-icons
        'Buff_Phys._Atk._Up.png': 'wiki-icons/Buff_Phys._Atk._Up.png',
        'Buff_Elem._Atk._Up.png': 'wiki-icons/Buff_Elem._Atk._Up.png',
        'Buff_Spd._Up.png': 'wiki-icons/Buff_Spd._Up.png',
        'Buff_Phys._Def._Up.png': 'wiki-icons/Buff_Phys._Def._Up.png',
        'Buff_Elem._Def._Up.png': 'wiki-icons/Buff_Elem._Def._Up.png',
        'Buff_Crit._Up.png': 'wiki-icons/Buff_Crit._Up.png',
        'Buff_SP_Stock.png': 'wiki-icons/Buff_SP_Stock.png',
        'Buff_BP_Recovery_Up.png': 'wiki-icons/Buff_BP_Recovery_Up.png',
        'Buff_HP_Barrier.png': 'wiki-icons/Buff_HP_Barrier.png'
    };
    // Normalize the icon name to remove variants
    const normalizedName = normalizeIconName(iconName);
    const iconPath = sharedIcons[normalizedName];
    return iconPath ? paths.images(iconPath) : null;
}

// Get attribute icon path
function getAttributeIconPath(iconName) {
    // This would be expanded based on actual icon mapping
    // For now, use pathUtils for any provided icon path
    return iconName ? paths.images(iconName) : null;
}

// Process skill content
function processSkillContent(content) {
    const imgMatch = content.match(/<img src="([^"]+)"[^>]*>/);
    const skillMatch = content.match(/\*\*(.*?)\*\*/);
    const description = content.replace(/<img[^>]*>/, '').replace(/\*\*[^*]+\*\*/, '').trim();
    
    if (imgMatch && skillMatch) {
        const imageSrc = imgMatch[1];
        const skillName = skillMatch[1];
        
        return `
            <div class="skill-content">
                <img src="${processImagePath(imageSrc)}" alt="${skillName}" class="skill-icon" onerror="this.outerHTML='<div class=\\'skill-icon-fallback\\'>⚔️</div>'">
                <div class="skill-details">
                    <div class="skill-name">${skillName}</div>
                    <div class="skill-description">${description}</div>
                </div>
            </div>
        `;
    }
    return content;
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Replace all notion:// URLs with fallback before processing
    html = html.replace(/notion:\/\/[^\s)]+/g, (match) => {
        return getNotionEmojiReplacement(match);
    });
    
    // Skip to first header
    const firstHeaderIndex = html.indexOf('\n##');
    if (firstHeaderIndex !== -1) {
        html = html.substring(firstHeaderIndex);
    }
    
    // Stop at Misc section
    const miscIndex = html.indexOf('\n## Misc.');
    if (miscIndex !== -1) {
        html = html.substring(0, miscIndex);
    }
    
    // Convert headers with section IDs for priority links
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, (match, title) => {
        // Add section IDs for priority links
        if (title.toLowerCase().includes('accessory') || title.toLowerCase().includes('awakening')) {
            return `<h2 id="modal-accessory-section">${title}</h2>`;
        }
        if (title.toLowerCase().includes('ultimate technique')) {
            return `<h2 id="modal-ultimate-section">${title}</h2>`;
        }
        return `<h2>${title}</h2>`;
    });
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Process skill blocks
    html = html.replace(/<aside>([\s\S]*?)<\/aside>/gim, (match, content) => {
        return `<div class="skill-item">${processSkillContent(content)}</div>`;
    });
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Process sections
    const sections = html.split(/(<h2>.*?<\/h2>)/);
    let processedHtml = '';
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim();
        if (!section) continue;
        
        if (section.startsWith('<h2>')) {
            processedHtml += section;
        } else {
            let sectionContent = section
                .replace(/\n\n+/g, '\n')
                .replace(/\n/g, ' ')
                .trim();
            
            if (sectionContent) {
                processedHtml += `<div class="section-content">${sectionContent}</div>`;
            }
        }
    }
    
    return processedHtml;
}

// Export all functions
export {
    findMarkdownFile,
    extractMetadata,
    createCompactStatsTable,
    createAttributesSection,
    markdownToHtml,
    processImagePath,
    getSharedIconPath,
    getAttributeIconPath,
    normalizeCharacterName,
    getNotionEmojiReplacement
};