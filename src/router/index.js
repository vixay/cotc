import { createRouter, createWebHashHistory } from 'vue-router'

// Import components
import CharacterTable from '../components/CharacterTable.vue'
import LegendSection from '../components/LegendSection.vue'
import StatsSection from '../components/StatsSection.vue'
import FiltersSection from '../components/FiltersSection.vue'
import UnifiedSearchPage from '../components/UnifiedSearchPage.vue'
import CreditsSection from '../components/CreditsSection.vue'

// Home view component
const HomeView = {
  name: 'HomeView',
  components: {
    LegendSection,
    StatsSection,
    FiltersSection,
    CharacterTable
  },
  template: `
    <div>
      <LegendSection />
      <StatsSection />
      <FiltersSection />
      <CharacterTable />
    </div>
  `
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'SearchAll',
    component: UnifiedSearchPage,
    meta: {
      title: 'Search All - Skills & Accessories'
    }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: UnifiedSearchPage,
    props: () => ({ defaultContentType: 'skills' }),
    meta: {
      title: 'Skills Search'
    }
  },
  {
    path: '/accessories', 
    name: 'Accessories',
    component: UnifiedSearchPage,
    props: () => ({ defaultContentType: 'accessories' }),
    meta: {
      title: 'Accessories Search'
    }
  },
  {
    path: '/credits',
    name: 'Credits',
    component: CreditsSection,
    meta: {
      title: 'Credits & Acknowledgments'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - OCTOPATH COTC META GUIDE`
  } else {
    document.title = 'OCTOPATH COTC META GUIDE'
  }
  next()
})

export default router