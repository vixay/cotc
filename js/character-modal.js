/**
 * Character Details Modal
 * Handles loading and displaying character details from markdown files
 */

class CharacterModal {
    constructor() {
        this.modal = document.getElementById('characterModal');
        this.modalTitle = document.getElementById('modalCharacterName');
        this.modalMeta = document.getElementById('modalCharacterMeta');
        this.modalLoading = document.getElementById('modalLoading');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = document.getElementById('closeModal');
        
        this.currentCharacter = null;
        this.markdownCache = new Map();
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    async open(character) {
        this.currentCharacter = character;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update header
        this.modalTitle.textContent = character.name;
        this.modalMeta.textContent = `${character.job || 'Unknown Job'} • ${character.influence || 'Unknown Influence'}`;
        
        // Show loading state
        this.modalLoading.style.display = 'block';
        this.modalBody.style.display = 'none';
        
        try {
            await this.loadCharacterDetails(character);
        } catch (error) {
            console.error('Failed to load character details:', error);
            this.showError('Failed to load character details. Please try again.');
        }
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentCharacter = null;
    }
    
    async loadCharacterDetails(character) {
        // Try to load from cache first
        let markdownContent = this.markdownCache.get(character.id);
        
        if (!markdownContent) {
            // Find the markdown file for this character
            const markdownPath = await this.findMarkdownFile(character);
            if (!markdownPath) {
                this.showError(`No detailed information found for ${character.name}`);
                return;
            }
            
            // Load markdown content
            const response = await fetch(markdownPath);
            if (!response.ok) {
                throw new Error(`Failed to load markdown: ${response.statusText}`);
            }
            
            markdownContent = await response.text();
            this.markdownCache.set(character.id, markdownContent);
        }
        
        // Process and display the content
        this.displayCharacterDetails(character, markdownContent);
    }
    
    async findMarkdownFile(character) {
        // Create mapping for character names to markdown files based on the pattern:
        // "Character Name UUID.md"
        
        // First, try to find by loading a list of all available markdown files
        // Since we can't list directory contents directly, we'll use a pre-generated mapping
        const markdownMapping = await this.getMarkdownMapping();
        
        // Try exact match first
        if (markdownMapping[character.name]) {
            return markdownMapping[character.name];
        }
        
        // Try normalized name matching (handle case sensitivity, accents, etc.)
        const normalizedName = this.normalizeCharacterName(character.name);
        for (const [fileName, filePath] of Object.entries(markdownMapping)) {
            if (this.normalizeCharacterName(fileName) === normalizedName) {
                return filePath;
            }
        }
        
        return null;
    }
    
    async getMarkdownMapping() {
        // Generate dynamic mapping from available files
        // Extract character name from filename pattern: "Character Name UUID.md"
        const knownFiles = [
            "2B 4d53e4dd304b48ad98744b9b533822a7.md",
            "9S 2804f181146e4a32acb08d4ac6d7d0e8.md",
            "A2 8f13b80b261b41f7a5668f4c13a99e69.md",
            "Adelle b1646afb6bed4e45b4440e1270fc9038.md",
            "Aedelgard c55e0c3df0604c7c974e7ebebec27176.md",
            "Agnea 72773c66a6c1479d80b95efa446356ca.md",
            "Agnea EX 957b26cd717843fb8f7db2b20c51dd05.md",
            "Agnès 8afa64dfee594cf2a16abf36b24350ca.md",
            "Alaune 19b8b4709eab4b7395adc265b6a3cfc9.md",
            "Alaune EX ec7114138d15469eaba96dbcc2f2c77b.md",
            "Alfyn 0adaae0e4dab41ad9ecca346dfbdbd50.md",
            "Alrond d29d3cb19e35446aaa0fb1d9a125e729.md",
            "Aoi 221ebbc65396809a8422d16fb197cc0f.md",
            "Ashlan c833a487be604a9691b19d84ce911f73.md",
            "Aslyte d232fc52d1424dbe99416321e28a9d49.md",
            "Auguste 14253cec865f4f649033f00dc8849c0b.md",
            "Avar 1d1ebbc6539680d892c8d2991a1694f0.md",
            "Aviette 233ebbc65396808aaa5ef1585b3527b1.md",
            "Bargello 6c7116e5271b4b2a96fcacab716cb72b.md",
            "Bargello EX f7d7528ed95149d4be8dadc2ca3d82e9.md",
            "Barrad 717bd41a5be245a9b51d7f23c93381af.md",
            "Bertrand 5189a8e9de49428398c33f046d41a1ef.md",
            "Billy f1c6c01cfaff4b10b395faf979349378.md",
            "Black Knight 17cebbc65396803e87b3c3476fb6d8d7.md",
            "Black Maiden 17cebbc6539680e28887d7146dccb07e.md",
            "Brigitte b42abf38dc3f4cba84caed82e8286203.md",
            "Camilla 02759ca04d984c6992d810c9c8a7ce26.md",
            "Canary a9085f20bf09486f9543b6c63048435c.md",
            "Cardona 9604c31ecedb47f5886b8781e8e6def3.md",
            "Carroll ff623797c56d42d591591c1d620bcc90.md",
            "Cassia 221ebbc653968017ae27ec578c3da102.md",
            "Castti 47b3d85a2d4c4383a2626e73accea4e6.md",
            "Castti EX 1f0ebbc6539680648db9ccc813d68102.md",
            "Cecil 3510b8a2aa724b76958949d110e1bcbe.md",
            "Cecily 2c1be50e49cb4feb82e22b5ff137c75f.md",
            "Cedric 5b839eaa49f74dafbc6324a89a229f8f.md",
            "Ceraphina 11bebbc653968078b9b3c30223781d40.md",
            "Cerna 92e2583fee504eb68fb17372833a73b4.md",
            "Chloe 076335ce3e92485aa4cc0dd4cb79c003.md",
            "Cless 3ed11f12962842fc8f23d55e383ad7dd.md",
            "Conny 4f26090435314712b9fc5f2e1eab2ace.md",
            "Cornelia 509b635c3cf34d2a960b759e92b6e894.md",
            "Crick 144ebbc653968005a075dc679f5ec4ad.md",
            "Cyrus c0ae4537a77d4c128b6efbd26342a65c.md",
            "Cyrus EX 198ebbc6539680aca1f5f76896724950.md",
            "Devin bf2d6adf2f074c978248a21f643fead2.md",
            "Diego a13e29e180e74d1bab0d7c7bc376478a.md",
            "Ditraina 552389f008be43fea5f1eeeff1adf1d1.md",
            "Ditraina EX 129ebbc65396809a9978c62161d81589.md",
            "Dolcinaea 51e9fbc3bcf443ccb80a600544235d6c.md",
            "Dorothea bc9f8d3fb82c4e92a1d8843a03591ca0.md",
            "Dorrie 31c38bc1cfc24f0088828c940499d1c3.md",
            "Durand e455924302b948c8976078ce4f3ac387.md",
            "Edea 4d87730cb6b74b78b0788f81fb5d484b.md",
            "Efrain 684c878ff0414fdbbb8433852736d24b.md",
            "Eleonora 46587ea5b1a04db082a17c24254fccd3.md",
            "Eliza cb1df363db4e4e8597b60c44001aca07.md",
            "Elrica 4e76ee1908514ff6a028390ff54752d5.md",
            "Elrica EX 129ebbc6539680098cd2f94661257fd8.md",
            "Eltrix dd25020b671f468da8e35dfa8831e78b.md",
            "Elvis 674c5ad3f15c424a86b3d5ad984d9489.md",
            "Emil 264857172c4d480a8fb5978f69d958b8.md",
            "Esmeralda 20cebbc65396800c8948e4de6de05bcb.md",
            "Eunice aa0acff804524a8682b3a79cdd970c65.md",
            "Evelyn 3f6803c735294d4885f648b8d3b17a4e.md",
            "Fabio 9e6c21e78eec456e8fadcf351c2b102f.md",
            "Falco 0553966504eb4401aece17059442633b.md",
            "Felline f7ad7a58d7574f30968a4633b3d4aac8.md",
            "Fiore 1a78e1b64fbd436da894dcb01e60226b.md",
            "Fiore EX 2a3e30bbc3d346358382cef9d67fdd51.md",
            "Frederica fbe95acb684e4183a893ee1537e9b4b4.md",
            "Gertrude 6eed317c1b3d41c58888633e55e3f0d3.md",
            "Gilderoy 29f761caf41e4d0da662ffb0a78903e4.md",
            "Gloria ddee867cb49b4f2b9ff58af16d921cd6.md",
            "Glossom 0e258a3265434cc7abd227395326a27a.md",
            "Grieg 0f743ab4139247af99a83adb17d6f64f.md",
            "Guti ab837e9dc3e440a381d21ebeff4d51f8.md",
            "Hammy ff5b4c5ea21a4a84917aefb2792b7aa7.md",
            "Harley 6e6b6e0569a042859b094d66db74dd6b.md",
            "Harry cee04001c10a4420a8f13af486af99bf.md",
            "Hasumi 686065585d3f439aa0a22bf59606b57d.md",
            "Hayes 09d6921c657a4a31961ec81fe71ed863.md",
            "Heathcote a0b559ba21f846f28df33c480a76a067.md",
            "Heinz c40c358fe8544f82bbbee30be629a3e8.md",
            "Helga 210428a888a74dd483f38e31499dc45f.md",
            "Herminia e264444c4f604236a29e03e95a61348a.md",
            "Hikari 8d6a252422aa4aa390ed139c58969103.md",
            "Hikari EX 16debbc6539680c483e1e62265b4e5e4.md",
            "Hujheb 4605156386384350afc89f8f4e6df34f.md",
            "H'aanit EX dab7c0f8141348628f4a050a136bcab0.md",
            "H'aanit ec935c0898cf43b782e1a2026cea0033.md",
            "Iris 5ce086ba2bfa4760aef7e02de8df1f09.md",
            "Isla 73fee5d09608404497f200406f7eea90.md",
            "Jane c9fe35fcb53f403db313f5fa306c5727.md",
            "Jillmeila c2d2f84979444bf2958668454dbe03a0.md",
            "Jorge b3e0546d3ea442a1a3a07a73e75d0c53.md",
            "Jorn d75d8b4362654544a92483a5e5018f51.md",
            "José 6c02e64201494f8fa03b975ec63d2e4c.md",
            "Joshua b4ab013ac82a43268fd7c56780045ca0.md",
            "Juan cf5d0bd6e557486fbb9b972f9b58adb1.md",
            "Julio 90d801d029be4a8fbf2a1ec88326c17d.md",
            "Kagemune 162ebbc65396808cb7bfd9530acb1e7a.md",
            "Kainé 513f1fa9fc7f4586a7d7228dbcb5f006.md",
            "Kazan 21febbc6539680f9b8caef2468681221.md",
            "Kenneth ac4d889b89b449b78159d94b746bc5df.md",
            "Kersjes 4f686bf7c46c493993f88d5f91e1a600.md",
            "Kilns 2e179d6832b2405494c233b747f4b824.md",
            "Kouren 5f32a0cf626d4837b32090c26830b924.md",
            "Krauser 7b8b67b271cb483ab8d60e4807dfd5d4.md",
            "Kurtz 1abde49c0f264b9aa0c351571d7d9ce0.md",
            "Largo ad5773151d4f464c987cb646d84d2f92.md",
            "Lars 9abcb7e17ebc454689d3325b6d2fb9b9.md",
            "Laura da7090b374b24027840b99d4e19826bc.md",
            "Lemaire 4f1afeb5f7e543539abc66aa0df0e7a8.md",
            "Leon 31a5df6ec0be47e5b3e63a4a3dfba5ad.md",
            "Levan 3fee007cea0e4a419cb5459215f836ca.md",
            "Levina 048247e79aa847a58d08a4109c5f0530.md",
            "Lianna ddc385d6c0b540178a07c805dbcaf7af.md",
            "Lionel e3378a708e724d60911c8d24770e2557.md",
            "Lolo bb953a859ce1424aa3108dcc9ac322be.md",
            "Lucetta cde30b2f85ae4ff8818a757d487caf59.md",
            "Lumis 3e7fba0b6fa045e392875c7eb6af6f53.md",
            "Lumis EX 37cb785214f84abea2fe98707323c6d5.md",
            "Lynette 9eac141db41d466781587a639658b96f.md",
            "Mabel 979f299e74bc4a04b3615a8282298f39.md",
            "Madelaine 933fc4ad82ed4dc5911e5add4f6bde9e.md",
            "Magnolia 20116b1bbd0840c8af8abddbf04c8bcc.md",
            "Mahrez 205ebbc65396801b9bdfea2658db1aad.md",
            "Manuel ac0c38345cac428f9f2d89a2862391d4.md",
            "Meena f93da89c76304e14a88eb2231645d3e8.md",
            "Menno ff1dd646aabe46a7bdbae3dd3946d2cb.md",
            "Menny f8e48e04089147cf8e2e6d10b10cfa23.md",
            "Merrit c76d731824624c478a12cb903f8d1b38.md",
            "Miles 2d1baafa39204bac8149332468543b1f.md",
            "Millard 39f80e25112d49548e22c2d5a19c43f5.md",
            "Millard EX b53f902c1e184a038055d1dd09c47e23.md",
            "Mirgardi 29ec927fa9cf4c948283a48835391aa5.md",
            "Molrusso EX 198ebbc6539680608c54daa6b46c874f.md",
            "Molrusso d6241f7695904fe59f455d079f0ab5a4.md",
            "Molu ed8a91fba0aa46c0b3d09ebd214b603b.md",
            "Morena 153ebbc6539680248e23ffb1f5561185.md",
            "Morffins 9fd9bf74f02a49508c79b05932a5ad6e.md",
            "Mydia 136ebbc6539680f2a1d8f93c0899f86f.md",
            "Nanna dcf625723dce471a986a0a1875678020.md",
            "Narr 7146f96e00874d1ba42fc890ebe28f86.md",
            "Neha 0dab86a4d4e345a6a8835c321377054d.md",
            "Nephti 08e7fe5d31e1427699e7a9900902ec5f.md",
            "Nicola f48bedc1b4fd49ddb16c105f3e30e2c9.md",
            "Nier 30268eef5c2d44c4a5f24e60c7d27ded.md",
            "Nina-Lanna 41fafd7b5a0a43f6b2d48cc5f0b11169.md",
            "Nivelle 4acce64c0df94197bd001bbc2313ee03.md",
            "Noelle dcb2f285314043e4b05809d45904e1b5.md",
            "Nona 51bf88f25ad248f7a69eda5f60c2f5da.md",
            "O Odio 11d32277c12f4b7a910336badd61c34e.md",
            "Ochette EX 1e3ebbc6539680578d1bf7b5d6d4061a.md",
            "Ochette bf423c4223f047aa8e7576dae557ea38.md",
            "Odette 6fcff801aead446d9862d53300baff81.md",
            "Oersted 4fa33078a2534909872fed84ae72a1b4.md",
            "Ogen bc368805f3df4e109e4f5b2db89d0b17.md",
            "Olberic 042d570f89724450960dad310c49cd7a.md",
            "Ophilia 72a44443a5874590bd7822bd2d0ce683.md",
            "Ophilia EX 13f3c778e1e24bb69acf30857683b4fe.md",
            "Ori 10debbc6539680ea8766ff1ad52ae9e1.md",
            "Oskha be911aaadedd48ef97f27b7a066cbc7d.md",
            "Osvald 32133453bf2e4a2aa84cf6b094dee5d6.md",
            "Osvald EX 1e4ebbc653968070a9e4c7ee1588a898.md",
            "Pardis III 11bebbc65396801bb84fccfc754ccd5c.md",
            "Partitio 9479ac566db44e1e9f0013d5e3141722.md",
            "Partitio EX 1b4ebbc65396805cb00fea681b82ca8a.md",
            "Paula 9eea4477ceb74020bea0ebbdce9b2e21.md",
            "Pearl 63160145a41945608e0f458502f729e9.md",
            "Penny d2d5576126aa4824aed923094b97bb99.md",
            "Peredir 7a059ea026c84d50be779fdcaad2af40.md",
            "Pia d547366a8c004a8fac8e0f6198bd08af.md",
            "Pirro 04f0886a45b248a1be8fcb9b16417e7a.md",
            "Primrose 5eed6c354f1d474da4d78f995500d05a.md",
            "Primrose EX 42afb94290ab4f4f9b4a9e8465a0281e.md",
            "Promme f0e76fb083bb4a2f9f89122bba1f2b1a.md",
            "Rai Mei 16debbc6539680b8820dde00d4fb0d3a.md",
            "Ramona d826377e12984452b7bf7ae1a8310afa.md",
            "Relisha d662288eceb04e3da4d06976a194beef.md",
            "Richard 362c2751aafd471997d15aabca9739bc.md",
            "Ringabel 7f3ec91af1724d57a15d43881ee047c5.md",
            "Rinyuu 94482574b6ba428f9ce260d49944723a.md",
            "Rinyuu EX 39c064f89e9f4e50ab4715b4dae8f66c.md",
            "Rique 03cb41beb766464083f85e40d3bfaf82.md",
            "Rita a51cbe9fa0cc416a9e40f2cdbf2f8be2.md",
            "Ri'tu b3d82486ade74487bf33193571d2a536.md",
            "Rodion 34a30f0009e54b67a0d2065f4f43730d.md",
            "Roland d3f1987079004a03bd30bcfd7b5d8706.md",
            "Rondo e8b398a94b624ba58a14e8dcb4304a47.md",
            "S Odio d9f0b853ee8742d5890c40306a630a30.md",
            "Sail aa71b741d53b421b9add798960e4d2c4.md",
            "Saria a8b32d2ff6a34c50ae8fa771bae3f94e.md",
            "Sarisa 5e3faa6e104c4a628305ee55c2b2b4da.md",
            "Sazantos EX 6873dec8f7fc4f40a50f930e45574a77.md",
            "Sazantos a84bb990a2964b3c8a4bdcc48cbd0e45.md",
            "Scarecrow d7c4eb5e8262427a94f91cf6de4d7122.md",
            "Serenoa 8a62f393d9824de3b49e6d5def009cc7.md",
            "Sertet 4ba636bd37fe435882e1e171245151a9.md",
            "Shana 2de86ef4cff44c50bc6b2f504687e2aa.md",
            "Shelby 68098643306d40afbef5151ac0a7e96d.md",
            "Signa 1f2215a0efde439985de36ab8b4308fb.md",
            "Signa EX 1b4ebbc6539680fc9a7cff99476433b0.md",
            "Sigrid EX 174ebbc653968010a8b8fc15dab6bf63.md",
            "Sigrid e8c2139a028b4923bbbb37496dfb9751.md",
            "Sofia 00068123fe9b435bb0071c737bee5e8b.md",
            "Sofia EX 0cd5fb04c5714f579a737206fb030b3a.md",
            "Soleil 47332ff5677b4724a50d155c896f82f2.md",
            "Solon 0e4447087f6b4b8e842172d7180bed33.md",
            "Sonia 1a52641a316e4328abaad736997a723f.md",
            "Sowan f639447a2228444093dd68e45bf96e6c.md",
            "Stead 48526d8441c746b09732618916be5786.md",
            "Streibough 9f1cafebe58b48d4966d68c34672869b.md",
            "Sunny 7d4760df79a7493880978b610e7ad328.md",
            "Tahir 8cbcafee87bd4d4b947d1b36e6ff3798.md",
            "Tatloch 0317ed510d074df59c8d147c133e6e30.md",
            "Tatloch EX 1926373cb6c243798c392230f48f6a02.md",
            "Telly 73de0ae29a4c4e1186c955e86d0568da.md",
            "Temenos e9618150d4114b5697dbff2052b0ce94.md",
            "Theo 4daa8e3185ad44f5baeba9f1243d23f5.md",
            "Therese EX 1b5ebbc653968027b5edd0b40cbba48d.md",
            "Therese f1259e8a84e74d4eb4e9fd8e1101259c.md",
            "Therion 8c6c7322344d49f0b4b3ad546f12e697.md",
            "Throné 3e5b859554994db99efc90e493970dab.md",
            "Tikilen 666ea822f3e94ed9bef1345e885411d8.md",
            "Tithi 6b0b78e90f9c46239c270d011403c015.md",
            "Tiziano 1c047902f28d439ab31333aa0088e6b2.md",
            "Tressa 32ebb4b2b9b74f599fddb0edc5777a59.md",
            "Tressa EX 0b5db6785d514c2ebb35033b73fd11b7.md",
            "Trish 534f3ac4bf62459285467d995c06316b.md",
            "Tytos 6f897e4a2f9c48588c6ae7e50ce332e3.md",
            "Varkyn afa284a57f824c36acc544d4fe11f5a2.md",
            "Viola 5251b06411cc42dc992990a04d2eddd3.md",
            "Viola EX 198ebbc6539680889216cfe380b17678.md",
            "Vivian a647184c363244cf83bd502dbca126ff.md",
            "Wingate f4b1f95609ce4d1d879daafa91166229.md",
            "W'ludai 4edb449b69e34b5b8480e5e38d1c66c1.md",
            "Yan Long 386d5bd74f8b4a9ba740b0ca86e6aee6.md",
            "Yugo 87a5c47902cb4c558758f236419a80b3.md",
            "Yukes 80f17b157c0b4234a9eafee83f2ad2d7.md",
            "Yunnie 2c3735a715b84bf2899890ea29d7b21e.md",
            "Zenia a87943df6c154cd691dac2a76d9a9c9d.md",
            "Z'aanta 5997ce2d9c7b45d1b9ffb95344192998.md"
        ];

        const mapping = {};
        for (const filename of knownFiles) {
            // Extract character name from "Character Name UUID.md" pattern
            const characterName = filename.replace(/\s+[a-f0-9]{32}\.md$/i, '').trim();
            mapping[characterName] = `data/Character Markdown/${filename}`;
        }
        
        return mapping;
    }
    
    normalizeCharacterName(name) {
        return name
            .toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            .replace(/'/g, "'") // Normalize apostrophes
            .trim();
    }
    
    displayCharacterDetails(character, markdownContent) {
        this.modalLoading.style.display = 'none';
        this.modalBody.style.display = 'block';
        
        // Parse markdown and create character details
        const content = this.parseMarkdownContent(character, markdownContent);
        this.modalBody.innerHTML = content;
        
        // Process images after content is inserted
        this.processImages();
    }
    
    parseMarkdownContent(character, markdown) {
        // Extract metadata from markdown first
        const metadata = this.extractMetadata(markdown);
        
        // Create compact layout with tabs or sections
        let html = `
            <div class="character-overview">
                <div class="character-info-grid">
                    ${this.createCompactStatsTable(metadata)}
                    ${this.createAttributesSection(metadata)}
                </div>
            </div>
            <div class="character-content">
                ${this.markdownToHtml(markdown)}
            </div>
        `;
        
        return html;
    }
    
    createCompactStatsTable(metadata) {
        return `
            <div class="stats-table">
                <h4>Character Stats</h4>
                <table>
                    <tr><td>HP</td><td>${metadata.hp || 'N/A'}</td><td>SP</td><td>${metadata.sp || 'N/A'}</td></tr>
                    <tr><td>P.Atk</td><td>${metadata.pAtk || 'N/A'}</td><td>P.Def</td><td>${metadata.pDef || 'N/A'}</td></tr>
                    <tr><td>E.Atk</td><td>${metadata.eAtk || 'N/A'}</td><td>E.Def</td><td>${metadata.eDef || 'N/A'}</td></tr>
                    <tr><td>Crit</td><td>${metadata.crit || 'N/A'}</td><td>Speed</td><td>${metadata.spd || 'N/A'}</td></tr>
                </table>
            </div>
        `;
    }
    
    extractMetadata(markdown) {
        const metadata = {};
        
        // Extract basic info
        const lines = markdown.split('\n');
        for (const line of lines) {
            const cleanLine = line.trim();
            
            // Basic character info
            if (cleanLine.startsWith('Japanese Name:')) metadata.japaneseName = cleanLine.replace('Japanese Name:', '').trim();
            if (cleanLine.startsWith('Class:')) metadata.starRating = cleanLine.replace('Class:', '').trim();
            if (cleanLine.startsWith('Job:')) metadata.job = cleanLine.replace('Job:', '').trim();
            if (cleanLine.startsWith('Influence:')) metadata.influence = cleanLine.replace('Influence:', '').trim();
            if (cleanLine.startsWith('Continent:')) metadata.continent = cleanLine.replace('Continent:', '').trim();
            if (cleanLine.startsWith('Location:')) metadata.location = cleanLine.replace('Location:', '').trim();
            if (cleanLine.startsWith('Attributes:')) metadata.attributes = cleanLine.replace('Attributes:', '').trim();
            if (cleanLine.startsWith('Ultimate Priority:')) metadata.ultPriority = cleanLine.replace('Ultimate Priority:', '').trim();
            
            // Stats
            if (cleanLine.startsWith('HP:')) metadata.hp = cleanLine.replace('HP:', '').trim();
            if (cleanLine.startsWith('SP:')) metadata.sp = cleanLine.replace('SP:', '').trim();
            if (cleanLine.startsWith('P.Atk:')) metadata.pAtk = cleanLine.replace('P.Atk:', '').trim();
            if (cleanLine.startsWith('P.Def:')) metadata.pDef = cleanLine.replace('P.Def:', '').trim();
            if (cleanLine.startsWith('E.Atk:')) metadata.eAtk = cleanLine.replace('E.Atk:', '').trim();
            if (cleanLine.startsWith('E.Def:')) metadata.eDef = cleanLine.replace('E.Def:', '').trim();
            if (cleanLine.startsWith('Crit:')) metadata.crit = cleanLine.replace('Crit:', '').trim();
            if (cleanLine.startsWith('Spd:')) metadata.spd = cleanLine.replace('Spd:', '').trim();
        }
        
        return metadata;
    }
    
    createAttributesSection(metadata) {
        if (!metadata.attributes) return '';
        
        // Parse attributes from the raw string (e.g., "Axe%2012.png, Lightning_Thunder%2016.png")
        const attributeFiles = metadata.attributes.split(',').map(attr => attr.trim());
        const attributes = [];
        
        for (const attrFile of attributeFiles) {
            // Decode URL encoding and extract the base name
            const decoded = decodeURIComponent(attrFile);
            const baseName = decoded.replace(/\s*\d+\.png$/, '').replace(/\.png$/, '').trim();
            
            // Map common patterns
            if (baseName.includes('Axe')) attributes.push('Axe');
            else if (baseName.includes('Bow')) attributes.push('Bow');
            else if (baseName.includes('Dagger')) attributes.push('Dagger');
            else if (baseName.includes('Fan')) attributes.push('Fan');
            else if (baseName.includes('Spear') || baseName.includes('Polearm')) attributes.push('Spear');
            else if (baseName.includes('Staff') || baseName.includes('Staves')) attributes.push('Staff');
            else if (baseName.includes('Sword')) attributes.push('Sword');
            else if (baseName.includes('Tome')) attributes.push('Tome');
            else if (baseName.includes('Fire')) attributes.push('Fire');
            else if (baseName.includes('Ice')) attributes.push('Ice');
            else if (baseName.includes('Lightning') || baseName.includes('Thunder')) attributes.push('Lightning');
            else if (baseName.includes('Wind')) attributes.push('Wind');
            else if (baseName.includes('Light')) attributes.push('Light');
            else if (baseName.includes('Dark')) attributes.push('Dark');
        }
        
        if (!attributes.length) return '';
        
        return `
            <div class="attributes-table">
                <h4>Weapons & Elements</h4>
                <div class="attribute-icons">
                    ${attributes.map(attr => `
                        <div class="attribute-icon">
                            <img src="images/${this.getAttributeIconPath(attr)}" alt="${attr}" onerror="this.style.display='none'">
                            <span>${attr}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getAttributeIconPath(attribute) {
        // Map attribute names to icon paths
        const iconMap = {
            'Sword': 'weapons/Sword.png',
            'Axe': 'weapons/Axe.png',
            'Bow': 'weapons/Bow.png',
            'Dagger': 'weapons/Dagger.png',
            'Spear': 'weapons/Spear_Polearm.png',
            'Staff': 'weapons/Staff_Staves.png',
            'Tome': 'weapons/Tome.png',
            'Fan': 'weapons/Fan.png',
            'Fire': 'elements/Fire.png',
            'Ice': 'elements/Ice.png',
            'Lightning': 'elements/Lightning.png',
            'Wind': 'elements/Wind.png',
            'Light': 'elements/Light.png',
            'Dark': 'elements/Dark.png'
        };
        
        return iconMap[attribute] || `${attribute.toLowerCase()}.png`;
    }
    
    // Removed unused functions - now using extractMetadata instead
    
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Remove the metadata section (everything before the first ##)
        const firstHeaderIndex = html.indexOf('\n##');
        if (firstHeaderIndex !== -1) {
            html = html.substring(firstHeaderIndex);
        }
        
        // Remove everything from "## Misc." onwards
        const miscIndex = html.indexOf('\n## Misc.');
        if (miscIndex !== -1) {
            html = html.substring(0, miscIndex);
        }
        
        // Convert headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Convert aside blocks (skill sections) to compact format
        html = html.replace(/<aside>([\s\S]*?)<\/aside>/gim, (match, content) => {
            return `<div class="skill-item">${this.processSkillContent(content)}</div>`;
        });
        
        // Convert bold text
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        
        // Split into sections and clean up
        const sections = html.split(/(<h2>.*?<\/h2>)/);
        let processedHtml = '';
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i].trim();
            if (!section) continue;
            
            if (section.startsWith('<h2>')) {
                processedHtml += section;
            } else {
                // Process section content more compactly
                let sectionContent = section
                    .replace(/\n\n+/g, '\n')  // Remove excessive line breaks
                    .replace(/\n/g, ' ')      // Convert remaining line breaks to spaces
                    .trim();
                
                if (sectionContent) {
                    processedHtml += `<div class="section-content">${sectionContent}</div>`;
                }
            }
        }
        
        return processedHtml;
    }
    
    processSkillContent(content) {
        // Extract image and skill information
        const imgMatch = content.match(/<img src="([^"]+)"[^>]*>/);
        const skillMatch = content.match(/\*\*([^*]+)\*\*/);
        const description = content.replace(/<img[^>]*>/, '').replace(/\*\*[^*]+\*\*/, '').trim();
        
        if (imgMatch && skillMatch) {
            const imageSrc = imgMatch[1];
            const skillName = skillMatch[1];
            
            return `
                <div class="skill-content">
                    <img src="${this.processImagePath(imageSrc)}" alt="${skillName}" class="skill-icon" onerror="this.outerHTML='<div class=\\'skill-icon-fallback\\'>⚔️</div>'">
                    <div class="skill-details">
                        <div class="skill-name">${skillName}</div>
                        <div class="skill-description">${description}</div>
                    </div>
                </div>
            `;
        }
        
        return content;
    }
    
    
    getSharedIconPath(iconName) {
        // Map common icons to shared locations
        const sharedIcons = {
            // Stat boosts
            'Phys_Atk_Boost.png': 'icons/stat_boosts/Phys_Atk_Boost.png',
            'Elem_atk_Boost.png': 'icons/stat_boosts/Elem_atk_Boost.png',
            'BP_Recovery_Boost.png': 'icons/stat_boosts/BP_Recovery_Boost.png',
            'Critical_Force.png': 'icons/stat_boosts/Critical_Force.png',
            'Critical_Elemental_Damage.png': 'icons/stat_boosts/Critical_Elemental_Damage.png',
            'Max_HP_Boost.png': 'icons/stat_boosts/Max_HP_Boost.png',
            'Elem_Atk_Limit_Up.png': 'icons/stat_boosts/Elem_Atk_Limit_Up.png',
            'Phys_Atk_Limit_Up.png': 'icons/stat_boosts/Phys_Atk_Limit_Up.png',
            
            // Resistances
            'Fire_Resilience.png': 'icons/resistances/Fire_Resilience.png',
            'Ice_Resilience.png': 'icons/resistances/Ice_Resilience.png',
            'Lightning_Resilience.png': 'icons/resistances/Lightning_Resilience.png',
            'Wind_Resilience.png': 'icons/resistances/Wind_Resilience.png',
            'Light_Resilience.png': 'icons/resistances/Light_Resilience.png',
            'Dark_Resilience.png': 'icons/resistances/Dark_Resilience.png',
            'FireIce_Resilience.png': 'icons/resistances/FireIce_Resilience.png',
            'LightDark_Resilience.png': 'icons/resistances/LightDark_Resilience.png',
            'LightningWind_Resilience.png': 'icons/resistances/LightningWind_Resilience.png',
            'FireLightning_Resilience.png': 'icons/resistances/FireLightning_Resilience.png',
            
            // Healing/Recovery
            'Vim_and_Vigor.png': 'icons/healing_recovery/Vim_and_Vigor.png',
            'HP_Restoration.png': 'icons/healing_recovery/HP_Restoration.png',
            'SP_Recovery.png': 'icons/healing_recovery/SP_Recovery.png',
            'BP_Recovery.png': 'icons/healing_recovery/BP_Recovery.png',
            'Rehabilitate.png': 'icons/healing_recovery/Rehabilitate.png',
            
            // Special effects
            'Incite.png': 'icons/special_effects/Incite.png',
            'Cover.png': 'icons/special_effects/Cover.png',
            'Counter.png': 'icons/special_effects/Counter.png',
            'Sidesstep.png': 'icons/special_effects/Sidesstep.png',
            'Analyze.png': 'icons/special_effects/Analyze.png',
            'Buff.png': 'icons/special_effects/Buff.png',
            'Debuff.png': 'icons/special_effects/Debuff.png',
            'Barrier.png': 'icons/special_effects/Barrier.png',
            'Weakness_Follow-up.png': 'icons/special_effects/Weakness_Follow-up.png',
            'Bestow_Barrier.png': 'icons/special_effects/Bestow_Barrier.png',
            'Enchant.png': 'icons/special_effects/Enchant.png',
            'Raise.png': 'icons/special_effects/Raise.png',
            
            // Awakening
            'Awakening_IV.png': 'icons/awakening/Awakening_IV.png',
            
            // Common
            'Accessory.png': 'icons/common/Accessory.png',
            'More_Experience_(Joint).png': 'icons/common/More_Experience_(Joint).png',
            'Flag.png': 'icons/common/Flag.png'
        };
        
        return sharedIcons[iconName] || null;
    }
    
