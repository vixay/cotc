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
        // Return a mapping of character names to their markdown file paths
        // In a production app, this could be generated server-side or cached
        return {
            "2B": "data/Character Markdown/2B 4d53e4dd304b48ad98744b9b533822a7.md",
            "9S": "data/Character Markdown/9S 2804f181146e4a32acb08d4ac6d7d0e8.md",
            "A2": "data/Character Markdown/A2 8f13b80b261b41f7a5668f4c13a99e69.md",
            "Adelle": "data/Character Markdown/Adelle b1646afb6bed4e45b4440e1270fc9038.md",
            "Aedelgard": "data/Character Markdown/Aedelgard c55e0c3df0604c7c974e7ebebec27176.md",
            "Agnea": "data/Character Markdown/Agnea 72773c66a6c1479d80b95efa446356ca.md",
            "Agnea EX": "data/Character Markdown/Agnea EX 957b26cd717843fb8f7db2b20c51dd05.md",
            "Agnès": "data/Character Markdown/Agnès 8afa64dfee594cf2a16abf36b24350ca.md",
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
            "Cyrus": "data/Character Markdown/Cyrus c0ae4537a77d4c128b6efbd26342a65c.md",
            "Cyrus EX": "data/Character Markdown/Cyrus EX 198ebbc6539680aca1f5f76896724950.md",
            "Primrose": "data/Character Markdown/Primrose 5eed6c354f1d474da4d78f995500d05a.md",
            "Primrose EX": "data/Character Markdown/Primrose EX 42afb94290ab4f4f9b4a9e8465a0281e.md",
            "Tressa": "data/Character Markdown/Tressa 32ebb4b2b9b74f599fddb0edc5777a59.md",
            "Tressa EX": "data/Character Markdown/Tressa EX 0b5db6785d514c2ebb35033b73fd11b7.md",
            "Olberic": "data/Character Markdown/Olberic 042d570f89724450960dad310c49cd7a.md",
            "Ophilia": "data/Character Markdown/Ophilia 72a44443a5874590bd7822bd2d0ce683.md",
            "Ophilia EX": "data/Character Markdown/Ophilia EX 13f3c778e1e24bb69acf30857683b4fe.md",
            "Therion": "data/Character Markdown/Therion 8c6c7322344d49f0b4b3ad546f12e697.md",
            "H'aanit": "data/Character Markdown/H'aanit ec935c0898cf43b782e1a2026cea0033.md",
            "H'aanit EX": "data/Character Markdown/H'aanit EX dab7c0f8141348628f4a050a136bcab0.md",
            "Hikari": "data/Character Markdown/Hikari 8d6a252422aa4aa390ed139c58969103.md",
            "Hikari EX": "data/Character Markdown/Hikari EX 16debbc6539680c483e1e62265b4e5e4.md",
            "Osvald": "data/Character Markdown/Osvald 32133453bf2e4a2aa84cf6b094dee5d6.md",
            "Osvald EX": "data/Character Markdown/Osvald EX 1e4ebbc653968070a9e4c7ee1588a898.md",
            "Partitio": "data/Character Markdown/Partitio 9479ac566db44e1e9f0013d5e3141722.md",
            "Partitio EX": "data/Character Markdown/Partitio EX 1b4ebbc65396805cb00fea681b82ca8a.md",
            "Ochette": "data/Character Markdown/Ochette bf423c4223f047aa8e7576dae557ea38.md",
            "Ochette EX": "data/Character Markdown/Ochette EX 1e3ebbc6539680578d1bf7b5d6d4061a.md",
            "Temenos": "data/Character Markdown/Temenos e9618150d4114b5697dbff2052b0ce94.md",
            "Throné": "data/Character Markdown/Throné 3e5b859554994db99efc90e493970dab.md"
            // Add more mappings as needed - this is a starter set for testing
        };
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