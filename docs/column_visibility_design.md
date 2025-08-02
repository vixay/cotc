# Column Visibility System Design

## 1. Predefined Views (Quick Access)

### Basic View (Default)
- Character Name
- A4 Tier  
- Ult Priority
- AS1-AS5 (awakening stones)
- Notes

### Minimal View
- Character Name
- A4 Tier
- Ult Priority
- Notes

### Enhanced View (Full v2 Data)
- Character Name
- Job
- Star Rating
- A4 Tier
- Ult Priority
- AS1-AS5
- Stats (HP, P.Atk, E.Atk)
- Elements/Weapons
- Notes

### Analysis View
- Character Name
- Job
- Star Rating
- A4 Tier
- Ult Priority
- Obtained From
- Free Status
- Notes

### Combat Stats View
- Character Name
- Job
- Star Rating
- Base HP/SP
- P.Atk/E.Atk
- Critical/Speed
- Elements/Weapons

## 2. UI Implementation

### View Selector (Top of filters)
```html
<div class="view-controls">
  <label>View:</label>
  <select id="viewSelector">
    <option value="basic">Basic</option>
    <option value="minimal">Minimal</option>
    <option value="enhanced">Enhanced</option>
    <option value="analysis">Analysis</option>
    <option value="combat">Combat Stats</option>
    <option value="custom">Custom...</option>
  </select>
  <button id="customizeColumns">Customize Columns</button>
</div>
```

### Custom Column Modal
```html
<div id="columnModal" class="modal">
  <div class="modal-content">
    <h3>Customize Columns</h3>
    <div class="column-groups">
      <div class="column-group">
        <h4>Basic Info</h4>
        <label><input type="checkbox" data-column="name" checked disabled> Character Name</label>
        <label><input type="checkbox" data-column="job"> Job</label>
        <label><input type="checkbox" data-column="starRating"> Star Rating</label>
        <label><input type="checkbox" data-column="isFree"> Free Status</label>
      </div>
      
      <div class="column-group">
        <h4>Awakening</h4>
        <label><input type="checkbox" data-column="a4Tier"> A4 Tier</label>
        <label><input type="checkbox" data-column="ultPriority"> Ult Priority</label>
        <label><input type="checkbox" data-column="AS1"> AS1</label>
        <label><input type="checkbox" data-column="AS2"> AS2</label>
        <label><input type="checkbox" data-column="AS3"> AS3</label>
        <label><input type="checkbox" data-column="AS4"> AS4</label>
        <label><input type="checkbox" data-column="AS5"> AS5</label>
      </div>
      
      <div class="column-group">
        <h4>Combat Stats</h4>
        <label><input type="checkbox" data-column="hp"> HP</label>
        <label><input type="checkbox" data-column="sp"> SP</label>
        <label><input type="checkbox" data-column="pAtk"> P.Atk</label>
        <label><input type="checkbox" data-column="eAtk"> E.Atk</label>
        <label><input type="checkbox" data-column="crit"> Critical</label>
        <label><input type="checkbox" data-column="spd"> Speed</label>
      </div>
      
      <div class="column-group">
        <h4>Additional Info</h4>
        <label><input type="checkbox" data-column="elements"> Elements</label>
        <label><input type="checkbox" data-column="weapons"> Weapons</label>
        <label><input type="checkbox" data-column="obtainedFrom"> Obtained From</label>
        <label><input type="checkbox" data-column="notes"> Notes</label>
      </div>
    </div>
    
    <div class="modal-actions">
      <button id="saveColumnSettings">Save</button>
      <button id="resetToDefault">Reset to Default</button>
      <button id="cancelColumnSettings">Cancel</button>
    </div>
  </div>
</div>
```

## 3. Technical Implementation

### Column Configuration
```javascript
const COLUMN_CONFIGS = {
  basic: ['name', 'a4Tier', 'ultPriority', 'AS1', 'AS2', 'AS3', 'AS4', 'AS5', 'notes'],
  minimal: ['name', 'a4Tier', 'ultPriority', 'notes'],
  enhanced: ['name', 'job', 'starRating', 'a4Tier', 'ultPriority', 'AS1', 'AS2', 'AS3', 'AS4', 'AS5', 'hp', 'pAtk', 'eAtk', 'elements', 'weapons', 'notes'],
  analysis: ['name', 'job', 'starRating', 'a4Tier', 'ultPriority', 'obtainedFrom', 'isFree', 'notes'],
  combat: ['name', 'job', 'starRating', 'hp', 'sp', 'pAtk', 'eAtk', 'crit', 'spd', 'elements', 'weapons']
};

const COLUMN_DEFINITIONS = {
  name: { label: 'Character', required: true, sortable: true },
  job: { label: 'Job', required: false, sortable: true },
  starRating: { label: 'Stars', required: false, sortable: true },
  a4Tier: { label: 'A4 Tier', required: false, sortable: true },
  ultPriority: { label: 'Ult Priority', required: false, sortable: true },
  AS1: { label: 'AS1', required: false, sortable: false },
  AS2: { label: 'AS2', required: false, sortable: false },
  AS3: { label: 'AS3', required: false, sortable: false },
  AS4: { label: 'AS4', required: false, sortable: false },
  AS5: { label: 'AS5', required: false, sortable: false },
  hp: { label: 'HP', required: false, sortable: true },
  sp: { label: 'SP', required: false, sortable: true },
  pAtk: { label: 'P.Atk', required: false, sortable: true },
  eAtk: { label: 'E.Atk', required: false, sortable: true },
  crit: { label: 'Crit', required: false, sortable: true },
  spd: { label: 'Speed', required: false, sortable: true },
  elements: { label: 'Elements', required: false, sortable: false },
  weapons: { label: 'Weapons', required: false, sortable: false },
  obtainedFrom: { label: 'Obtained From', required: false, sortable: true },
  isFree: { label: 'Free', required: false, sortable: true },
  notes: { label: 'Notes', required: false, sortable: true }
};
```