    processImagePath(imagePath) {
        // Handle different image sources
        if (imagePath.startsWith('https://')) {
            return imagePath; // External image
        }
        
        if (imagePath.startsWith('notion://')) {
            return this.getNotionEmojiReplacement(imagePath); // Notion emoji
        }
        
        // Local image - try shared icons first
        if (imagePath.includes('/')) {
            const parts = imagePath.split('/');
            const fileName = parts[parts.length - 1].replace(/%20/g, ' ');
            
            // Check if this is a shared icon
            const sharedPath = this.getSharedIconPath(fileName);
            if (sharedPath) {
                return `images/${sharedPath}`;
            }
            
            // Fall back to character-specific path
            const characterFolder = parts[0];
            return `images/skills/${characterFolder}/${fileName}`;
        }
        
        return `images/${imagePath}`;
    }
    
    getNotionEmojiReplacement(notionUrl) {
        // Return a generic icon path for Notion emojis
        // In a real implementation, you might want to create a mapping
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmMGYwZjAiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2Ij7imak8L3RleHQ+Cjwvc3ZnPgo=';
    }
    
    processImages() {
        // Process all images in the modal to handle missing ones gracefully
        const images = this.modalBody.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                // Replace with fallback
                if (!this.dataset.fallbackAttempted) {
                    this.dataset.fallbackAttempted = 'true';
                    
                    if (this.classList.contains('skill-icon')) {
                        this.outerHTML = '<div class="skill-icon-fallback">⚔️</div>';
                    } else if (this.src.includes('/weapons/')) {
                        this.outerHTML = '<div class="skill-icon-fallback">⚔️</div>';
                    } else if (this.src.includes('/elements/')) {
                        this.outerHTML = '<div class="skill-icon-fallback">🔥</div>';
                    } else {
                        this.style.display = 'none';
                    }
                }
            });
        });
    }
    
    showError(message) {
        this.modalLoading.style.display = 'none';
        this.modalBody.style.display = 'block';
        this.modalBody.innerHTML = `
            <div class="error-message" style="text-align: center; color: var(--text-secondary); padding: 48px 24px;">
                <h3>Unable to Load Character Details</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.characterModal = new CharacterModal();
});