### Dynamic Table Generation
```javascript
function generateTableHeaders(visibleColumns) {
  const thead = document.querySelector('#characterTable thead tr');
  thead.innerHTML = '<th class="ownership-header">Own</th>'; // Always show ownership
  
  visibleColumns.forEach(columnKey => {
    const config = COLUMN_DEFINITIONS[columnKey];
    const th = document.createElement('th');
    
    if (config.sortable) {
      th.setAttribute('data-sort', columnKey);
      th.className = 'sortable';
      th.innerHTML = `${config.label} <span class="sort-indicator"></span>`;
    } else {
      th.textContent = config.label;
    }
    
    thead.appendChild(th);
  });
}

function generateTableRow(char, visibleColumns) {
  const cells = ['<td class="ownership-header">...</td>']; // Ownership cell
  
  visibleColumns.forEach(columnKey => {
    cells.push(generateCellContent(char, columnKey));
  });
  
  return cells.join('');
}

function generateCellContent(char, columnKey) {
  switch(columnKey) {
    case 'name':
      return `<td><strong>${char.name}</strong>${char.isFree ? ' <em>(Free)</em>' : ''}</td>`;
    case 'job':
      return `<td>${char.job || ''}</td>`;
    case 'starRating':
      return `<td>${char.starRating ? '⭐'.repeat(char.starRating) : ''}</td>`;
    case 'a4Tier':
      return `<td class="tier-${(char.a4Tier || 'none').toLowerCase().replace('+', '-plus')}">${char.a4Tier || 'Not Listed'}</td>`;
    case 'ultPriority':
      return `<td class="${getUltClass(char.ultPriority)}">${char.ultPriority}</td>`;
    case 'AS1': case 'AS2': case 'AS3': case 'AS4': case 'AS5':
      const stone = char.stones?.[columnKey] || '';
      return `<td class="${getStoneClass(stone)}">${stone}</td>`;
    case 'hp':
      return `<td>${char.stats?.base?.hp || ''}</td>`;
    case 'sp':
      return `<td>${char.stats?.base?.sp || ''}</td>`;
    case 'pAtk':
      return `<td>${char.stats?.base?.pAtk || ''}</td>`;
    case 'eAtk':
      return `<td>${char.stats?.base?.eAtk || ''}</td>`;
    case 'crit':
      return `<td>${char.stats?.base?.crit || ''}</td>`;
    case 'spd':
      return `<td>${char.stats?.base?.spd || ''}</td>`;
    case 'elements':
      return `<td>${char.elements?.join(', ') || ''}</td>`;
    case 'weapons':
      return `<td>${char.weapons?.join(', ') || ''}</td>`;
    case 'obtainedFrom':
      return `<td>${char.obtainedFrom || ''}</td>`;
    case 'isFree':
      return `<td>${char.isFree ? 'Yes' : 'No'}</td>`;
    case 'notes':
      return `<td>${char.notes || ''}</td>`;
    default:
      return '<td></td>';
  }
}
```

## 4. User Experience Benefits

### Quick Access
- **One-click view switching** for common use cases
- **Remembers user preference** via localStorage
- **Responsive design** - fewer columns on mobile

### Flexibility
- **Custom column selection** for power users
- **Drag & drop column reordering** (future enhancement)
- **Export respects visible columns**

### Performance
- **Only renders visible columns** - faster for large datasets
- **Conditional sorting** - only sortable columns get click handlers
- **CSS classes hide/show** instead of DOM manipulation

## 5. Implementation Priority

1. **Phase 1**: Basic view selector with predefined views
2. **Phase 2**: Custom column modal with checkboxes
3. **Phase 3**: localStorage persistence and preferences
4. **Phase 4**: Column reordering and advanced features

This system would give users complete control over their viewing experience while maintaining the current functionality for users who prefer the default view.